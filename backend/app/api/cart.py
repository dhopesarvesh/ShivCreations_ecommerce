from fastapi import APIRouter

router = APIRouter(prefix="/cart", tags=["cart"])


@router.get("/")
def get_cart() -> dict[str, str]:
    return {"message": "Get cart placeholder"}


@router.post("/items")
def add_cart_item() -> dict[str, str]:
    return {"message": "Add item to cart placeholder"}


@router.put("/items/{item_id}")
def update_cart_item(item_id: int) -> dict[str, int | str]:
    return {"item_id": item_id, "message": "Update cart item placeholder"}


@router.delete("/items/{item_id}")
def delete_cart_item(item_id: int) -> dict[str, int | str]:
    return {"item_id": item_id, "message": "Delete cart item placeholder"}
