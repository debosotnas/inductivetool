import { Component, Renderer2, OnInit } from '@angular/core';
import { ShowListEvent, HighlightItem } from './common/common.types';
import { HIGHLIGHT_COMMON_CLASS } from './common/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

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
    const hightlightList: any[] = this.getHighLightList(event.text);
    console.log(hightlightList);
  }

  getHighLightList(htmlPortion: string): any[] {
    // const partitions: Array<Array<HighlightItem>>[] = [];
    const partitions: Array<any>[] = [];

    const div: HTMLDivElement = document.createElement('div');
    div.innerHTML = htmlPortion;
    const highlightItems = div.querySelectorAll('.' + HIGHLIGHT_COMMON_CLASS);
    highlightItems.forEach((item: any) => {
      const partitionKey: string = item.classList[0];
      const currentPartition: HighlightItem[] = partitions[partitionKey];
      if (Array.isArray(currentPartition)) {
        currentPartition.push({
          content: item.innerText,
          type: partitionKey,
          item,
          id: item.id
        });
        partitions[partitionKey] = currentPartition;
      } else {
        partitions[partitionKey] = [{
            content: item.innerText,
            type: partitionKey,
            item,
            id: item.id
          }];
      }
    });
    return partitions;
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
