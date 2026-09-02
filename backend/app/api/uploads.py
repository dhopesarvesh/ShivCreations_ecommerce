from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.core.security import require_admin
from app.models.user import User

router = APIRouter(prefix="/admin/uploads", tags=["admin uploads"])
UPLOAD_DIR = Path(__file__).resolve().parents[2] / "uploads"
ALLOWED_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif"}
MAX_FILE_SIZE = 5 * 1024 * 1024


@router.post("/image")
async def upload_image(
    image: UploadFile = File(...),
    admin: User = Depends(require_admin),
) -> dict[str, str]:
    extension = ALLOWED_TYPES.get(image.content_type or "")
    if not extension:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, WEBP, and GIF images are supported")

    contents = await image.read(MAX_FILE_SIZE + 1)
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="Image must be 5 MB or smaller")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid4().hex}{extension}"
    (UPLOAD_DIR / filename).write_bytes(contents)
    return {"url": f"/uploads/{filename}"}
