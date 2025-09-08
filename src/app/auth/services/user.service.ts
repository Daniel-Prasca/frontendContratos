import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDto, UserRegisterDto, UserUpdateDto } from '../../core/interfaces/auth.models';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private baseURL = "https://localhost:7178/api/users";
  constructor(
    private httpClient: HttpClient,
    private AuthService: AuthService
  ) { }
  private getHeaders(): HttpHeaders {
    const token = this.AuthService.getToken();
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return new HttpHeaders();
  }
  // Obtener todos los usuarios (solo Admin)
  getAllUsers(): Observable<UserDto[]> {
    return this.httpClient.get<UserDto[]>(this.baseURL, { headers: this.getHeaders() });
  }
  // Obtener usuario por Id
  obtenerUsuarioPorId(id: number): Observable<UserDto> {
    return this.httpClient.get<UserDto>(`${this.baseURL}/${id}`, { headers: this.getHeaders() });
  }
  // Registrar usuario (ruta abierta en backend)
  registrarUsuario(user: UserRegisterDto): Observable<UserDto> {
    return this.httpClient.post<UserDto>(`${this.baseURL}/register`, user);
  }
  // Actualizar usuario por Id (solo Admin)
  actualizarUsuario(id: number, user: UserUpdateDto): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}/${id}`, user, { headers: this.getHeaders() });
  }
  // Eliminar usuario por Id (solo Admin)
  eliminarUsuario(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/${id}`, { headers: this.getHeaders() });
  }
}