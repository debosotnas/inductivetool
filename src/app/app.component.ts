import { Component, Renderer2, OnInit } from '@angular/core';
import { ShowListEvent, HighlightItem } from './common/common.types';
import { HIGHLIGHT_COMMON_CLASS } from './common/constants';
import { TextHelperService } from './text-helper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  hightlightList = {};
  showListContainer = false;
  showHighlightContainer = true;

  renderer: Renderer2;
  title = 'Inductive Tool';
  currentFontSize = 5;

  constructor(rend: Renderer2) {
    this.renderer = rend;
  }

  ngOnInit() {
    this.renderer.listen('document', 'click', (event: MouseEvent) => {
      const target: HTMLElement = event.target as HTMLElement;
      if (!target.classList.contains(HIGHLIGHT_COMMON_CLASS)) {
        return;
      }
      target.outerHTML = target.innerHTML;
      this.showCurrentLists({ text: document.querySelector('.block-portion').innerHTML});
    });
  }

  showCurrentLists(event: ShowListEvent) {
    this.hightlightList = TextHelperService.getHighLightList(event.text);
    // console.log(hightlightList);
    // TODO
  }

  fontUp(): void {
    this.currentFontSize++;
    if (this.currentFontSize > 9) {
      this.currentFontSize = 9;
    }
  }

  fontDown(): void {
    this.currentFontSize--;
    if (this.currentFontSize < 0) {
      this.currentFontSize = 0;
    }
  }

  fontReset(): void {
    this.currentFontSize = 5;
  }

  showHideHighlight(): void {
    this.showHighlightContainer = !this.showHighlightContainer;
  }

  showHideList(): void {
    this.showListContainer = !this.showListContainer;
  }

}
