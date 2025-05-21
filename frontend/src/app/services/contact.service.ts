import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Contacto } from '../models/contacto.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private API = environment.apiUrl;
  private errorMessages: { [key: string]: string } = {
    validation_error: 'Por favor, verifica los datos ingresados',
    not_found: 'No se encontró el recurso solicitado',
    upload_error: 'Error al subir la imagen',
    server_error: 'Error interno del servidor',
    unauthorized: 'No tienes permiso para realizar esta acción',
    defaultError: 'Ha ocurrido un error' // Cambiamos 'default' por 'defaultError'
  };

  constructor(private http: HttpClient) {}

  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'Ha ocurrido un error';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = error.error.message;
    } else {
      // Error del servidor
      const errorData = error.error;
      
      if (errorData?.errors) {
        // Múltiples errores de validación
        errorMessage = errorData.errors
          .map((e: any) => {
            const fieldName = this.getFieldDisplayName(e.loc[e.loc.length - 1]);
            return `${fieldName}: ${e.msg}`;
          })
          .join('\n');
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else {
        errorMessage = this.errorMessages[errorData?.type] || this.errorMessages['defaultError']; // Usar notación de corchetes
      }
    }

    console.error('Error:', error);
    return throwError(() => errorMessage);
  }

  private getFieldDisplayName(field: string): string {
    const fieldNames: { [key: string]: string } = {
      nombre: 'Nombre',
      telefono: 'Teléfono',
      email: 'Email',
      direccion: 'Dirección',
      lugar: 'Lugar',
      tipo_contacto: 'Tipo de contacto',
      detalle_tipo: 'Detalle del tipo',
      imagen: 'Imagen'
    };
    return fieldNames[field] || field;
  }

  create(contactData: FormData): Observable<Contacto> {
    return this.http.post<Contacto>(this.API, contactData)
      .pipe(catchError(this.handleError));
  }

  update(id: number, contactData: FormData): Observable<Contacto> {
    return this.http.put<Contacto>(`${this.API}/${id}`, contactData)
      .pipe(catchError(this.handleError));
  }

  getAll(): Observable<Contacto[]> {
    return this.http.get<{data: Contacto[]}>(this.API)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  getById(id: number): Observable<Contacto> {
    return this.http.get<Contacto>(`${this.API}/${id}`)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`).pipe(
        catchError(error => {
            console.error('Error al eliminar contacto:', error);
            let errorMessage = 'Error al eliminar el contacto';
            
            if (error.error?.message) {
                errorMessage = error.error.message;
            }
            
            return throwError(() => errorMessage);
        })
    );
  }
}
