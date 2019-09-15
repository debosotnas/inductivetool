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

  currentSelection: any;
  currentRangeSelection: Range;
  words: string[];

  objectKeys = Object.keys;
  getTagName = this.textHelperService.getTagName;

  @HostBinding('attr.tabIndex') tabIndex = -1;

  @HostListener('keypress', ['$event']) keypressed(event: KeyboardEvent) {
    // event.stopPropagation();
    event.preventDefault();

    if (this.enableHighLightTool) {
      this.tagAs(event.key);
    }
  }

  constructor(private textHelperService: TextHelperService) {
  }

  ngOnInit() {
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

    this.hightlightList = this.textHelperService.getHighLightList(textPortionModified);
  }

  tagAs(typeOfTag: any): void {

    if (!this.isValidTag(typeOfTag)) {
      return;
    }


    if (this.currentRangeSelection && this.currentRangeSelection.surroundContents) {

      const arrNodes = this.getNodesToTag();

// how to tag every selected parent tag
// var sss = window.getSelection()
// sss.anchorNode.parentNode === sss.anchorNode.parentNode
// sss.anchorNode.parentNode === sss.focusNode.parentNode
// sss.anchorNode.parentElement === sss.anchorNode.parentElement
// sss.anchorNode.parentElement === sss.focusNode.parentElement
// var tmp = sss.anchorNode.parentElement.nextElementSibling
// sss.focusNode.parentElement === tmp
// tmp = tmp.nextElementSibling
// sss.focusNode.parentElement === tmp
// tmp = tmp.nextElementSibling
// sss.focusNode.parentElement === tmp
//
      // let parentNode: HTMLSpanElement;
      arrNodes.forEach((nodeToTag: HTMLElement, ) => {
        const localParentNode: HTMLSpanElement = document.createElement('span');
        const currNodes: NodeList = nodeToTag.childNodes;
        currNodes.forEach(item => localParentNode.appendChild(item));

/*
        if (typeOfTag === '18') { // for special type of 'key words'

          const localParentNode8: HTMLSpanElement = document.createElement('span');
          localParentNode8.setAttribute('class', 'extra-hl8');
          const currNodes8: NodeList = localParentNode.childNodes;
          currNodes8.forEach(item => localParentNode8.appendChild(item));

          // const extraNode = document.createElement('span');
          // extraNode.setAttribute('class', 'extra-hl8');
          // this.currentRangeSelection.surroundContents(extraNode);

        }
*/
        const tmpId = 'id' + (new Date()).getTime() + Math.ceil(Math.random() * 1000);
        localParentNode.setAttribute('class', (CLASS_CSS_PREFIX + typeOfTag) + ' ' + HIGHLIGHT_COMMON_CLASS + ' ' + tmpId);

        // parentNode = document.createElement('span');

        // const tmpId = 'id' + (new Date()).getTime() + Math.ceil(Math.random() * 1000);
        // parentNode.setAttribute('class', (CLASS_CSS_PREFIX + typeOfTag) + ' ' + HIGHLIGHT_COMMON_CLASS + ' ' + tmpId);

        nodeToTag.appendChild(localParentNode);

        if (typeOfTag === '8') { // for special type of 'key words'

          const localParentNode8: HTMLSpanElement = document.createElement('span');
          localParentNode8.setAttribute('class', 'extra-hl8');
          const currNodes8: NodeList = localParentNode.childNodes;
          currNodes8.forEach(item => localParentNode8.appendChild(item));

          // const extraNode = document.createElement('span');
          // extraNode.setAttribute('class', 'extra-hl8');
          // this.currentRangeSelection.surroundContents(extraNode);
          localParentNode.appendChild(localParentNode8);
        }

      });

      // eee.childNodes.forEach(item => iii.appendChild(item));


      // let parentNode: HTMLSpanElement;

      /*

      if (typeOfTag === '8') { // for special type of 'key words'
        const extraNode = document.createElement('span');
        extraNode.setAttribute('class', 'extra-hl8');
        this.currentRangeSelection.surroundContents(extraNode);
      }

      parentNode = document.createElement('span');

      const tmpId = 'id' + (new Date()).getTime() + Math.ceil(Math.random() * 1000);
      parentNode.setAttribute('class', (CLASS_CSS_PREFIX + typeOfTag) + ' ' + HIGHLIGHT_COMMON_CLASS + ' ' + tmpId);

      this.currentRangeSelection.surroundContents(parentNode);

      */

      document.getSelection().empty();
      this.emitShowLists();
    }
  }

  private getNodesToTag(): Array<any> {
    const arrNodes = [];
    if (this.currentSelection) {
      const anchorNode = this.currentSelection.anchorNode;
      const focusNode = this.currentSelection.focusNode;
      arrNodes.push(anchorNode.parentElement);
      if (anchorNode.parentElement !== focusNode.parentElement) {
        let tmpNode = anchorNode.parentElement.nextElementSibling;
        arrNodes.push(tmpNode);
        while (tmpNode !== focusNode.parentElement && tmpNode.nextElementSibling) {
          tmpNode = tmpNode.nextElementSibling;
          arrNodes.push(tmpNode);
        }
      }
      // console.log('--->>>: %o', arrNodes);
    }
    return arrNodes;
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
    this.currentSelection = event.selection;
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
