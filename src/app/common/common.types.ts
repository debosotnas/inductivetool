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
