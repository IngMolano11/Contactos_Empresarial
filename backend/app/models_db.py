from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    imagen = Column(Text, nullable=True)  # Cambiado a Text para URLs largas
    telefono = Column(String)
    email = Column(String, nullable=True)
    direccion = Column(String, nullable=True)
    lugar = Column(String, nullable=True)
    tipo_contacto = Column(String, nullable=True)
    tipo_contacto_otro = Column(String, nullable=True)
    detalle_tipo = Column(String, nullable=True)
    detalle_tipo_otro = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="contacts")

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    contacts = relationship("Contact", back_populates="owner")
