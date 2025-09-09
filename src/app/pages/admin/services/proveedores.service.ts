import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProveedorDto, ProveedorCreateDto, ProveedorUpdateDto } from '../../../core/interfaces/proveedor';
import { AuthService } from '../../../auth/services/auth.service';
import { UserAuthService } from '../../../auth/services/user.service';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private baseURL = environment.apiUrl + '/proveedores';

  constructor(
    private httpClient: HttpClient,
    private userAuthService: UserAuthService,
    private authService: AuthService
  ) { }

  private getHeaders(withAuth = true): HttpHeaders {
    if (!withAuth) {
      return new HttpHeaders();
    }
    const token = this.authService.getToken();
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return new HttpHeaders();
  }

 
  obtenerProveedores(): Observable<ProveedorDto[]> {
    return this.httpClient.get<ProveedorDto[]>(this.baseURL, { headers: this.getHeaders() });
  }

  obtenerProveedorPorId(id: number): Observable<ProveedorDto> {
    return this.httpClient.get<ProveedorDto>(`${this.baseURL}/${id}`, { headers: this.getHeaders() });
  }

  crearProveedor(proveedor: ProveedorCreateDto): Observable<ProveedorDto> {
    return this.httpClient.post<ProveedorDto>(this.baseURL, proveedor, { headers: this.getHeaders() });
  }


  actualizarProveedor(id: number, proveedor: ProveedorUpdateDto): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}/${id}`, proveedor, { headers: this.getHeaders() });
  }

  eliminarProveedor(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/${id}`, { headers: this.getHeaders() });
  }
}
