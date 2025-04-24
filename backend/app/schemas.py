from pydantic import BaseModel, EmailStr, Field, validator, ConfigDict
from typing import Optional, List
from enum import Enum

# Enumeración de parentesco
class ParentescoEnum(str, Enum):
    amigo = "Amigo"
    hermano = "Hermano"
    pareja = "Pareja"
    compañero_trabajo = "Compañero de trabajo"
    otro = "Otro"

# Enumeración de categorías
class CategoriaEnum(str, Enum):
    profesional = "Profesional"
    utilidad = "Utilidad"
    academico = "Academico"
    otro = "Otro"

# Clase base para Contacto
class ContactBase(BaseModel):
    nombre: str = Field(
        ...,
        min_length=2,
        max_length=50,
        description="Nombre completo (2–50 caracteres)"
    )  # Validación de longitud mínima/máxima

    telefono: str = Field(
        ...,
        pattern=r'^\+?[0-9]{7,15}$',  # Cambié `regex` por `pattern`
        description="Teléfono con código internacional opcional, 7–15 dígitos"
    )  # Validación por expresión regular

    email: Optional[EmailStr] = None
    direccion: Optional[str] = None
    lugar: Optional[str] = None
    parentesco: Optional[ParentescoEnum] = None
    categoria: Optional[CategoriaEnum] = None

    @validator("nombre")
    @classmethod
    def nombre_sin_numeros(cls, v: str) -> str:
        if any(char.isdigit() for char in v):
            raise ValueError("El nombre no puede contener números")
        return v

# Clase para crear un nuevo contacto (sin cambios respecto a ContactBase)
class ContactCreate(ContactBase):
    pass

# Clase para actualizar un contacto (sin cambios respecto a ContactBase)
class ContactUpdate(ContactBase):
    pass

# Clase para representar un contacto en la base de datos
class ContactInDB(ContactBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)
    
    
# Clase de paginación para los contactos
class PaginatedContacts(BaseModel):
    total: int               # Total de registros disponibles
    skip: int                # Cuántos registros se omitieron
    limit: int               # Tamaño de página solicitado
    data: List[ContactInDB]  # Lista de contactos paginados

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: int
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    username: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str
