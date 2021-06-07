from typing import TYPE_CHECKING
from datetime import datetime

from sqlalchemy import Column, Integer, ForeignKey, String, Float, DateTime
from sqlalchemy.orm import relationship, RelationshipProperty

from .base_class import Base

if TYPE_CHECKING:
    from .camera_event import CameraEvent  # noqa: F401


class Alert(Base):
    id = Column(Integer, primary_key=True, index=True)
    status = Column(String)  # pending_review, discarded, confirmed, finalized
    camera_id = Column(Integer, ForeignKey("camera.id", name="Alert_Camera_FK"))
    camera: RelationshipProperty = relationship('Camera', lazy='joined')
    details = Column(String)
    created_date = Column(DateTime, default=datetime.utcnow)
    location_lat = Column(Float)
    location_lng = Column(Float)
