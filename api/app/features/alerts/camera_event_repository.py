from app.db.base_repository import RepositoryBase
from app.models import CameraEvent
from .schemas import CameraEventRequest


class CameraEventRepository(RepositoryBase[CameraEvent, CameraEventRequest, CameraEventRequest]):
    pass


repository = CameraEventRepository(CameraEvent)
