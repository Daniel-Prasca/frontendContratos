export interface ServicioDto {
  id: number;
  nombre: string;
  precio: number;
  cantidad?: number; // Opcional si no usas edición aquí
  contratoId: number;
  contratoObjeto: string;
}

export interface ServicioCreateDto {
  nombre: string;
  precio: number;
  contratoId: number;
}

export interface ServicioUpdateDto {
  nombre: string;
  precio: number;
  contratoId: number;
}
