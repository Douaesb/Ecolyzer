import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { EnergyConsumption, EnergyConsumptionSummary } from '../../model/energy-consumption.model';

@Component({
  selector: 'app-energy-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './energy-details-modal.component.html',
})
export class EnergyDetailsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<EnergyDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { consumption: EnergyConsumption; summary: EnergyConsumptionSummary }
  ) {}

  closeModal(): void {
    this.dialogRef.close();
  }
}
