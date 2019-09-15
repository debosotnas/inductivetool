export interface ShowListEvent {
  text: string;
}

export interface SelectionRectangle {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface HighlightItem {
  content: string;
  type: string;
  item: any;
  id: string;
}

export interface State {
  buttonHighlight: boolean;
  buttonPanel: boolean;
  fontSize: number;
  textPortion: string;
  titlePortion: string;
  versionPortion: string;
  bookToLook: number;
  enableHighLightTool: boolean;
}

export interface Passages {
  portion: string;
  passages: Passage[];
}

export interface Passage {
  verse: number;
  text: string;
  verseClass: string;
}

export enum BibleVersions {
  LBLA = 'bla',
  NVI = 'nvi',
  RVR = 'rvr'
}
