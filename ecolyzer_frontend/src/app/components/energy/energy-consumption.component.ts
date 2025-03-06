    import { Component, OnInit } from '@angular/core';
    import { Store } from '@ngrx/store';
    import { Observable } from 'rxjs';
    import { EnergyConsumption, EnergyConsumptionSummary } from '../../model/energy-consumption.model';
    import * as EnergyActions from '../../state/energy/energy-consumption.actions';
    import { 
    selectCurrentConsumption, 
    selectDailySummary, 
    selectAllSummaries, 
    selectEnergyLoading, 
    selectEnergyError 
    } from '../../state/energy/energy-consumption.selectors';
    import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

    @Component({
    selector: 'app-energy-consumption',
    templateUrl: './energy-consumption.component.html',
    imports: [DatePipe, CommonModule],
    standalone: true
    })
    export class EnergyConsumptionComponent implements OnInit {
    currentConsumption$: Observable<EnergyConsumption | null>;
    dailySummary$: Observable<EnergyConsumptionSummary | null>;
    allSummaries$: Observable<EnergyConsumptionSummary[]>;
    loading$: Observable<boolean>;
    error$: Observable<string | null>;
    deviceId: string | null = null;

    constructor(private store: Store, private route: ActivatedRoute, private router: Router) {
        this.currentConsumption$ = this.store.select(selectCurrentConsumption);
        this.dailySummary$ = this.store.select(selectDailySummary);
        this.allSummaries$ = this.store.select(selectAllSummaries);
        this.loading$ = this.store.select(selectEnergyLoading);
        this.error$ = this.store.select(selectEnergyError);
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const deviceId = params['deviceId'];
            if (deviceId) {
                this.deviceId = deviceId; 
                this.loadEnergyData();
            } else {
                this.router.navigate(['/devices']);
            }
        });
    }
    

    loadEnergyData(): void {
        if (this.deviceId) {
            this.store.dispatch(EnergyActions.loadCurrentEnergyConsumption({ deviceId: this.deviceId }));
        }
        this.store.dispatch(EnergyActions.loadDailyEnergySummary({ deviceId: this.deviceId! }));
        this.store.dispatch(EnergyActions.loadAllEnergySummaries());
    }
    
    }
