import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contacto } from '../models/contacto.model'; // Modelo de Contacto

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private API = 'http://localhost:8000/api/contactos'; // URL de la API

  constructor(private http: HttpClient) {}

  // Obtener todos los contactos
  getAll(): Observable<Contacto[]> {
    return this.http.get<Contacto[]>(`${this.API}/`);
  }

  // Crear un nuevo contacto
  create(c: Contacto): Observable<Contacto> {
    return this.http.post<Contacto>(`${this.API}/`, c);
  }

  // Actualizar un contacto existente
  update(id: number, c: Contacto): Observable<Contacto> {
    return this.http.put<Contacto>(`${this.API}/${id}`, c);
  }

  // Eliminar un contacto
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
