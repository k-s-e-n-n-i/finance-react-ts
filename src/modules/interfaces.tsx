export interface Entry {
  date: string;
  sumStr: string;
  sum: string;
  name: string;
  id: number;
  state: string;
}

export interface HistoryList {
  historyList: Entry[];
}
