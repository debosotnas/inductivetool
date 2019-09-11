import { Injectable } from '@angular/core';
import { HIGHLIGHT_COMMON_CLASS } from './common/constants';
import { HighlightItem } from './common/common.types';
import { TagNamesEnum } from './common/valid-tags.enum';

@Injectable({
  providedIn: 'root'
})
export class TextHelperService {

  constructor() { }

  static getTagName(styleName: string): string {
    const cssName: string = styleName.split('-').join('');
    const enumName: string = cssName.charAt(0).toUpperCase() + cssName.slice(1);
    return TagNamesEnum[enumName];
  }

  static getHighLightList(htmlPortion: string): any[] {
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

}
