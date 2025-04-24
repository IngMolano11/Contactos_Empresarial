export type Parentesco = 'Familiar' | 'Amoroso' | 'Amistad' | 'Laboral' | 'Educativo' | 'Otro';
export type Categoria = 'Personal' | 'Profesional' | 'Educativo' | 'Social' | 'Salud' | 'Financiero' | 'Emergencia' | 'Otro';

export interface Contacto {
    id?: number;
    nombre: string;
    telefono: string;
    email?: string;
    direccion?: string;
    lugar?: string;
    parentesco?: Parentesco;
    parentescoOtro?: string;
    categoria?: Categoria;
    categoriaOtro?: string;
}
