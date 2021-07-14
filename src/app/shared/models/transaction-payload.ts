export class TransactionPayload {
  cardNumber: string;
  cvv: number;
  expiryDate: string;
  destinationUserId: number;
  value: number;
}

export class TransactionForm {
  card: {
    card_number: number;
    cvv: number;
    expiryDate: string;
  };
  value: number;
}
