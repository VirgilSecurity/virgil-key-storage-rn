import {
  Options,
  setGenericPassword,
  getGenericPassword,
  resetGenericPassword,
} from 'react-native-keychain';

import IStorage from './IStorage';
import { serializeKeyEntries, deserializeKeyEntries } from './KeyEntryUtils';

type IKeyEntry = import('virgil-sdk').IKeyEntry;

export interface NativeStorageOptions extends Options {
  username?: string;
}

export default class NativeStorage implements IStorage {
  private static readonly DEFAULT_KEYCHAIN_SERVICE_NAME: string = '_VIRGIL_KEY_ENTRY_STORAGE';

  private readonly keychainServiceName: string = NativeStorage.DEFAULT_KEYCHAIN_SERVICE_NAME;
  private readonly options?: Options;

  constructor(options?: NativeStorageOptions) {
    if (options == null) {
      this.options = {
        service: this.keychainServiceName,
      };
    } else {
      this.options = options;
    }
  }

  async getKeyEntries(): Promise<Map<string, IKeyEntry>> {
    const obj = await getGenericPassword(this.options);
    if (typeof obj === 'boolean') {
      return new Map<string, IKeyEntry>();
    }
    return deserializeKeyEntries(obj.password);
  }

  async setKeyEntries(keyEntries: Map<string, IKeyEntry>): Promise<void> {
    const value = serializeKeyEntries(keyEntries);
    await setGenericPassword(this.keychainServiceName, value, this.options);
  }

  async clear(): Promise<void> {
    await resetGenericPassword(this.options);
  }
}
