import { Component, Renderer2, OnInit, HostBinding, HostListener } from '@angular/core';
import { ShowListEvent, HighlightItem, State, Passage, Passages } from './common/common.types';
import { HIGHLIGHT_COMMON_CLASS, BooksWithChapters, versesByChaptersBook } from './common/constants';
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
  objectKeys = Object.keys;

  isLoadingView = true;

  enableHighLightTool: boolean;
  initialData: State;

  hightlightList = {};
  showListContainer = false;
  showHighlightContainer = true;
  initPortionText: string;

  titlePortion: string;
  versionPortion: string;

  bookselected = 10;
  listBooks = BooksWithChapters;
  listVersesByChapter = versesByChaptersBook;
  currentBookVersesSelection = {};
  currentVerses: any = null;

  renderer: Renderer2;
  title = 'Inductive Tool';
  currentFontSize = 5;

  // -------- details for portion selection modal
  currentChapterHighlight: number = null;
  currentVerseHighlight: any = null;
  currentMinHighlight: any = null;
  currentMaxHighlight: any = null;
  dragVersesInProgress = false;

  currentPortionToBeLoaded: string = null;
  isEmptyPortion: boolean = null;
  // --------

  // allBooks = BooksWithChapters; // not used
  constructor(rend: Renderer2,
              private textHelperService: TextHelperService,
              private modalService: NgbModal) {
    this.renderer = rend;
  }

  getBookName(): string {
    const currentBook = this.listBooks.filter( b => b.val === +this.bookselected);
    return currentBook[0].name;
  }

  getNumberOfVerses(): any {
    this.currentBookVersesSelection = this.listVersesByChapter[this.bookselected];
  }

  resetVersesOfChapter(): void {
    // (dblclick)="resetVersesOfChapter()"
    this.currentMinHighlight = this.currentMaxHighlight = null;
    this.currentVerseHighlight = {};
  }

  showDragButtons(verse: number): void {
    if (verse === this.currentMinHighlight || !this.dragVersesInProgress) {
      return;
    }
    let minv: number;
    let maxv: number;
    if (verse < this.currentMinHighlight) {
      minv = verse;
      maxv = this.currentMinHighlight;
    } else {
      maxv = verse;
      minv = this.currentMinHighlight;
    }
    this.currentVerseHighlight = {};
    for (let i: number = minv; i <= maxv; i++) {
      this.currentVerseHighlight[i] = true;
    }
  }

  selectIniVerses(verse: number): void {
    this.dragVersesInProgress = true;
    this.currentMinHighlight = verse;
  }

  updateCurrentPortionToBeLoaded(): void {
    const currentObj =  Object.keys(this.currentVerseHighlight);
    if (!currentObj.length) {
      this.currentPortionToBeLoaded = null;
      return;
    }
    const arr = currentObj.map( (key, val) => currentObj[val]);
    const min = Math.min.apply( null, arr );
    const max = Math.max.apply( null, arr );

    this.currentPortionToBeLoaded =
        `${this.currentChapterHighlight}:${min}` + (min !== max ? `-${max}` : '');
  }

  updateAndLoadPortion(): void {
    this.titlePortion = this.currentPortionToBeLoaded;
    this.loadSimplePortion();
  }

  selectEndVerses(verse: number): void {
    // (mouseup)="selectEndVerses(i+1)"
    if (this.dragVersesInProgress) {
      this.currentMaxHighlight = verse;
      if (this.currentMaxHighlight === this.currentMinHighlight) {
        this.currentVerseHighlight = {};
        this.currentVerseHighlight[verse] = true;
      }
    }
  }

  onChangeBook(): void {
    this.titlePortion = 'Seleccionar versículos';
    this.isEmptyPortion = true;
  }
