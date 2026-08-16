from app.db.database import SessionLocal
from app.db.models import User
from app.core.security import hash_password

# has .env admin creds
from app.core.config import settings


def seed_admin():
    db = SessionLocal()

    try:
        existing_admin = (
            db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        )

        if existing_admin:
            print("Admin already exists.")
            return

        admin = User(
            email=settings.ADMIN_EMAIL,
            password_hash=hash_password(settings.ADMIN_PASSWORD),
            role="ADMIN",
        )

        db.add(admin)
        db.commit()

        print(f"Admin created: {settings.ADMIN_EMAIL}")
    except Exception:
        # Roll back anything that happened in this transaction
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_admin()
