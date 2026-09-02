from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_password_hash, require_admin
from app.models.category import Category
from app.models.order import Order
from app.models.product import Product
from app.models.user import User
from app.schemas.category import CategoryCreate
from app.schemas.product import ProductCreate
from app.schemas.user import AdminUserCreate, AdminUserUpdate

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db), admin: User = Depends(require_admin)) -> dict:
    total_users = db.query(User).count()
    total_products = db.query(Product).count()
    total_categories = db.query(Category).count()
    total_orders = db.query(Order).count()
    total_revenue = sum(
        float(order.total_amount) for order in db.query(Order).all()
    )

    recent_orders = [
        {
            "id": order.id,
            "user_id": order.user_id,
            "total_amount": float(order.total_amount),
            "status": order.status,
            "payment_status": order.payment_status,
        }
        for order in db.query(Order).order_by(Order.id.desc()).limit(5).all()
    ]

    return {
        "stats": {
            "total_users": total_users,
            "total_products": total_products,
            "total_categories": total_categories,
            "total_orders": total_orders,
            "total_revenue": total_revenue,
        },
        "recent_orders": recent_orders,
        "admin": {
            "id": admin.id,
            "name": admin.name,
            "email": admin.email,
        },
    }


@router.get("/users")
def list_users(db: Session = Depends(get_db), admin: User = Depends(require_admin)) -> list[dict]:
    return [serialize_user(user) for user in db.query(User).order_by(User.id.desc()).all()]


@router.post("/users", status_code=201)
def create_user(
    payload: AdminUserCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
) -> dict:
    email = str(payload.email).lower()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=409, detail="A user with this email already exists")
    if payload.role not in {"customer", "admin"}:
        raise HTTPException(status_code=400, detail="Role must be customer or admin")
    if not payload.name.strip() or not payload.password:
        raise HTTPException(status_code=400, detail="Name and password are required")

    user = User(
        name=payload.name.strip(),
        email=email,
        password_hash=get_password_hash(payload.password),
        role=payload.role,
        is_active=payload.is_active,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return serialize_user(user)


@router.put("/users/{user_id}")
def update_user(
    user_id: int,
    payload: AdminUserUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
) -> dict:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    email = str(payload.email).lower()
    if db.query(User).filter(User.email == email, User.id != user_id).first():
        raise HTTPException(status_code=409, detail="A user with this email already exists")
    if payload.role not in {"customer", "admin"}:
        raise HTTPException(status_code=400, detail="Role must be customer or admin")
    if not payload.name.strip():
        raise HTTPException(status_code=400, detail="Name is required")

    user.name = payload.name.strip()
    user.email = email
    user.role = payload.role
    user.is_active = payload.is_active
    if payload.password:
        user.password_hash = get_password_hash(payload.password)
    db.commit()
    db.refresh(user)
    return serialize_user(user)


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
) -> dict:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="You cannot delete your own admin account")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}


def serialize_user(user: User) -> dict:
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "is_active": user.is_active,
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }


@router.get("/products")
def list_products_for_admin(db: Session = Depends(get_db), admin: User = Depends(require_admin)) -> list[dict]:
    products = db.query(Product).all()
    return [
        {
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "price": float(product.price),
            "stock_quantity": product.stock_quantity,
            "image_url": product.image_url,
            "is_active": product.is_active,
            "category_id": product.category_id,
        }
        for product in products
    ]


@router.post("/products")
def create_product(payload: ProductCreate, db: Session = Depends(get_db), admin: User = Depends(require_admin)) -> dict:
    category = db.query(Category).filter(Category.id == payload.category_id).first()
    if not category:
        raise HTTPException(status_code=400, detail="Category not found")
    if not payload.name.strip() or payload.price < 0 or payload.stock_quantity < 0:
        raise HTTPException(status_code=400, detail="Product name, price, and stock must be valid")
    product = Product(
        category_id=payload.category_id,
        name=payload.name,
        description=payload.description,
        price=payload.price,
        stock_quantity=payload.stock_quantity,
        image_url=payload.image_url,
        is_active=payload.is_active,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return serialize_product(product)


@router.put("/products/{product_id}")
def update_product(product_id: int, payload: ProductCreate, db: Session = Depends(get_db), admin: User = Depends(require_admin)) -> dict:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if not db.query(Category).filter(Category.id == payload.category_id).first():
        raise HTTPException(status_code=400, detail="Category not found")
    if not payload.name.strip() or payload.price < 0 or payload.stock_quantity < 0:
        raise HTTPException(status_code=400, detail="Product name, price, and stock must be valid")

    product.category_id = payload.category_id
    product.name = payload.name
    product.description = payload.description
    product.price = payload.price
    product.stock_quantity = payload.stock_quantity
    product.image_url = payload.image_url
    product.is_active = payload.is_active
    db.commit()
    db.refresh(product)
    return serialize_product(product)


@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), admin: User = Depends(require_admin)) -> dict:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Product cannot be deleted because it is used by an order") from exc
    return {"message": "Product deleted successfully"}


