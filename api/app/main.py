from fastapi import FastAPI, Depends
from starlette.middleware.cors import CORSMiddleware

from app.api.api import api_router
from app.core.config import settings
from app.api.deps import verify_authentication_code

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_PATH_PREFIX}/openapi.json",
    dependencies=[Depends(verify_authentication_code)]
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin)
                       for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_PATH_PREFIX)
