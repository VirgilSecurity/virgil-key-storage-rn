# @virgilsecurity/key-storage-rn
[![npm](https://img.shields.io/npm/v/@virgilsecurity/key-storage-rn.svg)](https://www.npmjs.com/package/@virgilsecurity/key-storage-rn)
[![Build Status](https://img.shields.io/travis/VirgilSecurity/virgil-key-storage-rn.svg)](https://travis-ci.org/VirgilSecurity/virgil-key-storage-rn)
[![GitHub license](https://img.shields.io/badge/license-BSD%203--Clause-blue.svg)](https://github.com/VirgilSecurity/virgil-key-storage-rn/blob/master/LICENSE)

> Important! This README is for `@virgilsecurity/key-storage-rn` v0.2.x. If you are here for the previous version, check out the [v0.1.x branch](https://github.com/VirgilSecurity/virgil-key-storage-rn/tree/v0.1.x)

This package provides an implementation of [IKeyEntryStorage](https://github.com/VirgilSecurity/virgil-sdk-javascript/blob/master/src/Storage/KeyEntryStorage/IKeyEntryStorage.ts) for React Native.

## Install

First you will need this package itself.
```sh
npm install @virgilsecurity/key-storage-rn
```

Then you'll need to install [react-native-keychain](https://github.com/oblador/react-native-keychain) if you're using React Native with native code.
```sh
npm install react-native-keychain
```

And finally, make sure you have the VirgilCrypto library for React Native - [react-native-virgil-crypto](https://github.com/VirgilSecurity/react-native-virgil-crypto). Follow the instructions in [README](https://github.com/VirgilSecurity/react-native-virgil-crypto#getting-started) to install it if you haven't already.

> If you use [E3kit](https://github.com/VirgilSecurity/virgil-e3kit-js/) then you don't need to install the packages listed below

If you want to use this library without E3kit, you will need to make sure you have the current version (v6.x) of [virgil-sdk](https://github.com/VirgilSecurity/virgil-sdk-javascript) installed. This is where the high-level `PrivateKeyStorage` class is defined.
```sh
npm install virgil-sdk
```

Then you'll need the package that contains helper classes depended upon by the `PrivateKeyStorage`, namely the `PrivateKeyExporter` class.
```sh
npm install @virgilsecurity/sdk-crypto
```

## Usage

With [E3kit](https://github.com/VirgilSecurity/virgil-e3kit-js/) you just need to install this package and it will be picked up automatically.

For standalone installations, there are 2 options:
- If you're using React Native with native code:
  ```js
  import createNativeKeyEntryStorage from '@virgilsecurity/key-storage-rn/native';
  const keyEntryStorage = createNativeKeyEntryStorage();
  ```
- If you're using Expo, you need to follow [their installation instructions](https://github.com/expo/expo/tree/master/packages/expo-secure-store):
  > Please note that ExpoStorage will be removed in next major release in favor of native module.
  ```js
  import createExpoKeyEntryStorage from '@virgilsecurity/key-storage-rn/expo';
  const keyEntryStorage = createExpoKeyEntryStorage();
  ```
Both of them return an instance of class that implements [IKeyEntryStorage](https://github.com/VirgilSecurity/virgil-sdk-javascript/blob/master/src/Storage/KeyEntryStorage/IKeyEntryStorage.ts) interface.

## Example

> For an example of usage with E3kit, check out the [sample project](https://github.com/VirgilSecurity/virgil-e3kit-js/tree/master/example/E3kitReactNative) in the E3kit repository.

Here is an example on how to use [PrivateKeyStorage](https://github.com/VirgilSecurity/virgil-sdk-javascript/blob/master/src/Storage/PrivateKeyStorage.ts) to store private keys.
```js
import createNativeKeyEntryStorage from '@virgilsecurity/key-storage-rn/native';
import { virgilCrypto } from 'react-native-virgil-crypto';
import { VirgilPrivateKeyExporter } from '@virgilsecurity/sdk-crypto';
import { PrivateKeyStorage } from 'virgil-sdk';

const virgilPrivateKeyExporter = new VirgilPrivateKeyExporter(virgilCrypto);
const keyEntryStorage = createNativeKeyEntryStorage();
const privateKeyStorage = new PrivateKeyStorage(
  virgilPrivateKeyExporter,
  keyEntryStorage
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
