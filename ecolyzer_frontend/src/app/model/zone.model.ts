export interface Zone {
    id: string;
    name: string;
    description: string;
    location: string;
    devices: string[];
    
  }
  
  export interface PaginatedZones {
    content: Zone[];
    totalElements: number;
    totalPages: number;
  }
  