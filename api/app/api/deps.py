from typing import Generator

from fastapi import HTTPException, Header
from app.db.session import SessionLocal


def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


async def verify_authentication_code(x_authorization_code: str = Header(None)):
    if x_authorization_code != "fake-super-secret-token":
        raise HTTPException(status_code=401, detail="Unauthorized")
