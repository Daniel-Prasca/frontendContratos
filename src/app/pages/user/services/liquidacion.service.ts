import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { LiquidacionDto, LiquidacionCreateDto, LiquidacionUpdateDto } from '../../../core/interfaces/liquidacion';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class LiquidacionService {
  private baseURL = environment.apiUrl + '/liquidaciones';
  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  private getHeaders(withAuth = true): HttpHeaders {
    if (!withAuth) return new HttpHeaders();
    const token = this.authService.getToken();
    if (token) return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return new HttpHeaders();
  }

  obtenerLiquidaciones(): Observable<LiquidacionDto[]> {
    return this.httpClient.get<LiquidacionDto[]>(this.baseURL, { headers: this.getHeaders() });
  }

  obtenerLiquidacionPorId(id: number): Observable<LiquidacionDto> {
    return this.httpClient.get<LiquidacionDto>(`${this.baseURL}/${id}`, { headers: this.getHeaders() });
  }

  crearLiquidacion(liquidacion: LiquidacionCreateDto): Observable<LiquidacionDto> {
    return this.httpClient.post<LiquidacionDto>(this.baseURL, liquidacion, { headers: this.getHeaders() });
  }

  obtenerLiquidacionesPorUsuario(usuarioId: number): Observable<LiquidacionDto[]> {
  return this.httpClient.get<LiquidacionDto[]>(`${this.baseURL}/usuario/${usuarioId}`, { headers: this.getHeaders() });
  }

  actualizarLiquidacion(id: number, liquidacion: LiquidacionUpdateDto): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}/${id}`, liquidacion, { headers: this.getHeaders() });
  }

  eliminarLiquidacion(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/${id}`, { headers: this.getHeaders() });
  }
}
