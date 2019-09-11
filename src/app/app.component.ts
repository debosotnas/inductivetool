import { Component, Renderer2, OnInit } from '@angular/core';
import { ShowListEvent, HighlightItem, State } from './common/common.types';
import { HIGHLIGHT_COMMON_CLASS } from './common/constants';
import { TextHelperService } from './text-helper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  initialData: State;

  hightlightList = {};
  showListContainer = false;
  showHighlightContainer = true;
  initPortionText: string;

  renderer: Renderer2;
  title = 'Inductive Tool';
  currentFontSize = 5;

  constructor(rend: Renderer2) {
    this.renderer = rend;
    this.setupInitialData();
  }

  setupInitialData(): void {
    this.initialData = TextHelperService.getData();
    this.showListContainer = this.initialData.buttonPanel;
    this.showHighlightContainer = this.initialData.buttonHighlight;
    this.currentFontSize = this.initialData.fontSize;
    this.initPortionText = this.initialData.textPortion;
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
    this.hightlightList = TextHelperService.getHighLightList(this.initialData.textPortion);
  }

  showCurrentLists(event: ShowListEvent) {
    this.hightlightList = TextHelperService.getHighLightList(event.text);
  }

  fontUp(): void {
    this.currentFontSize++;
    if (this.currentFontSize > 9) {
      this.currentFontSize = 9;
    }
    this.persistDataFont();
  }

  persistDataFont() {
    const data: State = TextHelperService.getData();
    data.fontSize = this.currentFontSize;
    TextHelperService.saveData(data);
  }

  fontDown(): void {
    this.currentFontSize--;
    if (this.currentFontSize < 0) {
      this.currentFontSize = 0;
    }
    this.persistDataFont();
  }

  fontReset(): void {
    this.currentFontSize = 5;
    this.persistDataFont();
  }

  showHideHighlight(): void {
    this.showHighlightContainer = !this.showHighlightContainer;
    this.persistButtonsList();
  }

  showHideList(): void {
    this.showListContainer = !this.showListContainer;
    this.persistButtonsList();
  }

  persistButtonsList() {
    const data: State = TextHelperService.getData();
    data.buttonHighlight = this.showHighlightContainer;
    data.buttonPanel = this.showListContainer;
    TextHelperService.saveData(data);
  }

}
