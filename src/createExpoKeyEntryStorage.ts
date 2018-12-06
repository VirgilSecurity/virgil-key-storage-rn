import ExpoStorage, { ExpoStorageOptions } from './ExpoStorage';
import KeyEntryStorage from './KeyEntryStorage';

export default function createExpoKeyEntryStorage(options?: ExpoStorageOptions) {
  const storage = new ExpoStorage(options);
  return new KeyEntryStorage(storage);
}
