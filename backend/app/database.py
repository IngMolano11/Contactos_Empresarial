from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# URL de la base de datos (usa SQLite en este caso)
SQLALCHEMY_DATABASE_URL = "sqlite:///./contacts.db"

# Crea el motor de conexión
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Crea la fábrica de sesiones
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para modelos ORM
Base = declarative_base()

# Dependency de FastAPI para obtener una sesión de DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
