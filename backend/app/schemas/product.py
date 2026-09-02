from pydantic import BaseModel


class ProductBase(BaseModel):
    name: str
    description: str | None = None
    price: float
    stock_quantity: int = 0
    image_url: str | None = None
    category_id: int
    is_active: bool = True


class ProductCreate(ProductBase):
    pass


class ProductOut(ProductBase):
    id: int
    is_active: bool
