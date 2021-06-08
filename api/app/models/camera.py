from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, Float, String
from sqlalchemy.orm import relationship, RelationshipProperty

from .base_class import Base

if TYPE_CHECKING:
    from .camera_event import CameraEvent  # noqa: F401


class Camera(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    status = Column(String)  # ok, warning, fire_in_progress
    location_lat = Column(Float)
    location_lng = Column(Float)
    events: RelationshipProperty = relationship("CameraEvent", back_populates="camera")
    video_source_url = Column(String)
