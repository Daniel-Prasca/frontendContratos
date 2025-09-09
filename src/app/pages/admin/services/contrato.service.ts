import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { ContratoCreateDto, ContratoDto, ContratoUpdateDto } from '../../../core/interfaces/contrato';
import { UserAuthService } from '../../../auth/services/user.service';
import { environment } from '../../../../environments/environments';


@Injectable({
  providedIn: 'root'
})
export class ContratoService {
  private baseURL = environment.apiUrl + '/contratos';

  constructor(
    private httpClient: HttpClient,
    private userAuthService: UserAuthService,
    private AuthService: AuthService
  ) {}

  private getHeaders(withAuth = true): HttpHeaders {
    if (!withAuth) {
      return new HttpHeaders();
    }
    const token = this.AuthService.getToken();
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return new HttpHeaders();
  }

  obtenerContratos(): Observable<ContratoDto[]> {
    return this.httpClient.get<ContratoDto[]>(this.baseURL, { headers: this.getHeaders() });
  }

  obtenerContratoPorId(id: number): Observable<ContratoDto> {
    return this.httpClient.get<ContratoDto>(`${this.baseURL}/${id}`, { headers: this.getHeaders() });
  }

  crearContrato(contrato: ContratoCreateDto): Observable<ContratoDto> {
    return this.httpClient.post<ContratoDto>(this.baseURL, contrato, { headers: this.getHeaders() });
  }

  actualizarContrato(id: number, contrato: ContratoUpdateDto): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}/${id}`, contrato, { headers: this.getHeaders() });
  }

  eliminarContrato(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/${id}`, { headers: this.getHeaders() });
  }
}
