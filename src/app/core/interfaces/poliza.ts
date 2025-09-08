  export interface PolizaDto
  {
      id : number,
      contratoId : number,
      tipo : string,
      fechaVencimiento : string,
      estado : string
  }

  export interface PolizaCreateDto
  {
      contratoId: number,
      tipo : string,
      fechaVencimiento: string,
      estado: string

  }

  export interface PolizaUpdateDto
  {
      tipo: string ,
      fechaVencimiento: string ,
      estado: string

  }