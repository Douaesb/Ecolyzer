import { Component, OnInit } from '@angular/core';
import {Store } from '@ngrx/store';
import { catchError, forkJoin, Observable, of, take } from 'rxjs';
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
import { CommonModule, DatePipe} from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-energy-consumption',
  templateUrl: './energy-consumption.component.html',
  imports: [CommonModule],
  providers: [DatePipe], 
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
    private datePipe: DatePipe
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

  // New methods for downloading data
  
  downloadCSV(): void {
    this.allSummaries$.pipe(take(1)).subscribe(summaries => {
      if (!summaries || summaries.length === 0) {
        console.error('No data to export');
        return;
      }
      
      // Create CSV content
      const headers = ['Device Name', 'Date', 'Energy Consumption (kWh)', 'Alert Count'];
      const csvRows = [
        headers.join(','),
        ...summaries.map(item => [
          this.escapeCsvValue(item.device?.name || 'N/A'),
          this.escapeCsvValue(this.formatDate(item.date)),
          this.escapeCsvValue(item.totalEnergyConsumption.toFixed(2)),
          this.escapeCsvValue(item.alertCount.toString())
        ].join(','))
      ];
      
      const csvContent = csvRows.join('\n');
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `energy-consumption-${this.formatDate(new Date())}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
  
  downloadPDF(): void {
    this.allSummaries$.pipe(take(1)).subscribe(summaries => {
      if (!summaries || summaries.length === 0) {
        console.error('No data to export');
        return;
      }
  
      // Create PDF document
      const doc = new jsPDF();
  
      // Add title
      doc.setFontSize(18);
      doc.text('Energy Consumption Summary', 14, 22);
  
      // Add date
      doc.setFontSize(11);
      doc.text(`Generated: ${this.formatDate(new Date())}`, 14, 30);
  
      // Create table
      const tableColumn = ['Device Name', 'Date', 'Energy (kWh)', 'Alerts'];
      const tableRows = summaries.map(item => [
        item.device?.name || 'N/A',
        this.formatDate(item.date),
        item.totalEnergyConsumption.toFixed(2),
        item.alertCount.toString()
      ]);
  
      // ✅ Correct way to call autoTable
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        styles: {
          fontSize: 10,
          cellPadding: 3,
          lineWidth: 0.5,
          lineColor: [0, 0, 0]
        },
        headStyles: {
          fillColor: [22, 160, 133],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        }
      });
  
      doc.save(`energy-consumption-${this.formatDate(new Date())}.pdf`);
    });
  }
  
  private escapeCsvValue(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
  
  private formatDate(date: Date | string): string {
    if (!date) return 'N/A';
    return this.datePipe.transform(date, 'yyyy-MM-dd') || 'N/A';
  }


  downloadAllPagesCSV(): void {
    // Show loading indicator
    // You might want to add a loading state to your component
    const loadingElement = document.createElement('div');
    loadingElement.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loadingElement.innerHTML = '<div class="bg-white p-4 rounded shadow-lg">Generating CSV from all pages...</div>';
    document.body.appendChild(loadingElement);

    // Get total pages
    this.totalPages$.pipe(take(1)).subscribe(totalPages => {
      // Create an array of page numbers from 0 to totalPages-1
      const pageNumbers = Array.from({ length: totalPages }, (_, i) => i);
      
      // Create an array of observables, one for each page
      const pageObservables = pageNumbers.map(pageNum => {
        // Dispatch action to load data for this page
        this.store.dispatch(
          EnergyActions.loadAllEnergySummaries({ page: pageNum, size: this.size })
        );
        
        // Return an observable that emits the data for this page
        return this.allSummaries$.pipe(
          take(1),
          catchError(error => {
            console.error(`Error loading page ${pageNum}:`, error);
            return of([]);
          })
        );
      });
      
      // Wait for all page observables to complete
      forkJoin(pageObservables).subscribe(pagesData => {
        // Combine all pages of data
        const allSummaries = pagesData.flat();
        
        // Create CSV content
        const headers = ['Device Name', 'Date', 'Energy Consumption (kWh)', 'Alert Count'];
        const csvRows = [
          headers.join(','),
          ...allSummaries.map(item => [
            this.escapeCsvValue(item.device?.name || 'N/A'),
            this.escapeCsvValue(this.formatDate(item.date)),
            this.escapeCsvValue(item.totalEnergyConsumption.toFixed(2)),
            this.escapeCsvValue(item.alertCount.toString())
          ].join(','))
        ];
        
        const csvContent = csvRows.join('\n');
        
        // Create and download the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `all-energy-consumption-${this.formatDate(new Date())}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Remove loading indicator
        document.body.removeChild(loadingElement);
      });
    });
  }

  // New method to download all pages as PDF
  downloadAllPagesPDF(): void {
    // Show loading indicator
    const loadingElement = document.createElement('div');
    loadingElement.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loadingElement.innerHTML = '<div class="bg-white p-4 rounded shadow-lg">Generating PDF from all pages...</div>';
    document.body.appendChild(loadingElement);

    // Get total pages
    this.totalPages$.pipe(take(1)).subscribe(totalPages => {
      // Create an array of page numbers from 0 to totalPages-1
      const pageNumbers = Array.from({ length: totalPages }, (_, i) => i);
      
      // Create an array of observables, one for each page
      const pageObservables = pageNumbers.map(pageNum => {
        // Dispatch action to load data for this page
        this.store.dispatch(
          EnergyActions.loadAllEnergySummaries({ page: pageNum, size: this.size })
        );
        
        // Return an observable that emits the data for this page
        return this.allSummaries$.pipe(
          take(1),
          catchError(error => {
            console.error(`Error loading page ${pageNum}:`, error);
            return of([]);
          })
        );
      });
      
      // Wait for all page observables to complete
      forkJoin(pageObservables).subscribe(pagesData => {
        // Combine all pages of data
        const allSummaries = pagesData.flat();
        
        // Create PDF document
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(18);
        doc.text('Complete Energy Consumption Summary', 14, 22);
        
        // Add date and record count
        doc.setFontSize(11);
        doc.text(`Generated: ${this.formatDate(new Date())}`, 14, 30);
        doc.text(`Total Records: ${allSummaries.length}`, 14, 36);
        
        // Create table
        const tableColumn = ['Device Name', 'Date', 'Energy (kWh)', 'Alerts'];
        const tableRows = allSummaries.map(item => [
          item.device?.name || 'N/A',
          this.formatDate(item.date),
          item.totalEnergyConsumption.toFixed(2),
          item.alertCount.toString()
        ]);
        
        // Add table to PDF
        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 42,
          styles: {
            fontSize: 10,
            cellPadding: 3,
            lineWidth: 0.5,
            lineColor: [0, 0, 0]
          },
          headStyles: {
            fillColor: [22, 160, 133],
            textColor: 255,
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [240, 240, 240]
          },
          // Handle pagination within PDF
          didDrawPage: (data) => {
            // Add page number at the bottom
            doc.setFontSize(10);
            doc.text(
              `Page ${doc.getNumberOfPages()}`,
              data.settings.margin.left,
              doc.internal.pageSize.height - 10
            );
          }
        });
        
        // Save the PDF
        doc.save(`all-energy-consumption-${this.formatDate(new Date())}.pdf`);
        
        // Remove loading indicator
        document.body.removeChild(loadingElement);
      });
    });
  }
}