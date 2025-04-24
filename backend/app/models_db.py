from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
import enum

class ParentescoEnum(str, enum.Enum):
    amigo = "Amigo"
    hermano = "Hermano"
    pareja = "Pareja"
    compañero_trabajo = "Compañero de trabajo"
    otro = "Otro"

class CategoriaEnum(str, enum.Enum):
    profesional = "Profesional"
    utilidad = "Utilidad"
    academico = "Academico"
    otro = "Otro"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    contacts = relationship("ContactModel", back_populates="owner")

class ContactModel(Base):
    __tablename__ = "contacts"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    telefono = Column(String)
    email = Column(String, nullable=True)
    direccion = Column(String, nullable=True)
    lugar = Column(String, nullable=True)
    parentesco = Column(String, nullable=True)
    categoria = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="contacts")
