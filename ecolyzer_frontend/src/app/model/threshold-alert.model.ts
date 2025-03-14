export interface ThresholdAlert {
    id: string;
    deviceId: string;
    deviceName: string;
    thresholdValue: number;
    alertMessage: string;
    active: boolean;
    timestamp: string;
    updatedAt?: string | null;
    status: 'UNRESOLVED' | 'RESOLVING' | 'RESOLVED';
  }
  