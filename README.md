# @virgilsecurity/key-storage-rn
[![npm](https://img.shields.io/npm/v/@virgilsecurity/key-storage-rn.svg)](https://www.npmjs.com/package/@virgilsecurity/key-storage-rn)
[![Build Status](https://img.shields.io/travis/VirgilSecurity/virgil-key-storage-rn.svg)](https://travis-ci.org/VirgilSecurity/virgil-key-storage-rn)
[![GitHub license](https://img.shields.io/badge/license-BSD%203--Clause-blue.svg)](https://github.com/VirgilSecurity/virgil-key-storage-rn/blob/master/LICENSE)

This package provides an implementation of [IKeyEntryStorage](https://github.com/VirgilSecurity/virgil-sdk-javascript/blob/master/src/Storage/KeyEntryStorage/IKeyEntryStorage.ts) for React Native.

## Install
First you will need the package itself.
```sh
npm install @virgilsecurity/key-storage-rn@next
```

Then you will need to install the pre-release versions of [virgil-sdk](https://github.com/VirgilSecurity/virgil-sdk-javascript) and [virgil-crypto](https://github.com/VirgilSecurity/virgil-crypto-javascript).
```sh
npm install virgil-crypto@next virgil-sdk@next
```

Lastly you need to install [react-native-keychain](https://github.com/oblador/react-native-keychain) if you're using React Native with native code.
```sh
npm install react-native-keychain
```

## Usage
There are 2 options:
- If you're using React Native with [Expo](https://expo.io):
  ```js
  import createExpoKeyEntryStorage from '@virgilsecurity/key-storage-rn/expo';
  const keyEntryStorage = createExpoKeyEntryStorage();
  ```
- If you're using React Native with native code:
  ```js
  import createNativeKeyEntryStorage from '@virgilsecurity/key-storage-rn/native';
  const keyEntryStorage = createNativeKeyEntryStorage();
  ```
Both of them return an instance of class that implements [IKeyEntryStorage](https://github.com/VirgilSecurity/virgil-sdk-javascript/blob/master/src/Storage/KeyEntryStorage/IKeyEntryStorage.ts) interface.

## Example
Here is an example on how to use [PrivateKeyStorage](https://github.com/VirgilSecurity/virgil-sdk-javascript/blob/master/src/Storage/PrivateKeyStorage.ts) to store private keys.
```js
import createExpoKeyEntryStorage from '@virgilsecurity/key-storage-rn/expo';
import { VirgilCrypto, VirgilPrivateKeyExporter } from 'virgil-crypto';
import { PrivateKeyStorage } from 'virgil-sdk';

const virgilCrypto = new VirgilCrypto();
const virgilPrivateKeyExporter = new VirgilPrivateKeyExporter(virgilCrypto);
const expoKeyEntryStorage = createExpoKeyEntryStorage();
const privateKeyStorage = new PrivateKeyStorage(
  virgilPrivateKeyExporter,
  expoKeyEntryStorage,
);

const { privateKey: privateKey1 } = virgilCrypto.generateKeys();
const privateKey1Name = 'privateKey1';
const { privateKey: privateKey2 } = virgilCrypto.generateKeys();
const privateKey2Name = 'privateKey2';

privateKeyStorage
  .store(privateKey1Name, privateKey1)
  .then(() => {
    console.log(`${privateKey1Name} saved`);
    return privateKeyStorage.store(privateKey2Name, privateKey2);
  })
  .then(() => {
    console.log(`${privateKey2Name} saved`);
    return privateKeyStorage.load(privateKey1Name);
  })
  .then(key => {
    console.log(`${privateKey1Name} loaded`);
    return privateKeyStorage.delete(privateKey2Name);
  })
  .then(() => {
    console.log(`${privateKey2Name} deleted`);
    return privateKeyStorage.load(privateKey2Name);
  })
  .then(key => {
    console.log(`${privateKey2Name} is null`);
  });
```

## Development
First, you need to clone this repository and install dependencies.
```sh
git clone https://github.com/VirgilSecurity/virgil-key-storage-rn.git
cd key-storage-rn
yarn install
```
Then you can use the following commands:
- If you want to run tests:
  ```sh
  yarn test
  ```
- If you want to delete all generated files:
  ```sh
  yarn clean
  ```
- If you want to build project:
  ```sh
  yarn build
  ```
- If you want to run linters:
  ```sh
  yarn lint
  ```

## License
This library is released under the [BSD 3-Clause License](LICENSE).
