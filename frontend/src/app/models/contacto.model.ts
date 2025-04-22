export interface Contacto {
  id?: number;
  nombre: string;
  telefono: string;
  email?: string;
  direccion?: string;
  lugar?: string;
  parentesco?: 'Amigo' | 'Hermano' | 'Novio/a' | 'Compañero de trabajo' | 'Otro';
  categoria?: 'Profesional' | 'Utilidad' | 'Academico' | 'Otro';
}
