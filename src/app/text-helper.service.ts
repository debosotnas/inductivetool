import { Injectable } from '@angular/core';
import { HIGHLIGHT_COMMON_CLASS, testPortion } from './common/constants';
import { HighlightItem, State } from './common/common.types';
import { TagNamesEnum } from './common/valid-tags.enum';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TextHelperService {
  static portionService = 'assets/test-portion.json';

  // static http: HttpClient;
  static state: State;
  static enableHighLightTool = true;

  constructor(private http: HttpClient) {
    // TextHelperService.http = http;
    // TextHelperService.loadData();
  }

  static getTagName(styleName: string): string {
    const cssNameArr: string[] = styleName.split('-');
    const cssFormatLast: string = cssNameArr[0] + cssNameArr[1].toUpperCase();
    const enumName: string = cssFormatLast.charAt(0).toUpperCase() + cssFormatLast.slice(1);
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
      const tmpId = item.classList[item.classList.length - 1];
      if (Array.isArray(currentPartition)) {
        currentPartition.push({
          content: String(item.innerText).trim(),
          type: partitionKey,
          item,
          id: tmpId
        });
        partitions[partitionKey] = currentPartition;
      } else {
        partitions[partitionKey] = [{
            content: String(item.innerText).trim(),
            type: partitionKey,
            item,
            id: tmpId
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

      /*
      this.callPortionService()
        .subscribe((data: any) => stateN = {
            buttonHighlight: true,
            buttonPanel: false,
            fontSize: 5,
            textPortion: TextHelperService.parsePassage(data.passages)

            // heroesUrl: data['heroesUrl'],
            // textfile:  data['textfile']
        });
      */

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
      TextHelperService.loadData();
    }
    return this.state;
  }

  static persistPortionText(outerHTML: string) {
    const data: State = TextHelperService.getData();
    data.textPortion = outerHTML;
    TextHelperService.saveData(data);
  }

  callPortionService() {
    return this.http.get(TextHelperService.portionService);
  }

  parsePassage(verses: {verse: number, text: string}[]): string {
    const arrVerses: string[] = [];

    verses.forEach((item) => {
      arrVerses.push(`<strong>${item.verse}</strong> ${item.text}`);
    });

    return verses.join('');
  }
}
