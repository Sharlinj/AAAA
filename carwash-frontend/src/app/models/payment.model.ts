export interface Payment {
  orderId: string;
  customerId: string;
  packageName: string;
  paymentMode: 'UPI' | 'CARD' | 'NETBANKING';
  upiId?: string;
  cardHolderName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
}
