import KeyEntryStorage from './KeyEntryStorage';
import NativeStorage, { NativeStorageOptions } from './NativeStorage';

export default function createNativeKeyEntryStorage(options?: NativeStorageOptions) {
  const storage = new NativeStorage(options);
  return new KeyEntryStorage(storage);
}
