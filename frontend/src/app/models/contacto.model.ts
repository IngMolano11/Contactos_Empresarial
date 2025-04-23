export type Parentesco = 'Amigo' | 'Hermano' | 'Pareja' | 'Compañero de trabajo' | 'Otro';
export type Categoria = 'Profesional' | 'Utilidad' | 'Academico' | 'Otro';

export interface Contacto {
    id?: number;
    nombre: string;
    telefono: string;
    email?: string;
    direccion?: string;
    lugar?: string;
    parentesco?: Parentesco;
    categoria?: Categoria;
}
