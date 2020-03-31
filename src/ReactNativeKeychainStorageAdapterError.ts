export enum ReactNativeKeychainStorageAdapterErrorStatus {
  DeserializationError = 'DeserializationError',
}

export enum ReactNativeKeychainStorageAdapterErrorMessage {
  DeserializationError = 'Deserialization error. Some data is already stored in your Keychain. Try to delete it or provide a different `service` to `ReactNativeKeychainStorageAdapter`.',
}

export class ReactNativeKeychainStorageAdapterError extends Error {
  readonly status: ReactNativeKeychainStorageAdapterErrorStatus;

  constructor(status: ReactNativeKeychainStorageAdapterErrorStatus, message?: string) {
    super(message || ReactNativeKeychainStorageAdapterErrorMessage[status]);
    Object.setPrototypeOf(this, ReactNativeKeychainStorageAdapterError.prototype);
    this.name = 'ReactNativeKeychainStorageAdapterError';
    this.status = status;
  }
}
