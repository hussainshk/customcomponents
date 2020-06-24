import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
    selector: 'cl-typeahead',
    templateUrl: './typeahead.component.html',
    styleUrls: ['./typeahead.component.scss']
})
export class TypeAheadComponent implements OnInit {
    @Input() public url = '';
    @Input() public query = '';
    @Input() public api = '';
    @Input() public itemTpl = '';
    @Input() public params = '';
    @Input() public itemList: string[] = [];
    @Input() public qParam = '';
    @Input() public ShowLabel = false;
    @Input() public MaxLength?:number;
    @Input() public ShowColor = 'string';
    @Input() public FormControlLabel = '';
    @Input() public allowEmpty = false;
    @Input() public DisplayOnFocus = false;
    @Input() public GoogleLogo = '';

    @Output() taSelected = new EventEmitter<object>();
    @Output() searchText = new EventEmitter<object>();
    @Input() public Error = '';

    constructor() { }

    ngOnInit() { }

    public handleHttpResultSelected(event: object) {
        this.taSelected.next(event);
    }

    public SearchWith(event: object ) {
        this.searchText.next(event);
    }
}
