from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from sqlalchemy.orm import Session

from app import crud, schemas, models_db
from app.deps import get_db
from app.auth import create_access_token, get_current_user
from .models import ParentescoEnum, CategoriaEnum

router = APIRouter()

# ------------------ ENDPOINT DE PRUEBA DE VIDA ------------------
@router.get("/ping", tags=["Root"])
def ping():
    return {"message": "API de contactos está funcionando correctamente."}

# ------------------ CREAR CONTACTO ------------------
# Ahora acepta tanto POST /api/contactos  como POST /api/contactos/
@router.post(
    "",  # ruta raíz del router: /api/contactos
    response_model=schemas.ContactInDB,
    status_code=status.HTTP_201_CREATED,
    tags=["Contactos"]
)
def create_contacto(
    contacto: schemas.ContactCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    try:
        print("Datos recibidos:", contacto.dict())  # Log para depuración
        user = crud.get_user_by_email(db, current_user)
        return crud.create_contact(db, contacto, user.id)
    except Exception as e:
        print("Error al crear contacto:", str(e))  # Log para depuración
        raise HTTPException(
            status_code=422,
            detail=str(e)
        )

# ------------------ LISTAR CONTACTOS ------------------
# Ahora acepta GET /api/contactos  y GET /api/contactos/
@router.get(
    "",  # ruta raíz del router: /api/contactos
    response_model=schemas.PaginatedContacts,
    tags=["Contactos"]
)
def read_contactos(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    q: Optional[str] = None,
    parentesco: Optional[ParentescoEnum] = None,
    categoria: Optional[CategoriaEnum] = None,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    user = crud.get_user_by_email(db, current_user)
    query = db.query(models_db.ContactModel).filter(models_db.ContactModel.owner_id == user.id)
    
    if q:
        query = query.filter(
            (models_db.ContactModel.nombre.ilike(f"%{q}%")) |
            (models_db.ContactModel.email.ilike(f"%{q}%"))
        )
    
    if parentesco:
        query = query.filter(models_db.ContactModel.parentesco == parentesco)
    
    if categoria:
        query = query.filter(models_db.ContactModel.categoria == categoria)
    
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    
    return schemas.PaginatedContacts(
        total=total,
        skip=skip,
        limit=limit,
        data=items
    )

# ------------------ OBTENER CONTACTO POR ID ------------------
@router.get(
    "/{contacto_id}",
    response_model=schemas.ContactInDB,
    tags=["Contactos"]
)
def read_contacto(contacto_id: int, db: Session = Depends(get_db)):
    db_contacto = crud.get_contact(db, contacto_id)
    if not db_contacto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contacto no encontrado")
    return db_contacto

# ------------------ ACTUALIZAR CONTACTO ------------------
@router.put(
    "/{contacto_id}",
    response_model=schemas.ContactInDB,
    tags=["Contactos"]
)
def update_contacto(
    contacto_id: int, 
    contacto: schemas.ContactUpdate, 
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    try:
        print("Actualizando contacto:", contacto_id, contacto.dict())
        user = crud.get_user_by_email(db, current_user)
        updated = crud.update_contact(db, contacto_id, contacto)
        if not updated:
            raise HTTPException(
                status_code=404,
                detail="Contacto no encontrado"
            )
        return updated
    except Exception as e:
        print("Error al actualizar contacto:", str(e))
        raise HTTPException(
            status_code=422,
            detail=str(e)
        )

# ------------------ ELIMINAR CONTACTO ------------------
@router.delete(
    "/{contacto_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["Contactos"]
)
def delete_contacto(contacto_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_contact(db, contacto_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contacto no encontrado")
    return None

# ------------------ SIGNUP ------------------
@router.post("/signup", response_model=schemas.Token)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.create_user(db, user)
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# ------------------ LOGIN ------------------
@router.post("/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
