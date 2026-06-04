import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { ServicioDto, ServicioCreateDto, ServicioUpdateDto } from '../../../core/interfaces/servicio';
import { UserAuthService } from '../../../auth/services/user.service';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private baseURL = environment.apiUrl + '/servicios';

  constructor(
    private httpClient: HttpClient,
    private userAuthService: UserAuthService,
    private authService: AuthService
  ) {}

  private getHeaders(withAuth = true): HttpHeaders {
    if (!withAuth) return new HttpHeaders();
    const token = this.authService.getToken();
    if (token) return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return new HttpHeaders();
  }

  obtenerServicios(): Observable<ServicioDto[]> {
    return this.httpClient.get<ServicioDto[]>(this.baseURL, { headers: this.getHeaders() });
  }

  obtenerServicioPorId(id: number): Observable<ServicioDto> {
    return this.httpClient.get<ServicioDto>(`${this.baseURL}/${id}`, { headers: this.getHeaders() });
  }

  crearServicio(servicio: ServicioCreateDto): Observable<ServicioDto> {
    return this.httpClient.post<ServicioDto>(this.baseURL, servicio, { headers: this.getHeaders() });
  }

  actualizarServicio(id: number, servicio: ServicioUpdateDto): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}/${id}`, servicio, { headers: this.getHeaders() });
  }

  eliminarServicio(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/${id}`, { headers: this.getHeaders() });
  }
}
