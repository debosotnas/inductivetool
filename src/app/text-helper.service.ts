import { Injectable } from '@angular/core';
import { HIGHLIGHT_COMMON_CLASS, testPortion } from './common/constants';
import { HighlightItem, State } from './common/common.types';
import { TagNamesEnum } from './common/valid-tags.enum';

@Injectable({
  providedIn: 'root'
})
export class TextHelperService {

  static state: State;

  constructor() {
    // TextHelperService.loadData();
  }

  static getTagName(styleName: string): string {
    const cssName: string = styleName.split('-').join('');
    const enumName: string = cssName.charAt(0).toUpperCase() + cssName.slice(1);
    return TagNamesEnum[enumName];
  }

  static getHighLightList(htmlPortion: string): any[] {
    TextHelperService.persistPortionText(htmlPortion);

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

  static saveData(state: State): void {
    window.localStorage.setItem('inductiveToolv1', JSON.stringify(state));
  }

  static loadData(): void {
    const strState: string = window.localStorage.getItem('inductiveToolv1');
    let stateN: State;

    if (!strState) {
      stateN = {
        buttonHighlight: true,
        buttonPanel: false,
        fontSize: 5,
        textPortion: testPortion
      };
    } else {
      stateN = JSON.parse(strState);
    }
    this.state = stateN;
  }

  static getData(): State {
    if (!this.state) {
      TextHelperService.loadData()
    }
    return this.state;
  }

  static persistPortionText(outerHTML: string) {
    const data: State = TextHelperService.getData();
    data.textPortion = outerHTML;
    TextHelperService.saveData(data);
  }

}
