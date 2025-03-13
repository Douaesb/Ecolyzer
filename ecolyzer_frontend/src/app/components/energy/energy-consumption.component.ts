import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  EnergyConsumption,
  EnergyConsumptionSummary,
} from '../../model/energy-consumption.model';
import * as EnergyActions from '../../state/energy/energy-consumption.actions';
import {
  selectCurrentConsumption,
  selectDailySummary,
  selectAllSummaries,
  selectEnergyLoading,
  selectEnergyError,
  selectTotalPages,
  selectTotalElements,
} from '../../state/energy/energy-consumption.selectors';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-energy-consumption',
  templateUrl: './energy-consumption.component.html',
  imports: [DatePipe, CommonModule],
  standalone: true,
})
export class EnergyConsumptionComponent implements OnInit {
  currentConsumption$: Observable<EnergyConsumption | null>;
  dailySummary$: Observable<EnergyConsumptionSummary | null>;
  allSummaries$: Observable<EnergyConsumptionSummary[]>;
  totalPages$: Observable<number>;
  totalEntries$: Observable<number>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  deviceId: string | null = null;
  page = 0;
  size = 10;
  totalEntries = 0;

  constructor(
    private store: Store,
  ) {
    this.currentConsumption$ = this.store.select(selectCurrentConsumption);
    this.dailySummary$ = this.store.select(selectDailySummary);
    this.allSummaries$ = this.store.select(selectAllSummaries);
    this.totalPages$ = this.store.select(selectTotalPages);
    this.loading$ = this.store.select(selectEnergyLoading);
    this.error$ = this.store.select(selectEnergyError);
    this.totalEntries$ = this.store.select(selectTotalElements);
  }

  ngOnInit(): void {
    this.totalEntries$.subscribe((entries) => (this.totalEntries = entries));
    this.loadEnergyData();
  }

  loadEnergyData(): void {
    this.store.dispatch(
      EnergyActions.loadAllEnergySummaries({ page: this.page, size: this.size })
    );
  }

  nextPage(): void {
    this.totalPages$.subscribe((totalPages) => {
      if (this.page < totalPages - 1) {
        this.page++;
        this.loadEnergyData();
      }
    });
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadEnergyData();
    }
  }

  getStartIndex(): number {
    return this.page * this.size;
  }

  getEndIndex(): number {
    return Math.min((this.page + 1) * this.size, this.totalEntries);
  }
}
