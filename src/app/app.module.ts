import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, FormBuilder } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { UserService } from "./core/services/user/user.service";
import { CurrencyMaskDirective } from "./shared/directives/currency-mask.directive";
import { LoadingComponent } from './shared/components/loading/loading.component';

@NgModule({
  declarations: [AppComponent, CurrencyMaskDirective, LoadingComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  providers: [UserService, FormBuilder],
  exports: [CurrencyMaskDirective],
  bootstrap: [AppComponent],
})
export class AppModule {}
