from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_contactos():
    return {"message": "API de contactos está funcionando correctamente."}
