import { createAction, props } from '@ngrx/store';
import { Zone } from '../../model/zone.model';

// Load Zones
export const loadZones = createAction('[Zone] Load Zones', props<{ page: number; size: number }>());
export const loadZonesSuccess = createAction(
    '[Zone] Load Zones Success',
    props<{ zones: Zone[], totalElements: number, totalPages: number }>()
  );
  export const loadZonesFailure = createAction('[Zone] Load Zones Failure', props<{ error: string }>());

// Load Single Zone
export const loadZoneById = createAction('[Zone] Load Zone By ID', props<{ id: string }>());
export const loadZoneByIdSuccess = createAction('[Zone] Load Zone By ID Success', props<{ zone: Zone }>());
export const loadZoneByIdFailure = createAction('[Zone] Load Zone By ID Failure', props<{ error: string }>());

// Create Zone
export const createZone = createAction('[Zone] Create Zone', props<{ zone: Partial<Zone> }>());
export const createZoneSuccess = createAction('[Zone] Create Zone Success', props<{ zone: Zone }>());
export const createZoneFailure = createAction('[Zone] Create Zone Failure', props<{ error: string }>());

// Update Zone
export const updateZone = createAction('[Zone] Update Zone', props<{ id: string; zone: Partial<Zone> }>());
export const updateZoneSuccess = createAction('[Zone] Update Zone Success', props<{ zone: Zone }>());
export const updateZoneFailure = createAction('[Zone] Update Zone Failure', props<{ error: string }>());

// Delete Zone
export const deleteZone = createAction('[Zone] Delete Zone', props<{ id: string }>());
export const deleteZoneSuccess = createAction('[Zone] Delete Zone Success', props<{ id: string }>());
export const deleteZoneFailure = createAction('[Zone] Delete Zone Failure', props<{ error: string }>());
