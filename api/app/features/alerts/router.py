from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.db.base_repository import PaginatedResponse

from .camera_event_repository import repository as camera_events_repository
from .camera_repository import repository as cameras_repository
from .alerts_repository import repository as alerts_repository

from .schemas import CameraEventRequest, CameraEventResponse, CameraResponse, AlertCreate, AlertResponse, AlertUpdate, CameraUpdate

router = APIRouter()

ALERTING_THRESHOLD = 60


@router.post("/camera-events", response_model=CameraEventResponse)
def camera_event(
    *,
    db: Session = Depends(deps.get_db),
    request_body: CameraEventRequest,
) -> Any:
    """
    Create new camera event.
    """
    print(request_body)
    event = camera_events_repository.create(db, obj_in=request_body)

    if request_body.status == 'smoke_detected' \
            and request_body.score \
            and request_body.score > ALERTING_THRESHOLD:
        # If the video source shows smoke with high confidence, create an alert (if there's not one already for this cam)
        pending_alerts = alerts_repository.find_with_status_and_camera_id(
            db, event.camera_id, status='pending_review')
        if not len(pending_alerts):
            alert: AlertCreate = AlertCreate(
                status='pending_review',
                camera_id=event.camera_id,
            )
            alerts_repository.create(db, obj_in=alert)

    return event


@router.get("/cameras", response_model=PaginatedResponse[CameraResponse])
def get_cameras(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    order_by: str = 'id',
    desc: bool = False,
) -> Any:
    """
    Retrieve cameras.
    """

    cameras = cameras_repository.get_multi(
        db, order_by, skip=skip, limit=limit, desc=desc)

    return cameras


@router.get("/alerts", response_model=List[AlertResponse])
def get_alerts(
    db: Session = Depends(deps.get_db),
    status: str = 'ok'
) -> Any:
    """
    Retrieve alerts.
    """

    alerts = alerts_repository.find_with_status(db, status=status)

    return alerts


@router.put("/alerts/{id}", response_model=AlertResponse)
def update_alert(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    request_body: AlertUpdate,
) -> Any:
    """
    Update an alert.
    """
    alert = alerts_repository.get(db, id=id)
    if not alert or alert.deleted:
        raise HTTPException(
            status_code=404,
            detail="This entity does not exist in the system",
        )
    alert = alerts_repository.update(db, db_obj=alert, obj_in=request_body)
    return alert


@router.get("/alerts/{id}", response_model=AlertResponse)
def get_alert(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Update an alert.
    """
    alert = alerts_repository.get(db, id=id)
    if not alert or alert.deleted:
        raise HTTPException(
            status_code=404,
            detail="This entity does not exist in the system",
        )

    return alert


@router.put("/cameras/{id}", response_model=CameraResponse)
def update_camera(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    request_body: CameraUpdate,
) -> Any:
    """
    Update an alert.
    """
    camera = cameras_repository.get(db, id=id)
    if not camera or camera.deleted:
        raise HTTPException(
            status_code=404,
            detail="This entity does not exist in the system",
        )
    camera = cameras_repository.update(db, db_obj=camera, obj_in=request_body)
    return camera
