from fastapi import FastAPI
from app.routes import router as contactos_router

app = FastAPI(title="API Contactos MVP")

# Monta el router en /api/contactos
app.include_router(contactos_router, prefix="/api/contactos")
