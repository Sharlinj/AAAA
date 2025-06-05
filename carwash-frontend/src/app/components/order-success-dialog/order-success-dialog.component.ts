import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-order-success-dialog',
  templateUrl: './order-success-dialog.component.html',
  styleUrls: ['./order-success-dialog.component.css']
})
export class OrderSuccessDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
