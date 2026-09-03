from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class AdminUserCreate(UserBase):
    password: str
    role: str = "customer"
    is_active: bool = True


class AdminUserUpdate(BaseModel):
    name: str
    email: EmailStr
    password: str | None = None
    role: str = "customer"
    is_active: bool = True


class UserOut(UserBase):
    id: int
    role: str
    is_active: bool


class UserProfileUpdate(BaseModel):
    name: str
    email: EmailStr
    current_password: str | None = None
    new_password: str | None = None
