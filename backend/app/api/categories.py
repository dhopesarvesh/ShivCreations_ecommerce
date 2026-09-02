from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.category import Category

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("/")
def list_categories(db: Session = Depends(get_db)) -> list[dict]:
    return [serialize_category(category) for category in db.query(Category).filter(Category.is_active.is_(True)).all()]


@router.get("/{category_id}")
def get_category(category_id: int, db: Session = Depends(get_db)) -> dict:
    category = db.query(Category).filter(Category.id == category_id, Category.is_active.is_(True)).first()
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return serialize_category(category)


def serialize_category(category: Category) -> dict:
    return {"id": category.id, "name": category.name, "description": category.description, "image_url": category.image_url}
