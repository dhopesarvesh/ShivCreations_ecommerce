from pydantic import BaseModel


class OrderCreate(BaseModel):
    shipping_address: str
    items: list["OrderItemCreate"]


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int


class OrderOut(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    shipping_address: str
    payment_status: str
    created_at: str | None = None
    items: list[dict] = []
