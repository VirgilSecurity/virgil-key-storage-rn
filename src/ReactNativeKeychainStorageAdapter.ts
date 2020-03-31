import {
  setGenericPassword,
  getGenericPassword,
  resetGenericPassword,
} from 'react-native-keychain';
import { StorageEntryAlreadyExistsError } from 'virgil-sdk';

import {
  ReactNativeKeychainStorageAdapterErrorStatus,
  ReactNativeKeychainStorageAdapterError,
} from './ReactNativeKeychainStorageAdapterError';
import { Options, IStorageAdapter } from './types';

export interface ReactNativeKeychainStorageAdapterOptions extends Options {
  username?: string;
}

export class ReactNativeKeychainStorageAdapter implements IStorageAdapter {
  static readonly DEFAULT_SERVICE = 'com.virgilsecurity.keys';
  static readonly DEFAULT_USERNAME = 'Virgil Security, Inc.';

  private readonly options: ReactNativeKeychainStorageAdapterOptions;

  constructor(options: ReactNativeKeychainStorageAdapterOptions = {}) {
    this.options = options;
    this.options.service =
      this.options.service || ReactNativeKeychainStorageAdapter.DEFAULT_SERVICE;
    this.options.username =
      this.options.username || ReactNativeKeychainStorageAdapter.DEFAULT_USERNAME;
  }

  async store(key: string, data: string) {
    const obj = await getGenericPassword(this.options);
    let keys: { [key: string]: string } = {};
    if (obj !== false) {
      keys = this.deserializeKeys(obj.password);
    }
    if (keys[key]) {
      throw new StorageEntryAlreadyExistsError();
    }
    keys[key] = data;
    await setGenericPassword(this.options.username!, this.serializeKeys(keys), this.options);
  }

  async load(key: string) {
    const obj = await getGenericPassword(this.options);
    if (obj === false) {
      return null;
    }
    const keys = this.deserializeKeys(obj.password);
    return keys[key] || null;
  }

  async exists(key: string) {
    const obj = await getGenericPassword(this.options);
    if (obj === false) {
      return false;
    }
    const keys = this.deserializeKeys(obj.password);
    return !!keys[key];
  }

  async remove(key: string) {
    const obj = await getGenericPassword(this.options);
    if (obj === false) {
      return false;
    }
    const keys = this.deserializeKeys(obj.password);
    if (!keys[key]) {
      return false;
    }
    delete keys[key];
    await setGenericPassword(this.options.username!, this.serializeKeys(keys), this.options);
    return true;
  }

  async update(key: string, data: string) {
    const obj = await getGenericPassword(this.options);
    let keys: { [key: string]: string } = {};
    if (obj !== false) {
      keys = this.deserializeKeys(obj.password);
    }
    keys[key] = data;
    await setGenericPassword(this.options.username!, this.serializeKeys(keys), this.options);
  }

  async clear() {
    await resetGenericPassword(this.options);
  }

  async list() {
    const obj = await getGenericPassword(this.options);
    if (obj === false) {
      return [];
    }
    const keys = this.deserializeKeys(obj.password);
    return Object.values(keys);
  }

  private serializeKeys(keys: { [key: string]: string }) {
    return JSON.stringify(keys);
  }

  private deserializeKeys(value: string) {
    try {
      return JSON.parse(value) as { [key: string]: string };
    } catch (error) {
      throw new ReactNativeKeychainStorageAdapterError(
        ReactNativeKeychainStorageAdapterErrorStatus.DeserializationError,
      );
    }
  }
}