def serialize_product(product: Product) -> dict:
    return {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": float(product.price),
        "stock_quantity": product.stock_quantity,
        "image_url": product.image_url,
        "is_active": product.is_active,
        "category_id": product.category_id,
    }


@router.get("/categories")
def list_categories_for_admin(db: Session = Depends(get_db), admin: User = Depends(require_admin)) -> list[dict]:
    return [
        {
            "id": category.id,
            "name": category.name,
            "description": category.description,
            "image_url": category.image_url,
            "is_active": category.is_active,
            "product_count": db.query(Product).filter(Product.category_id == category.id).count(),
        }
        for category in db.query(Category).all()
    ]


@router.post("/categories")
def create_category(payload: CategoryCreate, db: Session = Depends(get_db), admin: User = Depends(require_admin)) -> dict:
    if not payload.name.strip():
        raise HTTPException(status_code=400, detail="Category name is required")
    if db.query(Category).filter(Category.name.ilike(payload.name.strip())).first():
        raise HTTPException(status_code=409, detail="A category with this name already exists")
    category = Category(
        name=payload.name,
        description=payload.description,
        image_url=payload.image_url,
        is_active=payload.is_active,
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return serialize_category(category, db)


@router.put("/categories/{category_id}")
def update_category(category_id: int, payload: CategoryCreate, db: Session = Depends(get_db), admin: User = Depends(require_admin)) -> dict:
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    if not payload.name.strip():
        raise HTTPException(status_code=400, detail="Category name is required")
    if db.query(Category).filter(Category.name.ilike(payload.name.strip()), Category.id != category_id).first():
        raise HTTPException(status_code=409, detail="A category with this name already exists")

    category.name = payload.name
    category.description = payload.description
    category.image_url = payload.image_url
    category.is_active = payload.is_active
    db.commit()
    db.refresh(category)
    return serialize_category(category, db)


@router.delete("/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db), admin: User = Depends(require_admin)) -> dict:
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    if db.query(Product).filter(Product.category_id == category_id).first():
        raise HTTPException(status_code=409, detail="Category cannot be deleted while it has products")
    db.delete(category)
    db.commit()
    return {"message": "Category deleted successfully"}


def serialize_category(category: Category, db: Session) -> dict:
    return {
        "id": category.id,
        "name": category.name,
        "description": category.description,
        "image_url": category.image_url,
        "is_active": category.is_active,
        "product_count": db.query(Product).filter(Product.category_id == category.id).count(),
    }


@router.get("/orders")
def list_orders_for_admin(db: Session = Depends(get_db), admin: User = Depends(require_admin)) -> list[dict]:
    orders = db.query(Order).all()
    return [serialize_admin_order(order) for order in orders]


@router.patch("/orders/{order_id}/status")
def update_order_status(order_id: int, status_value: str, db: Session = Depends(get_db), admin: User = Depends(require_admin)) -> dict:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if status_value not in {"pending", "confirmed", "processing", "shipped", "delivered", "cancelled"}:
        raise HTTPException(status_code=400, detail="Invalid order status")
    order.status = status_value
    db.commit()
    return {"id": order.id, "status": order.status, "message": "Order status updated successfully"}


def serialize_admin_order(order: Order) -> dict:
    return {
        "id": order.id,
        "user_id": order.user_id,
        "customer_name": order.user.name if order.user else "Unknown",
        "customer_email": order.user.email if order.user else "",
        "total_amount": float(order.total_amount),
        "status": order.status,
        "payment_status": order.payment_status,
        "shipping_address": order.shipping_address,
        "created_at": order.created_at.isoformat() if order.created_at else None,
        "items": [
            {"product_name": item.product_name, "price": float(item.price), "quantity": item.quantity}
            for item in order.items
        ],
    }
