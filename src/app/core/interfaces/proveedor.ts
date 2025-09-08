// src/app/core/interfaces/proveedor.models.ts

export interface ProveedorDto {
  id: number;
  nit?: string;
  nombre?: string;
  representanteLegal?: string;
}

export interface ProveedorCreateDto {
  nit: string;
  nombre: string;
  representanteLegal: string;
}

export interface ProveedorUpdateDto {
  nit: string;
  nombre: string;
  representanteLegal: string;
}
