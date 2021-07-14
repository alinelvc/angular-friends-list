import { delay } from "rxjs/operators";
import { TransactionForm } from "src/app/shared/models/transaction-payload";
import { IUser } from "./shared/models/users-interface";

import { Component, OnInit } from "@angular/core";

import { UserService } from "./core/services/user/user.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "Desafio Picpay Front-end";
  friends: IUser[];
  paymentForm: FormGroup;

  creditCards: any;
  userPayment: any;
  inputValue: any;

  msgResponse: string;
  titleResponse: string;

  modal = false;
  modalValidation = false;
  validationSucess = false;
  loading = true;

  selectedPayment = null;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.createForm(new TransactionForm());
  }

  ngOnInit() {
    this.getUserFriends();
    this.getCreditCards();
  }

  createForm(transaction: TransactionForm) {
    this.paymentForm = this.formBuilder.group({
      value: [transaction.card, [Validators.required, Validators.min(0.01)]],
      card: [transaction.card, Validators.required],
    });
  }

  getUserFriends() {
    this.userService.getFriendsList().subscribe(
      (success) => {
        this.loading = false;
        this.friends = success;
      },
      (error) => {
        console.log("Erro na API", error);
      }
    );
  }

  getCreditCards() {
    this.creditCards = this.userService.getCreditCards();
  }

  modalOpen(user: IUser) {
    this.modal = true;
    this.userPayment = user;
  }

  getFinalCardNumber(cardNumber) {
    const lastThreeDigits = cardNumber.substr(-3);
    return lastThreeDigits;
  }

  onSubmit() {
    this.loading = true;
    this.modal = false;
    this.modalValidation = false;

    const cardInfo = this.paymentForm.value.card;
    const transactionPayload = {
      cardNumber: cardInfo.card_number,
      cvv: cardInfo.cvv,
      expiryDate: cardInfo.expiry_date,
      destinationUserId: this.userPayment.id,
      value: this.inputValue,
    };

    this.userService.postPaymentFriend(transactionPayload).subscribe(
      (response) => {
        this.loading = false;
        if (response.success) {
          this.msgResponse = "O pagamento foi concluido com sucesso.";
          this.titleResponse = "Recibo de pagamento";
        } else {
          this.msgResponse = "Pagamento não aprovado.";
          this.titleResponse = "Status de pagamento";
        }

        this.modalValidation = true;
      },
      (error) => {
        this.loading = false;
        console.warn(error);
        this.titleResponse = "Tente novamente mais tarde";
        this.msgResponse = "Parece que algo não deu certo.";
        this.modalValidation = true;
      }
    );
  }

  modalClose() {
    this.modal = false;
    this.modalValidation = false;
    this.paymentForm.reset();
  }

  getCurrency(val) {
    let newVal = val.replace(/\D/g, "");
    this.inputValue = newVal = (newVal / 100).toFixed(2) + "";
  }
}
