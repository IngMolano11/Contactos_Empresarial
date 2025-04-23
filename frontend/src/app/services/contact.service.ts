import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Contacto } from '../models/contacto.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => error);
  }

  getAll(): Observable<Contacto[]> {
    return this.http.get<{ data: Contacto[] }>(this.API).pipe(
      map(response => {
        console.log('Respuesta del servidor:', response);
        return response.data || [];
      }),
      catchError(this.handleError)
    );
  }

  create(contacto: Contacto): Observable<Contacto> {
    return this.http.post<Contacto>(this.API, contacto).pipe(
      catchError(this.handleError)
    );
  }

  update(id: number, contacto: Contacto): Observable<Contacto> {
    return this.http.put<Contacto>(`${this.API}/${id}`, contacto).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<Contacto> {
    return this.http.get<Contacto>(`${this.API}/${id}`);
  }
}
