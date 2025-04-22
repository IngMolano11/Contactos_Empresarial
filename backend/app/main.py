from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app.models_db import Base
from app.routes import router as contactos_router

# Crear tablas en la base de datos
Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Contactos MVP")


# (No tocamos redirect_slashes, dejamos el comportamiento por defecto para que siempre redirija enrutamientos consistentes)

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Ajusta según tu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Manejador de errores de validación de Pydantic
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "errors": exc.errors(),
            "body": exc.body
        },
    )

# Manejador de errores HTTP (404, 400, etc.)
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )

# Montar el router de contactos en /api/contactos
app.include_router(contactos_router, prefix="/api/contactos")
