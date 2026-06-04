export interface ContratoDto {
  id: number;
  proveedorId: number;
  objeto?: string;
  fechaInicio: string; // ISO string para fechas
  fechaFin: string;
  proveedorNombre?: string;
}

export interface ContratoCreateDto {
  proveedorId: number;
  objeto: string;
  fechaInicio: string; // ISO string
  fechaFin: string;
}

export interface ContratoUpdateDto {
  proveedorId: number;
  objeto: string;
  fechaInicio: string;
  fechaFin: string;
}
