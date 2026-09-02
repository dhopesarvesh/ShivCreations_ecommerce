from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.core.database import Base, create_db_and_tables, engine
from app.core.security import get_password_hash
from app.models import Category, Product, User


def ensure_database_exists() -> None:
    if settings.database_url.endswith("/rangoli_store"):
        postgres_url = settings.database_url.rsplit("/", 1)[0] + "/postgres"
    else:
        postgres_url = settings.database_url

    admin_engine = create_engine(postgres_url, isolation_level="AUTOCOMMIT")
    with admin_engine.connect() as connection:
        result = connection.execute(
            text("SELECT 1 FROM pg_database WHERE datname = 'rangoli_store'")
        )
        exists = result.scalar() is not None
        if not exists:
            connection.execute(text("CREATE DATABASE rangoli_store"))


def seed_data() -> None:
    SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    session = SessionLocal()

    try:
        admin_email = "admin@shivcreations.com"
        existing_admin = session.query(User).filter(User.email == admin_email).first()
        legacy_admin = session.query(User).filter(User.email == "admin@rangoli.com").first()
        if not existing_admin and legacy_admin:
            legacy_admin.email = admin_email
            existing_admin = legacy_admin
            session.commit()

        if not existing_admin:
            session.add(
                User(
                    name="Admin User",
                    email=admin_email,
                    password_hash=get_password_hash("admin123"),
                    role="admin",
                    is_active=True,
                )
            )
            session.commit()

        customer_email = "user@shivcreations.com"
        existing_customer = session.query(User).filter(User.email == customer_email).first()
        if not existing_customer:
            session.add(
                User(
                    name="Demo Customer",
                    email=customer_email,
                    password_hash=get_password_hash("user123"),
                    role="customer",
                    is_active=True,
                )
            )
            session.commit()

        if not session.query(Category).first():
            categories = [
                Category(name="Flowers", description="Floral patterns and bloom-inspired rangoli designs."),
                Category(name="Letters", description="Custom letters and name-based festive layouts."),
                Category(name="Swastika", description="Traditional auspicious designs for rituals and celebrations."),
            ]
            session.add_all(categories)
            session.commit()

        if not session.query(Product).first():
            flower_category = session.query(Category).filter(Category.name == "Flowers").first()
            letters_category = session.query(Category).filter(Category.name == "Letters").first()
            swastika_category = session.query(Category).filter(Category.name == "Swastika").first()

            products = [
                Product(
                    category_id=flower_category.id,
                    name="Diwali Festival Kit",
                    description="A vibrant floral festival kit for celebrations.",
                    price=349,
                    stock_quantity=25,
                    image_url="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&q=80",
                    is_active=True,
                ),
                Product(
                    category_id=flower_category.id,
                    name="Floral Wall Rangoli",
                    description="Elegant wall-piece rangoli for home styling.",
                    price=599,
                    stock_quantity=18,
                    image_url="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
                    is_active=True,
                ),
                Product(
                    category_id=letters_category.id,
                    name="Custom Name Rangoli",
                    description="Create your personalised message with festive elegance.",
                    price=699,
                    stock_quantity=12,
                    image_url="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=600&q=80",
                    is_active=True,
                ),
                Product(
                    category_id=swastika_category.id,
                    name="Auspicious Swastika Set",
                    description="Traditional auspicious design set for rituals and festive events.",
                    price=499,
                    stock_quantity=20,
                    image_url="https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80",
                    is_active=True,
                ),
            ]
            session.add_all(products)
            session.commit()
    finally:
        session.close()


if __name__ == "__main__":
    ensure_database_exists()
    create_db_and_tables()
    seed_data()
    print("Database initialized and seeded successfully.")
    print("Admin login: admin@shivcreations.com / admin123")
