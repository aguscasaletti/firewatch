from sqlalchemy.orm import Session

from typing import List
from app.db.base_repository import RepositoryBase
from app.models import Alert
from .schemas import AlertCreate, AlertUpdate


class AlertsRepository(RepositoryBase[Alert, AlertCreate, AlertUpdate]):
    def find_with_status(
        self,
        db: Session,
        status: str
    ) -> List[Alert]:
        query = db.query(self.model).filter(
            Alert.deleted == None,  # noqa
            Alert.status == status
        )

        data = query.order_by(Alert.id).all()

        return data

    def find_with_status_and_camera_id(
        self,
        db: Session,
        camera_id: int,
        status: str,
    ) -> List[Alert]:
        query = db.query(self.model).filter(
            Alert.deleted == None,  # noqa
            Alert.camera_id == camera_id,
            Alert.status == status
        )

        data = query.order_by(Alert.id).all()

        return data


repository = AlertsRepository(Alert)
