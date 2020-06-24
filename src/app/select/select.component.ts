import {
  Component,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ElementRef
} from '@angular/core';

import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

function isItem(
  x: ISelectOptionItem | ISelectOptionGroup
): x is ISelectOptionItem {
  const xAny = x as ISelectOptionItem;
  if (xAny.value) {
    return true;
  }
  return false;
}

const tabKey = 'Tab';
const enterKey = 'Enter';
const arrowDownKey = 'ArrowDown';
const arrowUpKey = 'ArrowUp';
const ieArrowDownKey = 'Down';
const ieArrowUpKey = 'Up';


@Component({
  selector: 'cl-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectComponent,
      multi: true
    }
  ]
})
export class SelectComponent extends EnterpriseSelectComponent
  implements OnInit, OnDestroy {
  private _select?: NgSelectComponent;

  public ngSelectValue?: ISelectOptionItem | null;
  @Input() public clearable = true;
  @Input() public ShowDescription = false;
  @Input() public addClass?: string;
  @Input() public searchable = true;
  @Input() public bindLabel?: string;
  @Input() public AddTagFn = null;

  @Input() public hideSelected = false;
  @Output() public Change = new EventEmitter<string | Object>();
  @Input() public IsDuplicateKey = false;

  private readonly descriptions: { [index: string]: string } = {};
  public isIE11 = false;
  public isNonChromiumEdge = false;
  private titleElement?: HTMLElement;

  ngOnInit() {
    super.ngOnInit();
    window.addEventListener('scroll', this.onScroll, true);
    
    // The only IE version we support is 11, so just check for that
    if (/rv:11.0/i.test(navigator.userAgent)) {
      this.isIE11 = true;
    }

    //test for first gen non chromium engine edge-  "Edge" 
    if (/Edge/.test(navigator.userAgent)) {
      this.isNonChromiumEdge = true;
    }

    if (this.data && this.ShowDescription) {
      this.data = this.data.map(option => {
        const valueDescription = this.splitLabelDescription(option.label);

        const value = valueDescription[0].trim();
        const description = valueDescription[1].trim();

        this.descriptions[value] = description || '';
        option.label = value;

        return option;
      });
    }
  }

  focus() {
    if (this.ngSelect) {
      this.ngSelect.focus();
    }
  }

  @ViewChild(NgSelectComponent)
  set ngSelect(select: NgSelectComponent | undefined) {
    this._select = select;

    if (!select) {
      return;
    }
    
    select.handleKeyDown = ($event: KeyboardEvent) => {
      if (select.isOpen || ($event.key === enterKey || this.isArrowDownKey($event.key))) {
        this.handleKey($event);
      }
    };

  }

  get ngSelect(): NgSelectComponent | undefined {
    return this._select;
  }

  private isArrowDownKey(key: string) {
    return (key === arrowDownKey || key === ieArrowDownKey);
  }

  private isArrowUpKey(key: string) {
    return (key === arrowUpKey || key === ieArrowUpKey);
  }

  private handleKey(event: KeyboardEvent) {

    const key: string = event.key;

    if (!this._select || !this._select.itemsList ) {return; }

    if ((event.key === enterKey || this.isArrowDownKey(event.key))  && !this._select.isOpen) {
      this._select.open();
      return;
    }

    if ((key === tabKey || key === enterKey)) {
      this.handleSelectionKeys(event, this._select);
    } else if (this.isArrowDownKey(key)) {
      this.handleArrowDown(event, this._select);
    } else if (this.isArrowUpKey(key)) {
      this.handleArrowUp(event, this._select);
    }

  }

  private handleSelectionKeys(event: KeyboardEvent, select: NgSelectComponent) {
    if (select.itemsList.markedItem) {
      select.toggleItem(select.itemsList.markedItem);
    } else {
      select.filterValue = ' ';
      select.toggle();
    }
    event.preventDefault();
  }

  private handleArrowDown(event: KeyboardEvent, select: NgSelectComponent) {
    if (this._nextItemIsTag(+1)) {
      select.itemsList.unmarkItem();
      this._scrollToTag(select);
    } else {
      select.itemsList.markNextItem();
      this._scrollToMarked(select);
    }
    select.open();
    event.preventDefault();
  }

  private handleArrowUp(event: KeyboardEvent, select: NgSelectComponent) {
    if (!select.isOpen) {return; }
    if (this._nextItemIsTag(-1)) {
      select.itemsList.unmarkItem();
      this._scrollToTag(select);
    } else {
      select.itemsList.markPreviousItem();
      this._scrollToMarked(select);
    }
    event.preventDefault();
  }

  private _addTagFunctionIsDefined(select: NgSelectComponent): boolean {
    let addTagFunctionDefined = false;
    if (select.addTag) {addTagFunctionDefined = true; }
    return addTagFunctionDefined;
  }

  private _filterValueIsDefined(select: NgSelectComponent): boolean {
    let filterValueDefined = false;
    if (select.filterValue) {filterValueDefined = true; }
    return filterValueDefined;
  }

  private _markedItemDefined(select: NgSelectComponent): boolean {
    let markedItemDefined = false;
    if (select.itemsList.markedItem) {markedItemDefined = true; }
    return markedItemDefined;
  }

  private _isTheBeginningOrEndOfItems(select: NgSelectComponent, nextStep: number): boolean {
    const nextIndex = select.itemsList.markedIndex + nextStep;
    let isTheBeginningOrEndOfItems = false;
    if (nextIndex < 0 || nextIndex === select.itemsList.filteredItems.length) {
      isTheBeginningOrEndOfItems = true;
    }
    return isTheBeginningOrEndOfItems;
  }

  private  _nextItemIsTag(nextStep: number): boolean {
    if (!this._select || !this._select.itemsList ) {return false; }

    return this._addTagFunctionIsDefined(this._select) && this._filterValueIsDefined(this._select) &&
      this._markedItemDefined(this._select) && this._isTheBeginningOrEndOfItems(this._select, nextStep);

  }

  private _scrollToTag(select: NgSelectComponent) {
      if (!select.isOpen || !select.dropdownPanel) {
          return;
      }
      select.dropdownPanel.scrollIntoTag();
  }

  private _scrollToMarked(select: NgSelectComponent) {
    if (!select.isOpen || !select.dropdownPanel) {
      return;
    }
    select.dropdownPanel.scrollInto(select.itemsList.markedItem);
  }

  private _scrollingInSelectComponent(target: EventTarget): boolean {
    let scrollingInSelect = false;
    const scrollingElement = (target as HTMLElement);
    if (scrollingElement.className) {
      const eventElement: HTMLElement =  (target as HTMLElement);
      const isPanelItems: boolean = (eventElement.className).indexOf('ng-dropdown-panel-items') > -1;
      const isClSelect: boolean = (eventElement.className).indexOf('cl-select-control') >  -1;
      scrollingInSelect =  isPanelItems || (isPanelItems === false && isClSelect);
    } else if (scrollingElement.tagName) {
      scrollingInSelect = scrollingElement.tagName === 'INPUT';
    }
    return scrollingInSelect;
  }

  private readonly onScroll = (event: Event) => {
    if (this._select && this._select.isOpen && event.target) {

      const dropDownPanel: ElementRef = this._select.dropdownPanel.scrollElementRef;
      dropDownPanel.nativeElement.classList.add('cl-dropdown-panel-scroll');

      if (this._scrollingInSelectComponent(event.target)) {
        return;
      } else {
        this._select.close();
      }
    }
  }

  public readonly onOpen  = (event: Event) => {
    if ((this.isIE11 || this.isNonChromiumEdge) && this._select && this._select.isOpen) {
      document.body.classList.add('cl-select-modal');
      this.titleElement = document.getElementById('brandNav') as HTMLElement;
      this.titleElement.classList.add('cl-select-modal-nav');
    }
  }

  public readonly onClose  = (event: Event) => {
    document.body.classList.remove('cl-select-modal');
    if (this.titleElement) {
      this.titleElement.classList.remove('cl-select-modal-nav');
    }
  }

  public getDescription(value: string): string {
    return this.descriptions[value] || '';
  }

  private splitLabelDescription(value: string): string[] {
    const expectedLength = 2;
    const splitByColon = value.split(':');

    return splitByColon.length === expectedLength ? splitByColon : [value, ''];
  }

  OnChangeCallback = (_?: string) => {};

  registerOnChange(fn: () => {}) {
    this.OnChangeCallback = fn;
  }

  public writeValue(obj: any): void {
    super.writeValue(obj && obj.value);
    if (obj === ' ') {
      this.OnChangeCallback();
    } else if (typeof obj === 'string') {
      this.OnChangeCallback(obj);
    } else {
      this.OnChangeCallback(obj && obj.value);
      if (obj === null) {
        this.ngSelectValue = null;
      }
    }
    this.ngSelectValue = this.getSelectedValue(obj);
  }

  public getSelectedValue(
    obj: string | Object
  ): ISelectOptionItem | null | undefined {
    let isValueChanged = false;
    if (this.data) {
      if (this.IsDuplicateKey) {
        this.data.forEach(x => {
          if (isItem(x) && x.label === obj) {
            this.ngSelectValue = x;
            isValueChanged = true;
          }
        });
      } else {
        this.data.forEach(x => {
          if (isItem(x) && x.value === obj) {
            this.ngSelectValue = x;
            isValueChanged = true;
          }
        });
      }
      this.InputValue(isValueChanged, obj);
    }
    return this.ngSelectValue;
  }

  public InputValue(value: boolean, obj: string | Object) {
    if (!value) {
      this.ngSelectValue = obj as ISelectOptionItem;
    }
  }

  public setDisabledState(IsDisabled: boolean): void {
    this.enabled = !IsDisabled;
  }

  public onBlur(): void {
    this.writeValue(this.ngSelectValue);
  }

  public onModelChange(newVal: any) {
    if (this.ngSelectValue) {
      this.ngSelectValue = newVal;
    }
    if (newVal && newVal !== null) {
      this.writeValue(newVal);
    } else {
      this.writeValue(' ');
    }
    if (this.IsDuplicateKey) {
      this.Change.emit(newVal ? newVal : null);
    } else {
      this.Change.emit(newVal ? newVal.value : null);
    }
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll, true);
  }
}
