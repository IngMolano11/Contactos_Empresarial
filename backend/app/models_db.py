from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
from .database import Base
from .models import ParentescoEnum, CategoriaEnum  # Importar desde models.py

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
    parentesco = Column(Enum(ParentescoEnum), nullable=True)  # Usar el enum importado
    parentescoOtro = Column(String, nullable=True)
    categoria = Column(Enum(CategoriaEnum), nullable=True)    # Usar el enum importado
    categoriaOtro = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="contacts")
