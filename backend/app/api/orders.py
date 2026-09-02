from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.user import User
from app.schemas.order import OrderCreate

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("/", status_code=201)
def create_order(
    payload: OrderCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> dict:
    if not payload.shipping_address.strip() or not payload.items:
        raise HTTPException(status_code=400, detail="Shipping address and cart items are required")

    products = {product.id: product for product in db.query(Product).filter(
        Product.id.in_([item.product_id for item in payload.items]),
        Product.is_active.is_(True),
    ).all()}
    if len(products) != len({item.product_id for item in payload.items}):
        raise HTTPException(status_code=400, detail="One or more products are unavailable")
    if any(item.quantity < 1 or products[item.product_id].stock_quantity < item.quantity for item in payload.items):
        raise HTTPException(status_code=400, detail="Requested quantity is unavailable")

    total = sum(products[item.product_id].price * item.quantity for item in payload.items)
    order = Order(user_id=user.id, total_amount=total, shipping_address=payload.shipping_address.strip())
    db.add(order)
    db.flush()
    for item in payload.items:
        product = products[item.product_id]
        product.stock_quantity -= item.quantity
        db.add(OrderItem(order_id=order.id, product_id=product.id, product_name=product.name, price=product.price, quantity=item.quantity))
    db.commit()
    db.refresh(order)
    return serialize_order(order)


@router.get("/")
def list_orders(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> list[dict]:
    return [serialize_order(order) for order in db.query(Order).filter(Order.user_id == user.id).order_by(Order.created_at.desc()).all()]


@router.get("/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> dict:
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return serialize_order(order)


def serialize_order(order: Order) -> dict:
    return {
        "id": order.id,
        "user_id": order.user_id,
        "total_amount": float(order.total_amount),
        "status": order.status,
        "shipping_address": order.shipping_address,
        "payment_status": order.payment_status,
        "created_at": order.created_at.isoformat() if order.created_at else None,
        "items": [
            {"product_id": item.product_id, "product_name": item.product_name, "price": float(item.price), "quantity": item.quantity}
            for item in order.items
        ],
    }
