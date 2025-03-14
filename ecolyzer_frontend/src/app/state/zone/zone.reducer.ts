import { createReducer, on } from '@ngrx/store';
import * as ZoneActions from './zone.actions';
import { Zone } from '../../model/zone.model';

export interface ZoneState {
    zones: Zone[];
    selectedZone: Zone | null;
    loading: boolean;
    error: string | null;
    totalElements: number,
    totalPages: number,
  }
  
  

const initialState: ZoneState = {
  zones: [],
  selectedZone: null,
  loading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
};

export const zoneReducer = createReducer(
    initialState,
    
    on(ZoneActions.loadZones, (state) => ({ ...state, loading: true })),
    on(ZoneActions.loadZonesSuccess, (state, { zones, totalElements, totalPages }) => {
      console.log("Zones received in reducer:", zones);
      return {
        ...state,
        loading: false,
        zones,
        totalElements,
        totalPages,
        error: null
      };
    }),
    on(ZoneActions.loadZonesFailure, (state, { error }) => ({ 
      ...state, 
      loading: false, 
      error 
    })),
    
    on(ZoneActions.loadZoneByIdSuccess, (state, { zone }) => ({ 
      ...state, 
      selectedZone: zone,
      error: null 
    })),
    on(ZoneActions.loadZoneByIdFailure, (state, { error }) => ({ 
      ...state, 
      error 
    })),
    
    on(ZoneActions.createZoneSuccess, (state, { zone }) => ({
      ...state,
      zones: [...state.zones, zone],
      error: null
    })),
    on(ZoneActions.createZoneFailure, (state, { error }) => ({
      ...state,
      error
    })),
    
    on(ZoneActions.updateZoneSuccess, (state, { zone }) => ({
        ...state,
        zones: state.zones.map(item => 
          item.id === zone.id 
            ? { ...item, ...zone, devices: zone.devices || item.devices } 
            : item
        ),
        error: null
      })),
      
    on(ZoneActions.updateZoneFailure, (state, { error }) => ({
      ...state,
      error
    })),
    
    on(ZoneActions.deleteZoneSuccess, (state, { id }) => ({
      ...state,
      zones: state.zones.filter((zone) => zone.id !== id),
      error: null
    })),
    on(ZoneActions.deleteZoneFailure, (state, { error }) => ({
      ...state,
      error
    }))
  );
