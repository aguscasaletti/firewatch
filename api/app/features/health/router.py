from typing import Any
from fastapi import APIRouter

router = APIRouter()


@router.get("/status")
def status() -> Any:
    return 'Up and running!'
