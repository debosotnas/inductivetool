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
}

export interface Passages {
  portion: string;
  passages: Passage[];
}

export interface Passage {
  verse: number;
  text: string;
}

export enum BibleVersions {
  LBLA = 'bla',
  NVI = 'nvi',
  RVR = 'rvr'
}
