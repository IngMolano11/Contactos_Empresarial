from sqlalchemy.orm import Session
from app import models_db, schemas

def get_contact(db: Session, contacto_id: int):
    return db.query(models_db.ContactModel).filter(models_db.ContactModel.id == contacto_id).first()

def get_contacts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models_db.ContactModel).offset(skip).limit(limit).all()

def create_contact(db: Session, contacto: schemas.ContactCreate):
    db_contact = models_db.ContactModel(**contacto.dict())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

def update_contact(db: Session, contacto_id: int, datos: schemas.ContactUpdate):
    contacto_db = get_contact(db, contacto_id)
    if not contacto_db:
        return None
    for key, value in datos.dict(exclude_unset=True).items():
        setattr(contacto_db, key, value)
    db.commit()
    db.refresh(contacto_db)
    return contacto_db

def delete_contact(db: Session, contacto_id: int):
    contacto_db = get_contact(db, contacto_id)
    if not contacto_db:
        return None
    db.delete(contacto_db)
    db.commit()
    return contacto_db
