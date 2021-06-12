from typing import Any, List
import base64

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.db.base_repository import PaginatedResponse

from .camera_event_repository import repository as camera_events_repository
from .camera_repository import repository as cameras_repository
from .alerts_repository import repository as alerts_repository, PersistAlertRequest

from .schemas import CameraEventRequest, CameraEventResponse, CameraResponse, \
    AlertCreate, AlertResponse, AlertUpdate, CameraUpdate, AlertDetailsResponse
from sqlalchemy.sql import text

router = APIRouter()

ALERTING_THRESHOLD = 40


@router.post("/camera-events", response_model=CameraEventResponse)
def camera_event(
    *,
    db: Session = Depends(deps.get_db),
    request_body: CameraEventRequest,
) -> Any:
    """
    Create new camera event.
    """
    image_capture = request_body.image_capture
    print('inserting bytes count', len(image_capture.encode('utf-8')))
    del request_body.image_capture
    event = camera_events_repository.create(db, obj_in=request_body)

    if request_body.status == 'smoke_detected' \
            and request_body.score \
            and request_body.score > ALERTING_THRESHOLD:
        # If the video source shows smoke with high confidence, create an alert (if there's not one already for this cam)
        pending_alerts = alerts_repository.find_with_status_and_camera_id(
            db, event.camera_id, status='pending_review')
        if not len(pending_alerts):
            # data = {
            #     "status": "pending_review",
            #     "camera_id": event.camera_id,
            #     "image_capture": image_capture
            # }
            # statement = text(
            #     """
            #     declare @im NVARCHAR(MAX);
            #     set @im = :image_capture;
            #     insert into alert(status, camera_id, image_capture)
            #         values (:status, :camera_id, CONVERT(VARBINARY(MAX), @im))
            #     """)
            # db.execute(statement, data)
            # db.commit()

            persist_alert_req = PersistAlertRequest(
                status='pending_review',
                camera_id=event.camera_id,
                image_capture=image_capture
            )
            alerts_repository.create_from_request(db, obj_in=persist_alert_req)

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

    print(alert.image_capture[-100:])
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
