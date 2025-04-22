from pydantic import BaseModel, EmailStr
from typing import Optional, List
from enum import Enum

class ParentescoEnum(str, Enum):
    amigo = "Amigo"
    hermano = "Hermano"
    pareja = "Pareja"
    compañero_trabajo = "Compañero de trabajo"
    otro = "Otro"

class CategoriaEnum(str, Enum):
    profesional = "Profesional"
    utilidad = "Utilidad"
    academico = "Academico"
    otro = "Otro"

class ContactBase(BaseModel):
    nombre: str
    telefono: str
    email: Optional[EmailStr] = None
    direccion: Optional[str] = None
    lugar: Optional[str] = None  
    parentesco: Optional[ParentescoEnum] = None  
    categoria: Optional[CategoriaEnum] = None  

class ContactCreate(ContactBase):
    pass

class ContactUpdate(ContactBase):
    pass

class ContactInDB(ContactBase):
    id: int
    
    class Config:
        orm_mode = True

# Agregar la clase de paginación
class PaginatedContacts(BaseModel):
    total: int               # Total de registros disponibles
    skip: int                # Cuántos registros se omitieron
    limit: int               # Tamaño de página solicitado
    data: List[ContactInDB]  # Lista de contactos paginados
