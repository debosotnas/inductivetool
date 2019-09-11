import { Component, OnInit, HostBinding, HostListener, ViewEncapsulation, Input, Output } from '@angular/core';
import { TextSelectEvent } from '../text-selection/text-selection.directive';
import { ValidTagsEnum } from '../common/valid-tags.enum';
import { testPortion, HIGHLIGHT_COMMON_CLASS } from '../common/constants';
import { EventEmitter } from '@angular/core';
import { ShowListEvent } from '../common/common.types';
import { TextHelperService } from '../text-helper.service';

const CLASS_CSS_PREFIX = 'hightlight-';

// <app-text-tooltip *ngFor="let word of words" [innerHTML]="word"></app-text-tooltip>

@Component({
  selector: 'app-text-portion',
  templateUrl: './text-portion.component.html',
  styleUrls: ['./text-portion.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class TextPortionComponent implements OnInit {

  @Input() enableHighLightTool: boolean;
  @Input() initPortionText: string;

  @Input() showListContainer: boolean;
  @Input() showHighlightContainer: boolean;

  @Input() fontSizeSelected: number;
  @Input() hightlightList = {};

  currentRangeSelection: Range;
  textPortion: string;
  words: string[];

  objectKeys = Object.keys;
  getTagName = TextHelperService.getTagName;

  @HostBinding('attr.tabIndex') tabIndex = -1;

  @HostListener('keypress', ['$event']) keypressed(event: KeyboardEvent) {
    // event.stopPropagation();
    event.preventDefault();

    if (this.enableHighLightTool) {
      this.tagAs(event.key);
    }
  }

  constructor() {
  }

  ngOnInit() {
    this.textPortion = this.initPortionText;
    // this.emitShowLists();
  }

  showItemList(itemId: string): void {
    const elem = document.querySelector('.hightlight-item.' + itemId);
    elem.classList.add('over-state');
  }
  normalItemList(itemId: string): void {
    const elem = document.querySelector('.hightlight-item.' + itemId);
    elem.classList.remove('over-state');
  }

  showAllItemList(arrItems: any[]): void {
    arrItems.map((item) => this.showItemList(item.id));
  }

  normalAllItemList(arrItems: any[]): void {
    arrItems.map((item) => this.normalItemList(item.id));
  }

  emitShowLists(): void {
    const blockPortionItem: HTMLElement = document.querySelector('.block-portion');
    const textPortionModified: string = blockPortionItem.innerHTML;

    this.hightlightList = TextHelperService.getHighLightList(textPortionModified);
  }

  tagAs(typeOfTag: any): void {

    if (!this.isValidTag(typeOfTag)) {
      return;
    }

    if (this.currentRangeSelection && this.currentRangeSelection.surroundContents) {

      let parentNode: HTMLSpanElement;

      if (typeOfTag === '8') { // for special type of 'key words'
        const extraNode = document.createElement('span');
        extraNode.setAttribute('class', 'extra-hl8');
        this.currentRangeSelection.surroundContents(extraNode);
      }

      parentNode = document.createElement('span');

      const tmpId = 'id' + (new Date()).getTime() + Math.ceil(Math.random() * 1000);
      // parentNode.setAttribute('id', tmpId);
      // parentNode.setAttribute('data-ref', tmpId);
      parentNode.setAttribute('class', (CLASS_CSS_PREFIX + typeOfTag) + ' ' + HIGHLIGHT_COMMON_CLASS + ' ' + tmpId);

      this.currentRangeSelection.surroundContents(parentNode);
      document.getSelection().empty();
      this.emitShowLists();
    }
  }

  isValidTag(typeOfTag: any): boolean {
    const prefix: string = CLASS_CSS_PREFIX.charAt(0).toUpperCase() + CLASS_CSS_PREFIX.slice(1, -1);
    return !!ValidTagsEnum[prefix + (typeOfTag as string).toUpperCase()];
  }

  public renderRectangles(event: TextSelectEvent): void {
    /*
    console.group('Text Select Event');
    console.log('Text:', event.text);
    console.log('Viewport Rectangle:', event.viewportRectangle);
    console.log('Host Rectangle:', event.hostRectangle);
    console.groupEnd();
    */

    this.currentRangeSelection = event.rangeSelection;
    /*
    // If a new selection has been created, the viewport and host rectangles will
    // exist. Or, if a selection is being removed, the rectangles will be null.
    if (event.hostRectangle) {
      this.hostRectangle = event.hostRectangle;
      // this.selectedText = event.text;
    } else {
      this.hostRectangle = null;
      // this.selectedText = '';
    } */

  }

  /*
  TAGS:
    Dios:                                   16:06
    Jesucristo:                             19:36
    Personas Importantes:                   20:20
    Pregunta:                               23:55
    Destinatarios:                          26:15
    Lugares:                                30:19
    Tiempo (pasado):                        23:28
    Palabra Clave:                          33:05
    Palabras Repetidas:                     38:02
    Contrastes comparaciones razon motivo:  38:41 // pendiente --> algo para investigar (lupa)
    Propósito:                              43:40 - (flecha doble hacia arriba)
    Razon:                                  44:08
    Consecuencia:                           44:00
    Conclusion                              44:28
    Causa efecto:                           48:05
  */

  /*
  Pending fixes:
    - para lugares (6), cuando la seleccion tiene mas de 1 palabra, poner el tag por separado a cada palabra
    - para verbos pasivos (e) e imperativos (f), lo mismo que anterior
  */
}
