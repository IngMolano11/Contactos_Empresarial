from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session

from app import crud, schemas
from app.deps import get_db

router = APIRouter()

# Ping de salud
@router.get("/", tags=["Root"])
def ping():
    return {"message": "API de contactos está funcionando correctamente."}

# Crear contacto: POST /api/contactos/
@router.post("/", response_model=schemas.ContactInDB,
             status_code=status.HTTP_201_CREATED, tags=["Contactos"])
def create_contacto(contacto: schemas.ContactCreate,
                    db: Session = Depends(get_db)):
    return crud.create_contact(db, contacto)

# Listar contactos: GET /api/contactos/
@router.get("/", response_model=List[schemas.ContactInDB],
            tags=["Contactos"])
def read_contactos(skip: int = 0, limit: int = 100,
                   db: Session = Depends(get_db)):
    return crud.get_contacts(db, skip=skip, limit=limit)

# Obtener uno: GET /api/contactos/{contacto_id}
@router.get("/{contacto_id}", response_model=schemas.ContactInDB,
            tags=["Contactos"])
def read_contacto(contacto_id: int, db: Session = Depends(get_db)):
    db_contacto = crud.get_contact(db, contacto_id)
    if not db_contacto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Contacto no encontrado")
    return db_contacto

# Actualizar: PUT /api/contactos/{contacto_id}
@router.put("/{contacto_id}", response_model=schemas.ContactInDB,
            tags=["Contactos"])
def update_contacto(contacto_id: int, contacto: schemas.ContactUpdate,
                    db: Session = Depends(get_db)):
    updated = crud.update_contact(db, contacto_id, contacto)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Contacto no encontrado")
    return updated

# Eliminar: DELETE /api/contactos/{contacto_id}
@router.delete("/{contacto_id}", status_code=status.HTTP_204_NO_CONTENT,
               tags=["Contactos"])
def delete_contacto(contacto_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_contact(db, contacto_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Contacto no encontrado")
    return None
