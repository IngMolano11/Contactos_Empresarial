from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from sqlalchemy.orm import Session

from app import crud, schemas, models_db  # Asegúrate de que models_db apunta a tu models.py
from app.deps import get_db  # Esta función debe devolver la sesión de DB

# Creamos el router principal para los endpoints relacionados con contactos
router = APIRouter()

# ------------------ ENDPOINT DE PRUEBA DE VIDA ------------------

# Mover este ping a /ping para evitar conflicto con la raíz de contactos
@router.get("/ping", tags=["Root"])
def ping():
    return {"message": "API de contactos está funcionando correctamente."}

# ------------------ CREAR CONTACTO ------------------

# POST /api/contactos/
@router.post("/", response_model=schemas.ContactInDB,
             status_code=status.HTTP_201_CREATED, tags=["Contactos"])
def create_contacto(contacto: schemas.ContactCreate,
                    db: Session = Depends(get_db)):
    return crud.create_contact(db, contacto)

# ------------------ LISTAR CONTACTOS ------------------

# GET /api/contactos/
@router.get("/", response_model=List[schemas.ContactInDB], tags=["Contactos"])
def read_contactos(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    q: Optional[str] = Query(None, title="Query de búsqueda", description="Filtra contactos por nombre o email"),
    db: Session = Depends(get_db),
):
    """
    - skip: cuántos resultados omitir (paginación).
    - limit: cuántos resultados devolver como máximo.
    - q: búsqueda por nombre o email (opcional).
    """
    query = db.query(models_db.ContactModel)
    if q:
        # Filtro de búsqueda por nombre o email usando ilike (case-insensitive)
        query = query.filter(
            (models_db.ContactModel.nombre.ilike(f"%{q}%")) |
            (models_db.ContactModel.email.ilike(f"%{q}%"))
        )
    return query.offset(skip).limit(limit).all()

# ------------------ OBTENER CONTACTO POR ID ------------------

# GET /api/contactos/{contacto_id}
@router.get("/{contacto_id}", response_model=schemas.ContactInDB, tags=["Contactos"])
def read_contacto(contacto_id: int, db: Session = Depends(get_db)):
    db_contacto = crud.get_contact(db, contacto_id)
    if not db_contacto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Contacto no encontrado")
    return db_contacto

# ------------------ ACTUALIZAR CONTACTO ------------------

# PUT /api/contactos/{contacto_id}
@router.put("/{contacto_id}", response_model=schemas.ContactInDB, tags=["Contactos"])
def update_contacto(contacto_id: int, contacto: schemas.ContactUpdate,
                    db: Session = Depends(get_db)):
    updated = crud.update_contact(db, contacto_id, contacto)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Contacto no encontrado")
    return updated

# ------------------ ELIMINAR CONTACTO ------------------

# DELETE /api/contactos/{contacto_id}
@router.delete("/{contacto_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Contactos"])
def delete_contacto(contacto_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_contact(db, contacto_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Contacto no encontrado")
    return None
