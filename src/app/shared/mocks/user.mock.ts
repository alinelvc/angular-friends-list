import { TransactionPayload } from "./../models/transaction-payload";
import { Observable } from "rxjs";
import { IUser } from "./../models/users-interface";

export const friendsResponseMock: IUser[] = [
  {
    id: 1001,
    name: "Eduardo Santos",
    img: "https://randomuser.me/api/portraits/men/9.jpg",
    username: "@eduardo.santos",
  },
];

export const cardsMock = [
  // valid card
  {
    card_number: "1111111111111111",
    cvv: 789,
    expiry_date: "01/18",
  },
  // invalid card
  {
    card_number: "4111111111111234",
    cvv: 123,
    expiry_date: "01/20",
  },
  // api error card
  {
    card_number: "8111111111111246",
    cvv: 258,
    expiry_date: "01/23",
  },
];

export const dataSuccessMock = {
  success: true,
  status: "Aprovado",
};

export const dataErrorMock = {
  success: false,
  status: "Reprovado",
};

export const transactionMock: TransactionPayload = {
  cardNumber: "1111111111111111",
  cvv: 789,
  expiryDate: "01/18",
  destinationUserId: 1001,
  value: 20.15,
};

export const transactionFailMock: TransactionPayload = {
  cardNumber: "4111111111111234",
  cvv: 789,
  expiryDate: "01/18",
  destinationUserId: 1001,
  value: 20.15,
};

export const apiErrorMock: TransactionPayload = {
  cardNumber: "8111111111111246",
  cvv: 789,
  expiryDate: "01/18",
  destinationUserId: 1001,
  value: 20.15,
};

export class MockUserService {
  getFriendsList(): Observable<IUser[]> {
    return new Observable((obs) => obs.next(friendsResponseMock));
  }

  getCreditCards() {
    return cardsMock;
  }

  postPaymentFriend(transaction: TransactionPayload): Observable<any> {
    if (transaction.cardNumber === "4111111111111234") {
      return new Observable((obs) => obs.next(dataErrorMock));
    }
    return new Observable((obs) => obs.next(dataSuccessMock));
  }
}
