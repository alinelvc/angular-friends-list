import { Directive, HostListener } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
  selector: "[formControlName][appCurrencyMask]",
})
export class CurrencyMaskDirective {
  constructor(public ngControl: NgControl) {}

  @HostListener("ngModelChange", ["$event"])
  onModelChange(event) {
    this.onInputChange(event);
  }

  onInputChange(event) {
    if (event === null || event === undefined) {
      event = "0";
    }
    let newVal = event.replace(/\D/g, "");
    newVal = (newVal / 100).toFixed(2) + "";
    newVal = newVal.replace(".", ",");
    newVal = newVal.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
    newVal = newVal.replace(/(\d)(\d{3}),/g, "$1.$2,");

    this.ngControl.valueAccessor.writeValue("R$ " + newVal);
  }
}
