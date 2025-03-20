export interface ThresholdAlert {
    id: string;
    deviceName: string;
    deviceId: string;
    thresholdValue: number;
    alertMessage: string;
    active: boolean;
    timestamp: string;
    updatedAt?: string | null;
    receivedAt: string | Date;
    status: 'UNRESOLVED' | 'RESOLVING' | 'RESOLVED';
    isRead?: boolean;
    device?: {         
    id: string;
    name: string;
  };
  }
  