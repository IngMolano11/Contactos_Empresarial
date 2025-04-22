from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()

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

class ContactModel(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True, nullable=False)
    telefono = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    direccion = Column(String, nullable=True)
    lugar = Column(String, nullable=True)
    parentesco = Column(Enum(ParentescoEnum), nullable=True)
    categoria = Column(Enum(CategoriaEnum), nullable=True)
