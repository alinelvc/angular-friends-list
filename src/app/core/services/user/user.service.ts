import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";

import { IUser } from "src/app/shared/models/users-interface";
import { TransactionPayload } from "src/app/shared/models/transaction-payload";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private friendsUrl = "https://www.mocky.io/v2/5d531c4f2e0000620081ddce";

  private transactionPayloadUrl =
    "https://run.mocky.io/v3/533cd5d7-63d3-4488-bf8d-4bb8c751c989";

  private mockData = {
    success: false,
    status: "Reprovada",
  };

  constructor(private http: HttpClient) {}

  getFriendsList(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.friendsUrl);
  }

  getCreditCards() {
    const cards = [
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

    return cards;
  }

  postPaymentFriend(transaction: TransactionPayload): Observable<any> {
    // Condicional criado para demonstração de erro na API com o cartão abaixo
    if (transaction.cardNumber === "8111111111111246") {
      return throwError("API ERROR");
    }

    // Condicional criado para demonstração de erro no Pagamento com o cartão abaixo
    if (transaction.cardNumber === "4111111111111234") {
      return new Observable((obs) => obs.next(this.mockData));
    }

    // Fluxo Normal de pagamento
    return this.http.post<TransactionPayload>(
      this.transactionPayloadUrl,
      transaction
    );
  }
}
