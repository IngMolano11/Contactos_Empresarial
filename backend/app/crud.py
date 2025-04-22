from sqlalchemy.orm import Session
from fastapi import HTTPException
from app import models_db, schemas

def get_contact(db: Session, contacto_id: int):
    """
    Obtiene un contacto por su ID.
    """
    return db.query(models_db.ContactModel).filter(models_db.ContactModel.id == contacto_id).first()

def get_contacts(db: Session, skip: int = 0, limit: int = 100):
    """
    Obtiene una lista de contactos con paginación.
    """
    return db.query(models_db.ContactModel).offset(skip).limit(limit).all()

def create_contact(db: Session, contacto: schemas.ContactCreate):
    """
    Crea un nuevo contacto si no existe un correo duplicado.
    """
    # Verifica si el correo ya está registrado
    if db.query(models_db.ContactModel).filter(models_db.ContactModel.email == contacto.email).first():
        raise HTTPException(status_code=400, detail="El correo electrónico ya está registrado.")
    
    # Crea el nuevo contacto si el correo no está registrado
    db_contact = models_db.ContactModel(**contacto.dict())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

def update_contact(db: Session, contacto_id: int, datos: schemas.ContactUpdate):
    """
    Actualiza un contacto si existe.
    """
    contacto_db = get_contact(db, contacto_id)
    if not contacto_db:
        return None
    
    for key, value in datos.dict(exclude_unset=True).items():
        setattr(contacto_db, key, value)
    db.commit()
    db.refresh(contacto_db)
    return contacto_db

def delete_contact(db: Session, contacto_id: int):
    """
    Elimina un contacto por ID si existe.
    """
    contacto_db = get_contact(db, contacto_id)
    if not contacto_db:
        return None
    
    db.delete(contacto_db)
    db.commit()
    return contacto_db
