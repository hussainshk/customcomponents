import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  HostBinding,
  AfterViewInit,
  HostListener,
  ViewChild
} from '@angular/core';
import { NG_VALUE_ACCESSOR, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material';

@Component({
  selector: 'cl-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputComponent,
      multi: true
    }
  ]
})
export class InputComponent  
  implements OnInit, AfterViewInit {
  enabled: any;
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
  @Input() public checked = false;
  @Input() public name?: string;
  @Input() public addClass = '';
  @Input() public isReadOnly?: boolean;
  @Input() public autocomplete = false;
  @Input() public isCurrency = false;
  @Input() public isNumberWithCommas = false;
  @Input() public invalid = false;
  @Input() public autoCompletePanel?: MatAutocomplete;
  @Input() public isMatInput?: boolean;
  @Input() public isAutoComplete = false;
  @ViewChild(MatAutocompleteTrigger) public autoCompleteTrigger?: MatAutocompleteTrigger;
  @HostBinding('class.disabled')
  @Input()
  public set disabled(disabled: boolean) {
    // TODO: Disabled is deprecated, use enabled instead
   // this.enabled = !disabled;
  }
  // public get disabled(): boolean {
  //   //return !this.enabled;
  // }

  @Output() OnInputBlur = new EventEmitter();
  @Output() Focus = new EventEmitter<Event>();
  @Output() AnyKeyPress = new EventEmitter<Event>();
  @Output() OnKeyDown = new EventEmitter<Event>();

  private readonly css: { [key: string]: string } = {
    checkbox: 'form-check-input',
    radio: 'form-check-input'
  };

  ngAfterViewInit() {
    const waitTime = 100;
   // setTimeout(() => this.format(), waitTime);
  }

  // close the autocomplete drop down panel if window is scrolled
  // and lose focus
  public closeAutoCompletePanel(event: Event) {
    if (this.isAutoComplete && this.autoCompleteTrigger) {
      this.autoCompleteTrigger.closePanel();
      // if (this.inputRef) {
      //   this.inputRef.nativeElement.blur();
      // }
    }
  }

  public setDisabledState(IsDisabled: boolean): void {
  //  this.enabled = !IsDisabled;
  }

  public upperCaseValue() {
    // if (typeof this.value === 'string') {
    //   this.value = this.value.toUpperCase();
    // }
  }

  public IsChecked(): boolean {
    return this.checked === true;
  }
  public onBlur(): void {
   // this.format();
    // super.onBlur();
    // if (typeof this.value === 'string' && this.value.trim() === '') {
    //   this.value = '';
    // }
    //this.OnInputBlur.emit({ name: this.name, value: this.value });
  }

  // format only if raw value is eligible for formatting and is numeric
  // trim trailing white spaces in raw value before checking IsNumeric
  // skip this if raw value is null or empty, so that we do not format empty spaces with $ symbol
  // public format() {
  //   if ((this.isCurrency || this.isNumberWithCommas) && this.inputRef && this.value) {
  //    // const StrVal = `${this.value}`.trim();
  //     if (StrVal && this.IsNumeric(StrVal)) {
  //       const NumberWithCommas = this.formatNumber(StrVal, true);
  //      // this.inputRef.nativeElement.value = this.isCurrency ? `$${NumberWithCommas}` : NumberWithCommas;
  //     }
  //   }
  // }

  // checks if the value is numeric
  // accepts whole values with or without $ and commas
  // accepts decimal values with or without $ and commas
  private IsNumeric(value: string) {
    return RegExp('^[0-9,.$]*$').test((value));
  }

  OnInit() {
  //  this.addClass += this.css[this.type || ''];
  }

  // split raw value into whole and decimal value
  // remove any exisiting $ and comma from the whole value if passed from API services
  // format the whole value with $ and comma
  // typecast the numeric string so that 0210 can be 210
  // join the whole and decimal value at the end
  formatNumber(value: string, addCommas: boolean): string {
    const currency = `${value}`.split('.');
    const fixedValue = `${+currency[0].replace(/[$,]/g, '')}`;
    currency[0] = addCommas ? fixedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : fixedValue;
    return currency.join('.');
  }

  // apply native element value only if raw value is eligible for formatting and is numeric
  // trim trailing white spaces in raw value before checking IsNumeric
  // skip this if raw value is null or empty
  OnFocus($event: Event) {
    this.Focus.emit($event);
    if ((this.isCurrency || this.isNumberWithCommas) ) {
      const StrVal = ``.trim();
      if (StrVal && this.IsNumeric(StrVal)) {
       // this.inputRef.nativeElement.value = this.formatNumber(StrVal, false);
      }
    }
  }


  OnKeyPress(event: KeyboardEvent) {
    //super.keypress(event);
    this.OnKeyDown.emit(event);
  }

  OnKeyUp(event: KeyboardEvent) {
    this.AnyKeyPress.emit(event);
  }
}
