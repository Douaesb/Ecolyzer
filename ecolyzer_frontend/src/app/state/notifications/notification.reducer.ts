import { createReducer, on } from '@ngrx/store';
import { 
  addNotification, 
  updateNotification, 
  loadNotifications, 
  loadNotificationsSuccess,
  markAlertAsRead,
  markAlertsAsRead, 
  clearResolvedAlerts,
  filterAlertsByStatus
} from './notification.actions';
import { ThresholdAlert } from '../../model/threshold-alert.model';

export interface NotificationState {
  alerts: ThresholdAlert[];
  filteredAlerts: ThresholdAlert[];
  filterStatus: 'UNRESOLVED' | 'RESOLVING' | 'RESOLVED' | 'ALL';
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  alerts: [],
  filteredAlerts: [],
  filterStatus: 'ALL',
  loading: false,
  error: null
};

// Helper function to persist alerts to localStorage
const persistAlerts = (alerts: ThresholdAlert[]): void => {
  try {
    localStorage.setItem('alerts', JSON.stringify(alerts));
  } catch (error) {
    console.error('❌ Error saving alerts to localStorage:', error);
  }
};

// Helper function to apply filters
const applyFilter = (alerts: ThresholdAlert[], status: 'UNRESOLVED' | 'RESOLVING' | 'RESOLVED' | 'ALL'): ThresholdAlert[] => {
  if (status === 'ALL') {
    return [...alerts];
  }
  return alerts.filter(alert => alert.status === status);
};

export const notificationReducer = createReducer(
  initialState,
  on(loadNotifications, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(loadNotificationsSuccess, (state, { alerts }) => {
    const filteredAlerts = applyFilter(alerts, state.filterStatus);
    return {
      ...state,
      alerts,
      filteredAlerts,
      loading: false
    };
  }),
  
  on(addNotification, (state, { alert }) => {
    // Check for duplicate alerts
    const alertExists = state.alerts.some(existingAlert => existingAlert.id === alert.id);
    if (alertExists) {
      console.log('Duplicate alert detected, skipping addition.');
      return state;
    }
    
    // Add the new alert with timestamps
    const newAlert = { 
      ...alert,
      receivedAt: alert.receivedAt || new Date().toISOString(),
      isRead: false
    };
    
    const updatedAlerts = [newAlert, ...state.alerts];
    persistAlerts(updatedAlerts);
    
    // Apply current filter
    const filteredAlerts = applyFilter(updatedAlerts, state.filterStatus);
    
    return { 
      ...state, 
      alerts: updatedAlerts,
      filteredAlerts
    };
  }),
  
  on(updateNotification, (state, { id, changes }) => {
    const updatedAlerts = state.alerts.map(alert => 
      alert.id === id ? { ...alert, ...changes } : alert
    );
    
    persistAlerts(updatedAlerts);
    const filteredAlerts = applyFilter(updatedAlerts, state.filterStatus);
    
    return {
      ...state,
      alerts: updatedAlerts,
      filteredAlerts
    };
  }),
  
  on(markAlertAsRead, (state, { id }) => {
    const updatedAlerts = state.alerts.map(alert => 
      alert.id === id ? { ...alert, isRead: true } : alert
    );
    
    persistAlerts(updatedAlerts);
    const filteredAlerts = applyFilter(updatedAlerts, state.filterStatus);
    
    return {
      ...state,
      alerts: updatedAlerts,
      filteredAlerts
    };
  }),
  
  on(markAlertsAsRead, (state) => {
    const updatedAlerts = state.alerts.map(alert => ({ ...alert, isRead: true }));
    persistAlerts(updatedAlerts);
    
    const filteredAlerts = applyFilter(updatedAlerts, state.filterStatus);
    
    return { 
      ...state, 
      alerts: updatedAlerts,
      filteredAlerts
    };
  }),
  
  on(clearResolvedAlerts, (state) => {
    const updatedAlerts = state.alerts.filter(alert => alert.status !== "RESOLVED");
    persistAlerts(updatedAlerts);
    
    const filteredAlerts = applyFilter(updatedAlerts, state.filterStatus);
    
    return {
      ...state,
      alerts: updatedAlerts,
      filteredAlerts
    };
  }),
  
  on(filterAlertsByStatus, (state, { status }) => {
    const filteredAlerts = applyFilter(state.alerts, status);
    
    return {
      ...state,
      filterStatus: status,
      filteredAlerts
    };
  })
);
