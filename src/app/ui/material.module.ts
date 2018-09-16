import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

const matcomponents = [
	BrowserAnimationsModule,
	MatBadgeModule,
	MatToolbarModule,
	MatProgressBarModule,
	MatIconModule,
	MatTableModule,
	MatProgressSpinnerModule,
	MatPaginatorModule,
	MatSortModule,
	MatInputModule,
	MatSelectModule,
	MatButtonModule,
	MatCheckboxModule,
	MatCardModule,
	MatDividerModule,
	MatSidenavModule,
	MatListModule,
	MatDialogModule,
	MatMenuModule,
	MatExpansionModule,
	MatStepperModule,
	MatSnackBarModule,
	MatButtonToggleModule,
	MatGridListModule,
	MatTabsModule,
	MatTooltipModule,
	MatRadioModule
];

@NgModule({
	imports: [matcomponents],
	exports: [matcomponents],
	providers: [MatStepper, MatSnackBar]
})
export class MaterialModule { }