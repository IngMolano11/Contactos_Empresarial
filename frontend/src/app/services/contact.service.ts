import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contacto } from '../models/contacto.model'; // Modelo de Contacto
import { environment } from  '../../environments/environment'; // Importar la configuración de entorno

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private API = environment.apiUrl; // Usar la URL de la API desde el archivo environment.ts

  constructor(private http: HttpClient) {}

  // Obtener todos los contactos
  getAll(): Observable<Contacto[]> {
    return this.http.get<Contacto[]>(`${this.API}/`);  // Usar la URL base de environment
  }

  // Crear un nuevo contacto
  create(c: Contacto): Observable<Contacto> {
    return this.http.post<Contacto>(`${this.API}/`, c);  // Usar la URL base de environment
  }

  // Actualizar un contacto existente
  update(id: number, c: Contacto): Observable<Contacto> {
    return this.http.put<Contacto>(`${this.API}/${id}`, c);  // Usar la URL base de environment
  }

  // Eliminar un contacto
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);  // Usar la URL base de environment
  }
}
