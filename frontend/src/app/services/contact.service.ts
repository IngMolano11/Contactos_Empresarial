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

  exportToCSV(contacts: Contacto[]): void {
    if (contacts.length === 0) {
      throw new Error('No hay contactos para exportar');
    }

    try {
      // Definir las columnas y headers
      const headers = [
        'Nombre',
        'Teléfono',
        'Email',
        'Dirección',
        'Lugar',
        'Tipo de Contacto',
        'Detalle del Tipo',
        'Tipo de Contacto (Otro)',
        'Detalle del Tipo (Otro)'
      ];

      // Convertir los datos a formato CSV
      const csvData = contacts.map(contact => ([
        this.formatCSVField(contact.nombre),
        this.formatCSVField(contact.telefono),
        this.formatCSVField(contact.email),
        this.formatCSVField(contact.direccion),
        this.formatCSVField(contact.lugar),
        this.formatCSVField(contact.tipo_contacto),
        this.formatCSVField(contact.detalle_tipo),
        this.formatCSVField(contact.tipo_contacto_otro),
        this.formatCSVField(contact.detalle_tipo_otro)
      ]));

      // Crear el contenido del CSV con separador de punto y coma
      let csvContent = headers.join(';') + '\n';
      csvContent += csvData.map(row => row.join(';')).join('\n');

      // Agregar BOM para que Excel reconozca el UTF-8
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });

      // Crear el enlace de descarga
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      // Configurar el nombre del archivo con fecha
      const date = new Date().toLocaleDateString('es-ES').replace(/\//g, '-');
      const filename = `contactos_${date}.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error al generar CSV:', error);
      throw new Error('Error al generar el archivo CSV');
    }
  }

  private formatCSVField(value: any): string {
    if (value === null || value === undefined) return '';
    
    // Convertir a string y escapar comillas dobles
    const stringValue = value.toString();
    
    // Si el valor contiene punto y coma o saltos de línea, encerrarlo en comillas
    if (stringValue.includes(';') || stringValue.includes('\n') || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
  }
}
