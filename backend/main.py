from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from backend.core.config import get_settings
from backend.core.database import init_db
from backend.api.v1.endpoints.invoices import router as invoices_router
from backend.api.v1.endpoints.expenses import router as expenses_router
from backend.api.v1.endpoints.projects import router as projects_router
from backend.api.v1.endpoints.procurement import router as procurement_router
from backend.api.v1.endpoints.erp import router as erp_router
from backend.api.v1.endpoints.recommendations import router as recommendations_router
from backend.api.v1.endpoints.analytics import router as analytics_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initialising database...")
    init_db()
    print("Database ready [SUCCESS]")
    yield

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
    description="AI-powered procurement, invoice & expense intelligence platform with role-based workflows.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", include_in_schema=False)
def root_redirect():
    return RedirectResponse(url="/docs")

@app.get("/health", tags=["System"])
def health_check():
    return {"status": "online", "app": settings.APP_NAME, "model": settings.GEMINI_MODEL}

app.include_router(invoices_router, prefix="/api/v1")
app.include_router(expenses_router, prefix="/api/v1")
app.include_router(projects_router, prefix="/api/v1")
app.include_router(procurement_router, prefix="/api/v1")
app.include_router(erp_router, prefix="/api/v1")
app.include_router(recommendations_router, prefix="/api/v1")
app.include_router(analytics_router, prefix="/api/v1")