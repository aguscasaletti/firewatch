from app.db.base_repository import RepositoryBase
from app.models import Camera
from .schemas import AlertCreate, AlertUpdate


class CameraRepository(RepositoryBase[Camera, AlertCreate, AlertUpdate]):
    pass


repository = CameraRepository(Camera)
