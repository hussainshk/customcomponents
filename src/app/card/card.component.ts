import { Component, OnInit, Input, Self, SkipSelf, Optional } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  AnimationEvent,
  keyframes
} from '@angular/animations';

// keyframes([
//   style({
//     transform: 'rotateZ(0)',
//     offset: 0
//   }),
//   style({
//     transform: 'rotateZ(180deg)',
//     offset: 1
//   })
// ])

@Component({
  selector: 'cl-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent  implements OnInit {
  @Input() public isOpen = false;
  @Input() public canExpand = true;
  @Input() public canCollapse = true;
  @Input() public showSpinner = false;
  @Input() public addBodyClass = '';
  public state = 'showing-1';
  constructor(
) {
    
  }


  public focus(path: string) {
    this.isOpen = true;
    // Component must expand before we ask the DOM to focus on the component
    setTimeout(() => {
    }, 0);
  }

  public ngOnInit() {
    // Important for component focus
    // Leaving this here so if code is needed for ngOnInit in the future
    // The parent class's ngOnInit is still called
    //super.ngOnInit();
  }

  public registerForFocus(path: string): void {
    //super.registerForFocus(path);
  }

  public get showExpandCollapse() {
    return this.canCollapse || this.canExpand;
  }

  public headerClick() {
    if (this.isOpen && this.canCollapse) {
      this.isOpen = false;
    } else if (!this.isOpen && this.canExpand) {
      this.isOpen = true;
    }
  }

  public animationDone($event: AnimationEvent) {
    if (this.state === 'showing-1') {
      this.state = 'showing-2';
    } else if (this.state === 'showing-2') {
      this.state = 'showing-3';
    } else {
      this.state = 'showing-1';
    }
  }
}
