from typing import TYPE_CHECKING
from datetime import datetime

from sqlalchemy import Column, Float, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship, RelationshipProperty

from .base_class import Base

if TYPE_CHECKING:
    from .camera import Camera  # noqa: F401


class CameraEvent(Base):
    id = Column(Integer, primary_key=True, index=True)
    status = Column(String)  # ok, smoke_detected
    score = Column(Float)  # confidence score predicted by our NN
    annotated_image = Column(String)  # Base64 annotated image capture
    created_date = Column(DateTime, default=datetime.utcnow)
    camera_id = Column(Integer, ForeignKey("camera.id", name="CameraEvent_Camera_FK"))
    camera: RelationshipProperty = relationship('Camera', lazy='joined')
