import { throwError } from "rxjs";
import {
  transactionMock,
  transactionFailMock,
  apiErrorMock,
  cardsMock,
} from "./../../../shared/mocks/user.mock";

import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed, inject, getTestBed } from "@angular/core/testing";
import { friendsResponseMock } from "src/app/shared/mocks/user.mock";
import { UserService } from "./user.service";

describe("UserService", () => {
  let injector: TestBed;
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    injector = getTestBed();
    service = TestBed.get(UserService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));

  it("getFriendsList() should return data", () => {
    service.getFriendsList().subscribe((success) => {
      expect(success).toEqual(friendsResponseMock);
    });

    const request = httpMock.expectOne(
      "https://www.mocky.io/v2/5d531c4f2e0000620081ddce"
    );
    expect(request.request.method).toBe("GET");
    request.flush(friendsResponseMock);
  });

  it("getCreditCard() should return data", () => {
    const result = service.getCreditCards();

    expect(result).toEqual(cardsMock);
  });

  describe("should test postPaymentFriend", () => {
    it("postPaymentFriend() should return ", () => {
      const MockRespose = { success: true, status: "Aprovada" };

      service.postPaymentFriend(transactionMock).subscribe(async (data) => {
        expect(data).toBeDefined();
        expect(data.status).toBe(201);
        expect(data).toEqual(MockRespose);
      });

      const transactionPayloadUrl =
        "https://run.mocky.io/v3/533cd5d7-63d3-4488-bf8d-4bb8c751c989";

      const req = httpMock.expectOne(transactionPayloadUrl);
      expect(req.request.method).toEqual("POST");
    });

    it("postPaymentFriend() should return unsuccessfully transaction", async () => {
      const MockRespose = { success: false, status: "Reprovada" };

      service.postPaymentFriend(transactionFailMock).subscribe(async (data) => {
        expect(data).toBeDefined();
        expect(data).toEqual(MockRespose);
      });
    });

    it("postPaymentFriend() should return fail", async () => {
      const MockRespose = throwError("API ERROR");

      service.postPaymentFriend(apiErrorMock).subscribe(async (data) => {
        expect(data).toBeDefined();
        expect(data).toEqual(MockRespose);
      });
    });
  });
});
