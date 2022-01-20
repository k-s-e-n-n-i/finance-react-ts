export interface Entry {
  date: string;
  sum: string;
  name?: string;
}

export interface HistoryList {
  historyList: Entry[];
}

export interface StateFF {
  historyList: Entry[];
}
