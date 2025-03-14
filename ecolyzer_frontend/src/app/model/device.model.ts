export interface Device {
  id: string;
  name: string;
  serialNum: number;
  energyThreshold: number;
  zoneId: string;
  capteurs?: any[];
}

export interface PaginatedDevices {
  content: Device[];
  totalElements: number;
  totalPages: number;
}
