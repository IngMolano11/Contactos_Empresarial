from enum import Enum

# class ParentescoEnum(str, Enum):
#     FAMILIAR = "Familiar"
#     AMOROSO = "Amoroso"
#     AMISTAD = "Amistad"
#     LABORAL = "Laboral"
#     EDUCATIVO = "Educativo"
#     OTRO = "Otro"

# class CategoriaEnum(str, Enum):
#     PERSONAL = "Personal"
#     PROFESIONAL = "Profesional"
#     EDUCATIVO = "Educativo"
#     SOCIAL = "Social"
#     SALUD = "Salud"
#     FINANCIERO = "Financiero"
#     EMERGENCIA = "Emergencia"
#     OTRO = "Otro"

class TipoContactoEnum(str, Enum):
    PROVEEDOR = "Proveedor"
    CLIENTE = "Cliente"
    EMPLEADO = "Empleado"
    EXTERNO = "Externo"
    SOCIO = "Socio"
    ALIADO = "Aliado"
    OTRO = "Otro"

class DetalleTipoEnum(str, Enum):
    # Proveedor
    MERCANCIA = "Mercancía"
    SERVICIOS = "Servicios"
    SOFTWARE = "Software"
    INSUMOS = "Insumos"
    LOGISTICA = "Logística"
    # Cliente
    CORPORATIVO = "Corporativo"
    PERSONA_NATURAL = "Persona natural"
    FRECUENTE = "Frecuente"
    POTENCIAL = "Potencial"
    # Empleado
    ADMINISTRATIVO = "Administrativo"
    OPERATIVO = "Operativo"
    FREELANCE = "Freelance"
    TEMPORAL = "Temporal"
    # Externo
    CONSULTOR = "Consultor"
    AUDITOR = "Auditor"
    CONTRATISTA = "Contratista"
    TECNICO = "Técnico"
    # Socio
    INVERSIONISTA = "Inversionista"
    COFUNDADOR = "Co-fundador"
    REPRESENTANTE_LEGAL = "Representante legal"
    # Aliado
    ONG = "ONG"
    ENTIDAD_PUBLICA = "Entidad pública"
    CAMARA_COMERCIO = "Cámara de comercio"
    UNIVERSIDAD = "Universidad"
    # Otro
    OTRO = "Otro"

# Diccionario para validar las relaciones entre tipo y detalle
TIPO_DETALLE_MAPPING = {
    TipoContactoEnum.PROVEEDOR: [
        DetalleTipoEnum.MERCANCIA,
        DetalleTipoEnum.SERVICIOS,
        DetalleTipoEnum.SOFTWARE,
        DetalleTipoEnum.INSUMOS,
        DetalleTipoEnum.LOGISTICA
    ],
    TipoContactoEnum.CLIENTE: [
        DetalleTipoEnum.CORPORATIVO,
        DetalleTipoEnum.PERSONA_NATURAL,
        DetalleTipoEnum.FRECUENTE,
        DetalleTipoEnum.POTENCIAL
    ],
    TipoContactoEnum.EMPLEADO: [
        DetalleTipoEnum.ADMINISTRATIVO,
        DetalleTipoEnum.OPERATIVO,
        DetalleTipoEnum.FREELANCE,
        DetalleTipoEnum.TEMPORAL
    ],
    TipoContactoEnum.EXTERNO: [
        DetalleTipoEnum.CONSULTOR,
        DetalleTipoEnum.AUDITOR,
        DetalleTipoEnum.CONTRATISTA,
        DetalleTipoEnum.TECNICO
    ],
    TipoContactoEnum.SOCIO: [
        DetalleTipoEnum.INVERSIONISTA,
        DetalleTipoEnum.COFUNDADOR,
        DetalleTipoEnum.REPRESENTANTE_LEGAL
    ],
    TipoContactoEnum.ALIADO: [
        DetalleTipoEnum.ONG,
        DetalleTipoEnum.ENTIDAD_PUBLICA,
        DetalleTipoEnum.CAMARA_COMERCIO,
        DetalleTipoEnum.UNIVERSIDAD
    ],
    TipoContactoEnum.OTRO: [DetalleTipoEnum.OTRO]
}