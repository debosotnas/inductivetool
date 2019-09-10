import { Component, OnInit } from '@angular/core';
import { TextSelectEvent } from '../text-selection/text-selection.directive';

@Component({
  selector: 'app-text-portion',
  templateUrl: './text-portion.component.html',
  styleUrls: ['./text-portion.component.sass']
})
export class TextPortionComponent implements OnInit {

  currentRangeSelection: Range;

  constructor() {}

  ngOnInit() {}

  tagAs(typeOfTag: any): void {
    console.log(typeOfTag);
    if (this.currentRangeSelection && this.currentRangeSelection.surroundContents) {

      let parentNode: HTMLSpanElement;

      if (typeOfTag === 8) { // for special type of 'key words'
        const extraNode = document.createElement('span');
        extraNode.setAttribute('class', 'extra-hl8');
        this.currentRangeSelection.surroundContents(extraNode);
      }

      parentNode = document.createElement('span');
      parentNode.setAttribute('class', 'hightlight-' + typeOfTag);

      this.currentRangeSelection.surroundContents(parentNode);
    }
  }

  scratch(): void {
    console.log('>>> scratch!!!');
  }

  public renderRectangles(event: TextSelectEvent): void {
    console.group('Text Select Event');
    console.log('Text:', event.text);
    console.log('Viewport Rectangle:', event.viewportRectangle);
    console.log('Host Rectangle:', event.hostRectangle);
    console.groupEnd();

    this.currentRangeSelection = event.rangeSelection;
    /*
    // If a new selection has been created, the viewport and host rectangles will
    // exist. Or, if a selection is being removed, the rectangles will be null.
    if (event.hostRectangle) {
      this.hostRectangle = event.hostRectangle;
      this.selectedText = event.text;
    } else {
      this.hostRectangle = null;
      this.selectedText = '';
    }
    */
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
    Causa efecto:                           48:05
  */

  /*
  Pending fixes:
    - para lugares (6), cuando la seleccion tiene mas de 1 palabra, poner el tag por separado a cada palabra
    - para verbos pasivos (e) e imperativos (f), lo mismo que anterior
  */
}
