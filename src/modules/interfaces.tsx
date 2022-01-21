export interface Entry {
  date: string;
  sum: string;
  name?: string;
  id: number;
  state: string;
}

export interface HistoryList {
  historyList: Entry[];
}

export interface StateFF {
  historyList: Entry[];
}
