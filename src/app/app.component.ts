import { Component, Renderer2, OnInit, HostBinding, HostListener } from '@angular/core';
import { ShowListEvent, HighlightItem, State, Passage } from './common/common.types';
import { HIGHLIGHT_COMMON_CLASS } from './common/constants';
import { TextHelperService } from './text-helper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  // @HostBinding('attr.tabIndex') tabIndex = -1;

  enableHighLightTool: boolean;
  initialData: State;

  hightlightList = {};
  showListContainer = false;
  showHighlightContainer = true;
  initPortionText: string;
  titlePortion: string;

  renderer: Renderer2;
  title = 'Inductive Tool';
  currentFontSize = 5;

  constructor(rend: Renderer2, private textHelperService: TextHelperService) {
    this.renderer = rend;
    // this.setupInitialData();
  }

  loadSimplePortion(): void {
    console.log('show modal for portion');
  }

  setupInitialData(): void {
    this.initialData = this.textHelperService.getData();

    this.showListContainer = this.initialData.buttonPanel;
    this.showHighlightContainer = this.initialData.buttonHighlight;
    this.currentFontSize = this.initialData.fontSize;
    this.initPortionText = this.initialData.textPortion;
    this.titlePortion = this.initialData.titlePortion;

    this.enableHighLightTool = this.textHelperService.enableHighLightTool;
  }

  /*
  @HostListener('document:keypress', ['$event']) keypressed(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (event.code === 'Space') {
      this.startStopHighlight();
    }
  }
  */

  ngOnInit() {

    this.textHelperService.callPortionService()
      .subscribe(data => {
        this.textHelperService.loadData(data);
        this.initAfterService();
      });

  }

  initAfterService() {

    this.setupInitialData();

    this.renderer.listen('document', 'click', (event: MouseEvent) => {
      const target: HTMLElement = event.target as HTMLElement;
      if (!target.classList.contains(HIGHLIGHT_COMMON_CLASS) || !this.textHelperService.enableHighLightTool) {
        return;
      }
      target.outerHTML = target.innerHTML;
      this.showCurrentLists({ text: document.querySelector('.block-portion').innerHTML});
    });
    this.hightlightList = this.textHelperService.getHighLightList(this.initialData.textPortion);
  }

  showCurrentLists(event: ShowListEvent) {
    this.hightlightList = this.textHelperService.getHighLightList(event.text);
  }

  fontUp(): void {
    this.currentFontSize++;
    if (this.currentFontSize > 9) {
      this.currentFontSize = 9;
    }
    this.persistDataFont();
  }

  persistDataFont() {
    const data: State = this.textHelperService.getData();
    data.fontSize = this.currentFontSize;
    this.textHelperService.saveData(data);
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
    const data: State = this.textHelperService.getData();
    data.buttonHighlight = this.showHighlightContainer;
    data.buttonPanel = this.showListContainer;
    this.textHelperService.saveData(data);
  }

  startStopHighlight(): void {
    this.textHelperService.enableHighLightTool = !this.textHelperService.enableHighLightTool;
    this.enableHighLightTool = this.textHelperService.enableHighLightTool;
  }

}
