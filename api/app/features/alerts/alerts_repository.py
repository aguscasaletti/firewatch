from sqlalchemy.orm import Session

from typing import List
from app.db.base_repository import RepositoryBase
from app.models import Alert
from .schemas import AlertCreate, AlertUpdate


class PersistAlertRequest():
    status: str
    camera_id: int
    image_capture: bytes

    def __init__(self, status: str, camera_id: int, image_capture: str):
        self.status = status
        self.camera_id = camera_id
        self.image_capture = image_capture.encode('utf-8')


class AlertsRepository(RepositoryBase[Alert, AlertCreate, AlertUpdate]):
    def search(
        self,
        db: Session,
        status: str = ''
    ) -> List[Alert]:
        query = db.query(Alert).filter(
            Alert.deleted == None,  # noqa
        )

        if status:
            query = query.filter(
                Alert.status == status
            )

        data = query.order_by(Alert.created_date.desc()).all()

        return data

    def find_with_status_and_camera_id(
        self,
        db: Session,
        camera_id: int,
        status: str,
    ) -> List[Alert]:
        query = db.query(Alert).filter(
            Alert.deleted == None,  # noqa
            Alert.camera_id == camera_id,
            Alert.status == status
        )

        data = query.order_by(Alert.id).all()

        return data

    def create_from_request(self, db: Session, *,
                            obj_in: PersistAlertRequest) -> Alert:
        alert = Alert(camera_id=obj_in.camera_id,
                      status=obj_in.status, image_capture=obj_in.image_capture)
        db.add(alert)
        db.commit()
        db.refresh(alert)
        return alert


repository = AlertsRepository(Alert)
