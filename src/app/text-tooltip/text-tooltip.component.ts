import { Component, OnInit } from '@angular/core';
import { HIGHLIGHT_COMMON_CLASS } from '../common/constants';

@Component({
  selector: 'app-text-tooltip',
  templateUrl: './text-tooltip.component.html',
  styleUrls: ['./text-tooltip.component.sass']
})
export class TextTooltipComponent implements OnInit {

  baseHightLightClass: string = HIGHLIGHT_COMMON_CLASS;

  constructor() { }

  ngOnInit() {
  }

}
