import { Component, Input, ContentChild, ElementRef, ViewChild, AfterContentInit } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { SelectComponent } from '../select/select.component';

@Component({
  selector: 'cl-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent  implements AfterContentInit {
  @Input() public addClass = '';
  @Input() QuestionLabelStyle = false;
  @Input() IsHeaderText = false;

  public _css: { [key: string]: string } = {
    text: 'form-group',
    checkbox: 'checkbox checkbox_container',
    header: 'mb-3'
  };

  public controlType?: string;
  public isCheckbox = false;
  public isRadio = false;
  
  @ContentChild(InputComponent)
  private readonly inputComponent?: InputComponent;
  //@ContentChild(YesNoButtonComponent)
  //public readonly YesNoButtonInstance?: YesNoButtonComponent;
  @ContentChild(SelectComponent)
  private readonly selectComponent?: SelectComponent;

  @ViewChild('mainContent')
  private readonly mainContent?:ElementRef;

  // public get isYesNoInvalid(): boolean | undefined {
  //   // if (this.YesNoButtonInstance) {
  //   //   const instance = this.YesNoButtonInstance as unknown as {
  //   //     ngControl: {
  //   //       control: {
  //   //         touched: boolean,
  //   //         invalid: boolean
  //   //       }
  //   //     }
  //   //   };
  //     // return instance.ngControl.control.touched && instance.ngControl.control.invalid;
  //   // }
  // }

  public ngAfterContentInit(): void {
    // super.ngAfterContentInit();
    this.initConditions();
    const css = this.getCss();
    this.addClass += (css && ' ' + css) || null;
  }

  private initConditions() {
   // this.controlType = this.inputComponent && this.inputComponent.type;
    this.isCheckbox = this.controlType === 'checkbox';
    this.isRadio = this.controlType === 'radio';
  }

  private getCss(): string {
    let css = '';
    if (this.IsHeaderText) {
      css = this._css.header;
    }
    else if (this.isRadio) {
      css = 'checkbox_container radio';
    } 
    else {
      css = this._css[this.controlType || 'text'];
    }
    return css;
  }

  // public get isDisabled(): boolean {
  //   return (
  //     this.isInputLabelDisabled() ||
  //     (this.selectComponent)
  //   );
  // }

  private isInputLabelDisabled(): boolean {
    let isDisabled = false;
    if (this.inputComponent) {
      const isCheckboxLabelDisabled =
        this.isCheckbox &&
        this.inputComponent &&
        ;
      const isOtherInputLabelDisabled =
        !this.isCheckbox && !this.inputComponent.enabled;
      isDisabled = isCheckboxLabelDisabled || isOtherInputLabelDisabled;
    }
    return isDisabled;
  }

  public get showPlaceholder() {
    // if (!this.isCheckbox && this.empty && !this.childHasFocus) {
    //   return true;
    // }
    return false;
  }

  public OnClick(event: Event) {
    // if (this.YesNoButtonInstance) {
    //   event.preventDefault();
    // }
  }
}
