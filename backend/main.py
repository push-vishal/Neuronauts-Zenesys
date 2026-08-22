from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from backend.core.config import get_settings
from backend.core.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup tasks
    print("Initialising database...")
    init_db()
    print("Database ready ✅")
    yield
    # Shutdown tasks (if any)

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
    description="AI-powered invoice & expense audit platform for digital agencies and consultancies. Upload invoices, extract structured data via Google Gemini, and detect billing anomalies automatically.",
    lifespan=lifespan,
)

# CORS Middleware for React frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Open for hackathon simplicity
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


from backend.api.v1.endpoints.invoices import router as invoices_router

# ... inside main.py ...
app.include_router(invoices_router, prefix="/api/v1")
from backend.api.v1.endpoints.expenses import router as expenses_router
app.include_router(expenses_router, prefix="/api/v1")