/*
  selectEndVerses(verse: number): void {
    // (mouseup)="selectEndVerses(i+1)"
    if (this.dragVersesInProgress) {
      this.currentMaxHighlight = verse;
      if (this.currentMaxHighlight === this.currentMinHighlight) {
        this.currentVerseHighlight = {};
        this.currentVerseHighlight[verse] = true;
      } else {
        this.currentVerseHighlight = {};
        if (this.currentMinHighlight < this.currentMaxHighlight) {
          for (let i: number = this.currentMinHighlight; i <= this.currentMaxHighlight; i++) {
            this.currentVerseHighlight[i] = true;
          }
        } else {
          for (let i: number = this.currentMinHighlight; i >= this.currentMaxHighlight; i--) {
            this.currentVerseHighlight[i] = true;
          }
        }
      }
    }
  }
  */

  selectVersesOfChapter(verse: number): any {
// (click)="selectVersesOfChapter(i+1)"

    // update first and last verses
    this.currentVerseHighlight = {};

    if (this.currentMinHighlight == null || this.currentMaxHighlight == null) {
      this.currentMinHighlight = this.currentMaxHighlight = verse;
    } else if (verse < this.currentMinHighlight) {
      this.currentMinHighlight = verse;
    } else if (verse > this.currentMaxHighlight) {
      this.currentMaxHighlight = verse;
    } else if (verse > this.currentMinHighlight && verse < this.currentMaxHighlight) {
      // this.currentMinHighlight = this.currentMaxHighlight = verse;
      if ( Math.abs(verse - this.currentMinHighlight) > Math.abs(verse - this.currentMaxHighlight) ) {
        this.currentMaxHighlight = verse;
      } else {
        this.currentMinHighlight = verse;
      }
    }

    for (let i: number = this.currentMinHighlight; i <= this.currentMaxHighlight; i++) {
      this.currentVerseHighlight[i] = true;
    }

    // this.currentVerseHighlight[verse] = true;
    // const currentObj = Object.keys(this.currentVerseHighlight);

    /*
    if (currentObj.length > 1) {
      const arr = currentObj.map( (key, val) => currentObj[val]);
      const min = Math.min.apply( null, arr );
      const max = Math.max.apply( null, arr );
      for (let i: number = min; i <= max; i++) {
        this.currentVerseHighlight[i] = true;
      }
    } else {
      this.currentVerseHighlight[verse] = true;
    }
    */
  }

  arrayOne(i: number): any[] {
    return Array(i);
  }

  openSelection(content): void {
    this.currentVerses = null;
    this.currentVerseHighlight = {};
    this.currentChapterHighlight = null;
    this.currentPortionToBeLoaded = null;

    this.getNumberOfVerses();
    this.open(content);
  }

  showVersesOfChapter(versesToShow: number, chapterSelected: any): void {
    this.resetVersesOfChapter();
    this.currentChapterHighlight = chapterSelected;
    this.currentVerses = versesToShow;
  }

  open(content): void {
    this.modalService.open(content, { size: 'lg' });
  }

  loadSimplePortion(): void {
    // console.log('show modal for portion');
    // this.modalService.open(content, {size: 'xl'});

    // removed
      // this.persistVersionPortion();

    this.isEmptyPortion = false;

    this.isLoadingView = true;
    this.textHelperService.callPortionService(this.titlePortion, this.bookselected) // this.versionPortion)
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
    data.bookToLook = this.bookselected;
    data.titlePortion = this.titlePortion;
    this.textHelperService.saveData(data);
  }

  setupInitialData(): void {
    this.initialData = this.textHelperService.getData();

    this.showListContainer = this.initialData.buttonPanel;
    this.showHighlightContainer = this.initialData.buttonHighlight;
    this.currentFontSize = this.initialData.fontSize;
    this.versionPortion = this.initialData.versionPortion;
    this.bookselected = this.initialData.bookToLook;
    this.enableHighLightTool = this.initialData.enableHighLightTool;

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

    this.renderer.listen('document', 'mouseup', (event: MouseEvent) => {
      if (this.dragVersesInProgress) {
        this.dragVersesInProgress = false;
        this.updateCurrentPortionToBeLoaded();
      }
    });
    this.renderer.listen('document', 'click', (event: MouseEvent) => {
      const target: HTMLElement = event.target as HTMLElement;
      if (!target.classList.contains(HIGHLIGHT_COMMON_CLASS) || !this.enableHighLightTool) {
        return;
      }
      target.outerHTML = target.innerHTML;
      this.showCurrentLists({ text: document.querySelector('.block-portion').innerHTML});
    });
    this.hightlightList = this.textHelperService.getHighLightList(this.initialData.textPortion);
    this.updateStructureForPhrasing();
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
    // const data: State = this.textHelperService.getData();
    // data.versionPortion = this.versionPortion;
    // data.bookToLook = this.bookselected;
    // this.textHelperService.saveData(data);
  }

  startStopHighlight(): void {
    this.enableHighLightTool = !this.enableHighLightTool;
    this.persistEnabledHighlight();

    this.updateStructureForPhrasing();
  }

  updateStructureForPhrasing() {
    if (this.enableHighLightTool) {

    } else {

    }
  }

  persistEnabledHighlight() {
    const data: State = this.textHelperService.getData();
    data.enableHighLightTool = this.enableHighLightTool;
    this.textHelperService.saveData(data);
  }

}
