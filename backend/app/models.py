from enum import Enum

class ParentescoEnum(str, Enum):
    FAMILIAR = "Familiar"
    AMOROSO = "Amoroso"
    AMISTAD = "Amistad"
    LABORAL = "Laboral"
    EDUCATIVO = "Educativo"
    OTRO = "Otro"

class CategoriaEnum(str, Enum):
    PERSONAL = "Personal"
    PROFESIONAL = "Profesional"
    EDUCATIVO = "Educativo"
    SOCIAL = "Social"
    SALUD = "Salud"
    FINANCIERO = "Financiero"
    EMERGENCIA = "Emergencia"
    OTRO = "Otro"