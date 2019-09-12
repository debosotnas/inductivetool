import { Injectable } from '@angular/core';
import { HIGHLIGHT_COMMON_CLASS, testPortion } from './common/constants';
import { HighlightItem, State, Passage, Passages, BibleVersions } from './common/common.types';
import { TagNamesEnum } from './common/valid-tags.enum';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TextHelperService {

  portionDefault = 'assets/test-portion.json';
  portionService = 'svc/loadverses.php?str=';
  state: State;
  enableHighLightTool = true;

  constructor(private http: HttpClient) {
    // TextHelperService.http = http;
    // TextHelperService.loadData();
  }

  getTagName(styleName: string): string {
    const cssNameArr: string[] = styleName.split('-');
    const cssFormatLast: string = cssNameArr[0] + cssNameArr[1].toUpperCase();
    const enumName: string = cssFormatLast.charAt(0).toUpperCase() + cssFormatLast.slice(1);
    return TagNamesEnum[enumName];
  }

  getHighLightList(htmlPortion: string): any[] {
    this.persistPortionText(htmlPortion);

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


  saveData(state: State): void {
    window.localStorage.setItem('inductiveToolv1', JSON.stringify(state));
  }

  loadData(passages: Passages): void {
    const strState: string = window.localStorage.getItem('inductiveToolv1');
    let stateN: State;

    if (!strState) {
      stateN = {
        buttonHighlight: true,
        buttonPanel: false,
        fontSize: 5,
        textPortion: this.parsePassage(passages.passages),
        titlePortion: passages.portion,
        versionPortion: BibleVersions.LBLA
      };

    } else {
      stateN = JSON.parse(strState);
    }
    this.state = stateN;
  }

  getData(): State {
    // if (!this.state) {
      // this.loadData();
    // }
    return this.state;
  }

  persistPortionText(outerHTML: string) {
    const data: State = this.getData();
    data.textPortion = outerHTML;
    this.saveData(data);
  }

  callPortionService(passage: string = '', version: string = ''): Observable<Passages> {
    let portionURL: string;
    if (!passage || !version) {
      portionURL = this.portionDefault;
    } else {
      portionURL = `${this.portionService}${passage}&ver=${version}`;
    }
    return this.http.get<Passages>(portionURL);
  }

  parsePassage(verses: {verse: number, text: string}[]): string {
    const arrVerses: string[] = [];

    if (!verses) {
      console.error('Error parsin verses');
      return;
    }
    verses.forEach((item) => {
      arrVerses.push(`<strong>${item.verse}</strong> ${item.text}`);
    });

    return arrVerses.join(' ');
  }
}
