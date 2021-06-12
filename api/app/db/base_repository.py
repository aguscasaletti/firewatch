from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union, Callable
from datetime import datetime
from pydantic.generics import GenericModel
from pydantic import BaseModel
from sqlalchemy import text, Column

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session, Query

from app.models.base_class import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)
ResponseEntity = TypeVar("ResponseEntity")


class PaginationInfo(BaseModel):
    total_count: int

    class Config:
        orm_mode = True


class PaginatedResponse(Generic[ResponseEntity], GenericModel):
    data: List[ResponseEntity]
    pagination: PaginationInfo

    class Config:
        orm_mode = True


class RepositoryBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        """
        CRUD object with default methods to Create, Read, Update, Delete (CRUD).

        **Parameters**

        * `model`: A SQLAlchemy model class
        * `schema`: A Pydantic model (schema) class
        """
        self.model = model

    def get(self, db: Session, id: Any) -> Optional[ModelType]:
        return db.query(self.model).filter(self.model.id == id).first()

    def get_multi(
        self,
        db: Session,
        order_by: Union[str, Column],
        skip: int = 0,
        limit: int = 100,
        desc=False,
        search_fn: Callable[[Query], Query] = None
    ) -> PaginatedResponse[ModelType]:
        query = db.query(self.model).filter(
            self.model.deleted == None  # noqa
        )
        total_count = query.count()

        if desc:
            order_by = f'{order_by} desc'

        if search_fn:
            query = search_fn(query)

        if isinstance(order_by, str):
            order_by = text(order_by)

        data = query.order_by(order_by).offset(skip).limit(limit).all()

        return PaginatedResponse(data=data, pagination=PaginationInfo(total_count=total_count))

    def create(self, db: Session, *, obj_in: CreateSchemaType) -> ModelType:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data)  # type: ignore
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self,
        db: Session,
        *,
        db_obj: ModelType,
        obj_in: Union[UpdateSchemaType, Dict[str, Any]]
    ) -> ModelType:
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(
        self,
        db: Session,
        *,
        db_obj: ModelType,
    ) -> ModelType:
        db_obj.deleted = datetime.now()
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: int) -> ModelType:
        obj = db.query(self.model).get(id)
        db.delete(obj)
        db.commit()
        return obj
