import { Component, OnInit } from '@angular/core';
import { TextSelectEvent } from '../text-selection/text-selection.directive';

@Component({
  selector: 'app-text-portion',
  templateUrl: './text-portion.component.html',
  styleUrls: ['./text-portion.component.sass']
})
export class TextPortionComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  tagAs(typeOfTag: number): void {
    console.log(typeOfTag);
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
    Dios: 16:06

  */
}
