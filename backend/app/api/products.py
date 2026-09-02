from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.product import Product

router = APIRouter(prefix="/products", tags=["products"])

@router.get("")
@router.get("/")
def list_products(db: Session = Depends(get_db)) -> list[dict]:
    return [serialize_product(product) for product in db.query(Product).filter(Product.is_active.is_(True)).all()]


@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)) -> dict:
    product = db.query(Product).filter(Product.id == product_id, Product.is_active.is_(True)).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return serialize_product(product)


def serialize_product(product: Product) -> dict:
    return {
        "id": product.id,
        "name": product.name,
        "category": product.category.name if product.category else "",
        "price": float(product.price),
        "image": product.image_url,
        "stock_quantity": product.stock_quantity,
    }
