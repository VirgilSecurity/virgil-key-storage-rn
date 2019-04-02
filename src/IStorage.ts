type IKeyEntry = import('virgil-sdk').IKeyEntry;

export default interface IKeyEntryStorage {
  getKeyEntries(): Promise<Map<string, IKeyEntry>>;
  setKeyEntries(keyEntries: Map<string, IKeyEntry>): Promise<void>;
  clear(): Promise<void>;
}
