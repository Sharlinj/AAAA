import { Component } from '@angular/core';
import { Payment } from 'src/app/models/payment.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  payment: Payment = {
    orderId: 'ORD001',
    customerId: 'CUST001',
    packageName: 'Premium Wash',
    paymentMode: 'UPI'
  };

  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient) {}

  submitPayment() {
    this.errorMessage = '';
    this.successMessage = '';

    // Validation
    if (this.payment.paymentMode === 'UPI') {
      if (!this.payment.upiId) {
        this.errorMessage = 'Please enter UPI ID.';
        return;
      }
    } else if (this.payment.paymentMode === 'CARD') {
      const { cardHolderName, cardNumber, expiryDate, cvv } = this.payment;
      if (!cardHolderName || !cardNumber || !expiryDate || !cvv) {
        this.errorMessage = 'Please fill all card details.';
        return;
      }
      if (!/^\d{16}$/.test(cardNumber)) {
        this.errorMessage = 'Card number must be 16 digits.';
        return;
      }
      if (!/^\d{3}$/.test(cvv)) {
        this.errorMessage = 'CVV must be 3 digits.';
        return;
      }
    } else if (this.payment.paymentMode === 'NETBANKING') {
      const { bankName, accountNumber, ifscCode } = this.payment;
      if (!bankName || !accountNumber || !ifscCode) {
        this.errorMessage = 'Please fill all net banking details.';
        return;
      }
    } else {
      this.errorMessage = 'Please select a valid payment mode.';
      return;
    }

    // 1️⃣ Step 1: Post Payment to backend
    this.http.post('http://localhost:8082/api/payments', this.payment)
      .subscribe({
        next: () => {
          this.successMessage = '✅ Payment successful!';
          this.createOrder(); // Create order only if payment succeeds
        },
        error: (err) => {
          this.errorMessage = '❌ Payment failed. Please try again.';
          console.error('Payment error:', err);
        }
      });
  }

  // 2️⃣ Step 2: Order creation logic
  createOrder() {
    const orderPayload = {
      customerId: this.payment.customerId,
      packageName: this.payment.packageName,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Placed'
    };

    this.http.post('http://localhost:8081/api/orders', orderPayload)
      .subscribe({
        next: () => {
          this.successMessage += ' Order placed successfully!';
          this.resetForm();
        },
        error: (err) => {
          console.error('Order creation failed:', err);
          this.errorMessage = 'Payment successful, but order failed to place.';
        }
      });
  }

  resetForm() {
    this.payment = {
      orderId: '',
      customerId: '',
      packageName: '',
      paymentMode: 'UPI'
    };
  }
}
