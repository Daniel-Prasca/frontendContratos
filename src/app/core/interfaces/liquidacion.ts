export interface LiquidacionDto {
  id: number;
  contratoId: number;
  contratoObjeto: string;
  servicioId: number;
  servicioNombre: string;
  usuarioId: number;
  usuarioNombre: string;
  cantidad: number;
  total: number;
  estado: string;
  fecha: string; // ISO date string
}

export interface LiquidacionCreateDto {
  contratoId: number;
  servicioId: number;
  usuarioId: number;
  cantidad: number;
  total: number;
  estado: string;
}

export interface LiquidacionUpdateDto {
  cantidad: number;
  total: number;
  estado: string;
}
