from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

class ParentescoEnum(str, Enum):
    amigo = "Amigo"
    hermano = "Hermano"
    novio = "Novio/a"
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
