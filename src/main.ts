import 'zone.js/dist/zone';
import { Component, importProvidersFrom, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { animate, style, transition, trigger } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const translateLeftRight = trigger('openClose', [
  transition(':enter', [style({ width: 0 }), animate('1s ease-out')]),
  transition(':leave', [animate('1s ease-in', style({ width: 0 }))]),
]);

type CSSUnit = 'px' | 'em' | 'rem' | 'vh' | 'vw';
export type CSSLength = `calc(${string})` | `${number}${CSSUnit}` | '0' | 0;

const expandAnimation = trigger('regularExpand', [
  transition('regularLeft => expandedLeft', [
    animate(
      '0.5s ease-out',
      style({
        width: '{{expandedWidth}}',
        height: '{{expandedHeight}}',
        top: '{{expandedTop}}',
        left: '{{expandedLeft}}',
      })
    ),
  ]),
  transition('expandedLeft => regularLeft', [
    animate(
      '0.5s ease-in',
      style({
        width: '{{regularWidth}}',
        height: '{{regularHeight}}',
        top: '{{regularTop}}',
        left: '{{regularLeft}}',
      })
    ),
  ]),
  transition('regularRight => expandedRight', [
    animate(
      '0.5s ease-out',
      style({
        width: '{{expandedWidth}}',
        height: '{{expandedHeight}}',
        top: '{{expandedTop}}',
        right: '{{expandedRight}}',
      })
    ),
  ]),
  transition('expandedRight => regularRight', [
    animate(
      '0.5s ease-in',
      style({
        width: '{{regularWidth}}',
        height: '{{regularHeight}}',
        top: '{{regularTop}}',
        right: '{{regularRight}}',
      })
    ),
  ]),
]);

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule],
  template: `
  <button (click)="isOpen = !isOpen">Open</button>
  <div 
      class="container" 
      *ngIf="isOpen"
      [@regularExpand]="{
        value: isLeftPanel ? 
        (isExpanded ? 'expandedLeft' : 'regularLeft') : 
        (isExpanded ? 'expandedRight' : 'regularRight'), 
        params: {
          regularWidth: width, 
          regularHeight: height, 
          regularTop: top, 
          regularLeft: left,
          regularRight: right,
          expandedWidth: widthExpanded, 
          expandedHeight: heightExpanded, 
          expandedTop: topExpanded, 
          expandedLeft: leftExpanded,
          expandedRight: rightExpanded
        }
      }"
      (@regularExpand.start)="showExpanded = false"
      (@regularExpand.done)="showExpanded = ($event.toState === 'expandedLeft' || $event.toState === 'expandedRight')"
      [@openClose]=""
      [ngStyle]="isLeftPanel ? 
      (showExpanded ? {
        width: widthExpanded, 
        height: heightExpanded, 
        top: topExpanded, 
        left: leftExpanded
      } : {
        width: width, 
        height: height, 
        top: top, 
        left: left
      }) :
      (showExpanded ? {
        width: widthExpanded, 
        height: heightExpanded, 
        top: topExpanded, 
        right: rightExpanded
      } : {
        width: width, 
        height: height, 
        top: top, 
        right: right
      })"
      >
      <div style="min-width: {{width}}">
        <button (click)="isExpanded = !isExpanded">Toggle expansion</button>
        <button (click)="isOpen = false">close</button>
      </div>
    </div>
  `,
  styles: [
    `
    .container {
      position: absolute;
      background-color: cyan;
      border: 1px solid red;
      padding: 1rem;
      box-sizing: border-box;
      overflow: hidden;
    }
  `,
  ],
  animations: [translateLeftRight, expandAnimation],
})
export class App {
  Object = Object;
  _isOpen = true;

  set isOpen(val: boolean) {
    this._isOpen = val;
    this.isExpanded = false;
  }

  get isOpen(): boolean {
    return this._isOpen;
  }

  isExpanded = false;
  showExpanded = false;

  isLeftPanel = true;

  @Input() width: CSSLength = '200px';
  @Input() height: CSSLength = '200px';
  @Input() top: CSSLength = '60px';
  @Input() left: CSSLength = '80px';
  @Input() right: CSSLength = '80px';

  @Input() widthExpanded: CSSLength = '100vw';
  @Input() heightExpanded: CSSLength = '100vh';
  @Input() topExpanded: CSSLength = 0;
  @Input() leftExpanded: CSSLength = 0;
  @Input() rightExpanded: CSSLength = 0;
}

bootstrapApplication(App, {
  providers: [importProvidersFrom([BrowserAnimationsModule])],
});
