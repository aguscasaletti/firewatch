from typing import TYPE_CHECKING
from datetime import datetime

from sqlalchemy import Column, Integer, ForeignKey, String, Float, DateTime, LargeBinary
from sqlalchemy.orm import relationship, RelationshipProperty

from .base_class import Base

if TYPE_CHECKING:
    from .camera_event import CameraEvent  # noqa: F401


class Alert(Base):
    id = Column(Integer, primary_key=True, index=True)
    # pending_review, discarded, confirmed, finalized
    status = Column(String(200))
    camera_id = Column(Integer, ForeignKey(
        "camera.id", name="Alert_Camera_FK"))
    camera: RelationshipProperty = relationship('Camera', lazy='joined')
    details = Column(String(5000))
    created_date = Column(DateTime, default=datetime.utcnow)
    location_lat = Column(Float)
    location_lng = Column(Float)
    image_capture = Column(LargeBinary(length=(2**32)-1))
