import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { PolizaDto, PolizaCreateDto, PolizaUpdateDto } from '../../../core/interfaces/poliza';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class PolizaService {
  private baseURL = environment.apiUrl + '/polizas';

  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  private getHeaders(withAuth = true): HttpHeaders {
    if (!withAuth) return new HttpHeaders();
    const token = this.authService.getToken();
    if (token) return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return new HttpHeaders();
  }

  obtenerPolizas(): Observable<PolizaDto[]> {
    return this.httpClient.get<PolizaDto[]>(this.baseURL, { headers: this.getHeaders() });
  }

  obtenerPolizaPorId(id: number): Observable<PolizaDto> {
    return this.httpClient.get<PolizaDto>(`${this.baseURL}/${id}`, { headers: this.getHeaders() });
  }

  crearPoliza(poliza: PolizaCreateDto): Observable<PolizaDto> {
    return this.httpClient.post<PolizaDto>(this.baseURL, poliza, { headers: this.getHeaders() });
  }

  actualizarPoliza(id: number, poliza: PolizaUpdateDto): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}/${id}`, poliza, { headers: this.getHeaders() });
  }

  eliminarPoliza(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/${id}`, { headers: this.getHeaders() });
  }
}
