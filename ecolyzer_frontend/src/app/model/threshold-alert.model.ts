export interface ThresholdAlert {
    id: string;
    deviceId: string;
    thresholdValue: number;
    alertMessage: string;
    active: boolean;
    timestamp: string;
    updatedAt?: string | null;
    status: 'UNRESOLVED' | 'RESOLVING' | 'RESOLVED';
  }
  