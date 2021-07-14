import { LoadingComponent } from "./shared/components/loading/loading.component";
import { throwError } from "rxjs";
import { TestBed, async, ComponentFixture } from "@angular/core/testing";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { UserService } from "./core/services/user/user.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { HttpClientModule } from "@angular/common/http";
import { CurrencyMaskDirective } from "./shared/directives/currency-mask.directive";
import {
  cardsMock,
  friendsResponseMock,
  MockUserService,
} from "./shared/mocks/user.mock";

describe("AppComponent", () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, CurrencyMaskDirective, LoadingComponent],
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        HttpClientModule,
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    userService = TestBed.get(UserService);
  }));

  it("should create the app", () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Desafio Picpay Front-end'`, () => {
    expect(app.title).toEqual("Desafio Picpay Front-end");
  });

  it("should call ngOnInit method", () => {
    const getUserFriendsSpy = spyOn(app, "getUserFriends");
    const getCreditCardsSpy = spyOn(app, "getCreditCards");

    app.ngOnInit();

    expect(getUserFriendsSpy).toHaveBeenCalled();
    expect(getCreditCardsSpy).toHaveBeenCalled();
  });

  it("should return just three numbers", () => {
    const cardNumber = "1111111111111111";

    expect(app.getFinalCardNumber(cardNumber)).toEqual("111");
  });

  it("should return format string", () => {
    app.getCurrency("R$ 10,15");
    expect(app.inputValue).toBe("10.15");
  });

  it("should return a credit card list", () => {
    app.getCreditCards();
    expect(app.creditCards).toEqual(cardsMock);
  });

  describe("should test getUserFriends", () => {
    it("should call getUserFriends method", () => {
      spyOn(userService, "getFriendsList").and.callThrough();

      app.getUserFriends();
      fixture.detectChanges();

      expect(userService.getFriendsList).toHaveBeenCalled();
      expect(app.friends).toEqual(friendsResponseMock);
    });

    it("should call getUserFriends error", () => {
      spyOn(userService, "getFriendsList").and.returnValue(throwError("Error"));

      app.getUserFriends();
      fixture.detectChanges();

      expect(userService.getFriendsList).toHaveBeenCalled();
    });
  });

  describe("should test onSubimit", () => {
    it("should call onSubimit method and return response with success", () => {
      spyOn(userService, "postPaymentFriend").and.callThrough();

      app.userPayment = friendsResponseMock;
      app.paymentForm.controls["value"].setValue("pizza");
      app.paymentForm.controls["card"].setValue(cardsMock[0]);

      app.onSubmit();

      fixture.detectChanges();

      expect(userService.postPaymentFriend).toHaveBeenCalled();
      expect(app.msgResponse).toEqual("O pagamento foi concluido com sucesso.");
      expect(app.titleResponse).toEqual("Recibo de pagamento");
    });

    it("should call onSubimit method and return response without success", () => {
      spyOn(userService, "postPaymentFriend").and.callThrough();

      app.userPayment = friendsResponseMock;
      app.paymentForm.controls["value"].setValue("pizza");
      app.paymentForm.controls["card"].setValue(cardsMock[1]);

      app.onSubmit();

      fixture.detectChanges();

      expect(userService.postPaymentFriend).toHaveBeenCalled();
      expect(app.msgResponse).toEqual("Pagamento não aprovado.");
      expect(app.titleResponse).toEqual("Status de pagamento");
    });

    it("should call onSubimit error", () => {
      spyOn(userService, "postPaymentFriend").and.returnValue(
        throwError("Error")
      );

      app.userPayment = friendsResponseMock;
      app.paymentForm.controls["value"].setValue("pizza");
      app.paymentForm.controls["card"].setValue(cardsMock[0]);

      app.onSubmit();

      fixture.detectChanges();

      expect(userService.postPaymentFriend).toHaveBeenCalled();
      expect(app.msgResponse).toEqual("Parece que algo não deu certo.");
      expect(app.titleResponse).toEqual("Tente novamente mais tarde");
    });
  });

  describe("should test form", () => {
    it("form should be valid", () => {
      app.paymentForm.controls["value"].setValue("20.50");
      app.paymentForm.controls["card"].setValue(cardsMock[0]);
      expect(app.paymentForm.valid).toBeTruthy();
    });

    it("form should be invalid", () => {
      app.paymentForm.controls["value"].setValue("");
      app.paymentForm.controls["card"].setValue("");
      expect(app.paymentForm.valid).toBeFalsy();
    });
  });

  describe("should test modal", () => {
    it("should set modal to true", () => {
      const user = {
        id: 1001,
        name: "Eduardo Santos",
        img: "https://randomuser.me/api/portraits/men/9.jpg",
        username: "@eduardo.santos",
      };
      app.modalOpen(user);
      expect(app.modal).toBeTruthy();
    });

    it("should set modal and modalValidation to false", () => {
      app.modalClose();
      expect(app.modal).toBeFalsy();
      expect(app.modalValidation).toBeFalsy();
    });
  });
});
