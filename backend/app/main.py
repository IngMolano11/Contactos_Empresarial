from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router as contactos_router

app = FastAPI(title="API Contactos MVP")

# Configura CORS para permitir solicitudes desde tu frontend (Angular)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Cambia si tu frontend corre en otro puerto o dominio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Monta el router en /api/contactos
app.include_router(contactos_router, prefix="/api/contactos")
