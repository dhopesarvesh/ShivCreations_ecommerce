from pydantic import BaseModel


class CategoryBase(BaseModel):
    name: str
    description: str | None = None
    image_url: str | None = None
    is_active: bool = True


class CategoryCreate(CategoryBase):
    pass


class CategoryOut(CategoryBase):
    id: int
    is_active: bool
