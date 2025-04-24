from pydantic import BaseModel, EmailStr, Field, validator, ConfigDict
from typing import Optional, List
from .models import ParentescoEnum, CategoriaEnum  # Importar desde models.py

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
        description="Teléfono (7-15 dígitos, puede incluir +)"
    )  # Validación por expresión regular

    email: Optional[EmailStr] = None
    direccion: Optional[str] = None
    lugar: Optional[str] = None
    parentesco: Optional[ParentescoEnum] = None
    parentescoOtro: Optional[str] = Field(None, min_length=2, max_length=50)
    categoria: Optional[CategoriaEnum] = None
    categoriaOtro: Optional[str] = Field(None, min_length=2, max_length=50)

    # Validadores modificados para ser más claros
    @validator('parentescoOtro')
    def validate_parentesco_otro(cls, v, values):
        if values.get('parentesco') == 'Otro' and not v:
            raise ValueError('parentescoOtro es requerido cuando parentesco es "Otro"')
        return v

    @validator('categoriaOtro')
    def validate_categoria_otro(cls, v, values):
        if values.get('categoria') == 'Otro' and not v:
            raise ValueError('categoriaOtro es requerido cuando categoria es "Otro"')
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
