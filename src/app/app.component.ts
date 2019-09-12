import { Component, Renderer2, OnInit, HostBinding, HostListener } from '@angular/core';
import { ShowListEvent, HighlightItem, State, Passage, Passages } from './common/common.types';
import { HIGHLIGHT_COMMON_CLASS, BooksWithChapters } from './common/constants';
import { TextHelperService } from './text-helper.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  // @HostBinding('attr.tabIndex') tabIndex = -1;

  // passageToSearch: string;

  isLoadingView = true;

  enableHighLightTool: boolean;
  initialData: State;

  hightlightList = {};
  showListContainer = false;
  showHighlightContainer = true;
  initPortionText: string;

  titlePortion: string;
  versionPortion: string;

  renderer: Renderer2;
  title = 'Inductive Tool';
  currentFontSize = 5;

  allBooks = BooksWithChapters; // not used

  constructor(rend: Renderer2,
              private textHelperService: TextHelperService,
              private modalService: NgbModal) {
    this.renderer = rend;
    // this.setupInitialData();
  }

  arrayOne(i: number): any[] {
    return Array(i);
  }

  loadSimplePortion(): void {
    // console.log('show modal for portion');
    // this.modalService.open(content, {size: 'xl'});
    this.persistVersionPortion();

    this.isLoadingView = true;
    this.textHelperService.callPortionService(this.titlePortion, this.versionPortion)
      .subscribe( (data: Passages) => {
        this.isLoadingView = false;

        const portion = this.textHelperService.parsePassage(data.passages);
        this.persisLoadedPortion(portion);

        // update portion
        this.initPortionText = portion;
        // update list
        this.showCurrentLists({ text: document.querySelector('.block-portion').innerHTML});
      },
      error => {
        alert(error.message);
        this.isLoadingView = false;
      });

    console.log('>> titlePortion: ' + this.titlePortion);
    console.log('>> versionPortion: ' + this.versionPortion);
  }

  persisLoadedPortion(portion: string): void {
    const data: State = this.textHelperService.getData();
    data.textPortion = portion;
    data.versionPortion = this.versionPortion;
    this.textHelperService.saveData(data);
  }

  setupInitialData(): void {
    this.initialData = this.textHelperService.getData();

    this.showListContainer = this.initialData.buttonPanel;
    this.showHighlightContainer = this.initialData.buttonHighlight;
    this.currentFontSize = this.initialData.fontSize;
    this.versionPortion = this.initialData.versionPortion;
    this.enableHighLightTool = this.textHelperService.enableHighLightTool;

    this.initPortionText = this.initialData.textPortion;
    this.titlePortion = this.initialData.titlePortion;
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
    this.isLoadingView = true;
    this.textHelperService.callPortionService()
      .subscribe(data => {
        this.isLoadingView = false;

        this.textHelperService.loadData(data);
        this.initAfterService();
      },
      error => {
        alert(error.message);
        this.isLoadingView = false;
      });

  }

  // not used - will implement in future versions
  selectBookChap(book: string, chap: number): void {
    console.log(book, chap);
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

  persistVersionPortion() {
    const data: State = this.textHelperService.getData();
    data.versionPortion = this.versionPortion;
    this.textHelperService.saveData(data);
  }

  startStopHighlight(): void {
    this.textHelperService.enableHighLightTool = !this.textHelperService.enableHighLightTool;
    this.enableHighLightTool = this.textHelperService.enableHighLightTool;
  }

}
