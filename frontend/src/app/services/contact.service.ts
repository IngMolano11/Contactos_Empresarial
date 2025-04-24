import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

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

interface PaginatedResponse {
  data: Contacto[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error('Error occurred:', error);
    return throwError(() => error);
  }

  getAll(): Observable<Contacto[]> {
    return this.http.get<PaginatedResponse>(this.API).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  create(contacto: Contacto): Observable<Contacto> {
    console.log('Intentando crear contacto:', contacto);
    return this.http.post<Contacto>(this.API, contacto).pipe(
      catchError(error => {
        console.error('Error al crear contacto:', error);
        if (error.status === 422) {
          console.error('Error de validación:', error.error);
        }
        return throwError(() => error);
      })
    );
  }

  update(id: number, contacto: Contacto): Observable<Contacto> {
    console.log('Actualizando contacto:', id, contacto);
    return this.http.put<Contacto>(`${this.API}/${id}`, contacto).pipe(
      catchError(error => {
        console.error('Error al actualizar contacto:', error);
        return throwError(() => error);
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<Contacto> {
    return this.http.get<Contacto>(`${this.API}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}
