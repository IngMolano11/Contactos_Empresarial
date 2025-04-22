from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.models_db import Base
from app.routes import router as contactos_router

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Contactos MVP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Monta el router en /api/contactos
app.include_router(contactos_router, prefix="/api/contactos")
