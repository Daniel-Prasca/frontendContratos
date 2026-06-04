interface Alerta {
  tipo: 'Contrato' | 'Póliza';
  id: number;
  fechaVencimiento: Date;
  diasRestantes: number;
  descripcion: string;  // <- agregar esta línea
}
