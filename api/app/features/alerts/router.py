import os
from .schemas import CameraEventRequest, CameraEventResponse, CameraResponse, \
    AlertResponse, AlertUpdate, CameraUpdate, AlertDetailsResponse
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.db.base_repository import PaginatedResponse

from .camera_event_repository import repository as camera_events_repository
from .camera_repository import repository as cameras_repository
from .alerts_repository import repository as alerts_repository, \
    PersistAlertRequest

from app.clients.sns_client import publish_text_message

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
    print(request_body.score, request_body.status)
    image_capture = request_body.image_capture
    del request_body.image_capture
    event = camera_events_repository.create(db, obj_in=request_body)

    if request_body.status == 'smoke_detected' \
            and request_body.score \
            and request_body.score >= ALERTING_THRESHOLD:
        alerts_pending_or_in_progress = alerts_repository.find_with_status_and_camera_id(
            db, event.camera_id, status=['pending_review', 'confirmed'])
        if not len(alerts_pending_or_in_progress):
            persist_alert_req = PersistAlertRequest(
                status='pending_review',
                camera_id=event.camera_id,
                image_capture=image_capture
            )
            alert = alerts_repository.create_from_request(
                db, obj_in=persist_alert_req)

            # Send notification
            camera = cameras_repository.get(db, event.camera_id)
            destination_phone_number = os.getenv('DEMO_PHONE_NUMBER')
            web_panel_addr = os.getenv('DEMO_WEB_PANEL_ADDR')
            message = f'Se ha detectado un foco de incendio con la cámara "{camera.name}". Ver incidente: {web_panel_addr}/mobile/alerts/{alert.id}/preview'
            publish_text_message(destination_phone_number, message)

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
    status: str = ''
) -> Any:
    """
    Retrieve alerts.
    """

    alerts = alerts_repository.search(db, status=status)

    return alerts


@router.put("/alerts/{id}", response_model=AlertDetailsResponse)
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


@router.post("/alerts/{id}/notifications", response_model=AlertDetailsResponse)
def send_notification(
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

    destination_phone_number = os.getenv('DEMO_PHONE_NUMBER')
    message = f'¡Alerta de incendio forestal en curso en zona {alert.camera.name}! Comunicarse inmediatamente con la central de monitoreo para iniciar acciones de respuesta'
    publish_text_message(destination_phone_number, message)

    return alert


@router.get("/alerts/{id}", response_model=AlertDetailsResponse)
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
