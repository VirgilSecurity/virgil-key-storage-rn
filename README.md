# @virgilsecurity/key-storage-rn
[![npm](https://img.shields.io/npm/v/@virgilsecurity/key-storage-rn.svg)](https://www.npmjs.com/package/@virgilsecurity/key-storage-rn)
[![Build Status](https://img.shields.io/travis/VirgilSecurity/virgil-key-storage-rn.svg)](https://travis-ci.org/VirgilSecurity/virgil-key-storage-rn)
[![GitHub license](https://img.shields.io/badge/license-BSD%203--Clause-blue.svg)](https://github.com/VirgilSecurity/virgil-key-storage-rn/blob/master/LICENSE)

> This README is for `@virgilsecurity/key-storage-rn` v1.0.0. If you are here for the previous version, check out the [v0.2.x branch](https://github.com/VirgilSecurity/virgil-key-storage-rn/tree/v0.2.x).

This package provides an implementation of [IStorageAdapter](https://github.com/VirgilSecurity/virgil-sdk-javascript/blob/master/src/Storage/adapters/IStorageAdapter.ts) for React Native and designed to be used in conjunction with [virgil-sdk](https://github.com/VirgilSecurity/virgil-sdk-javascript) or libraries that use it under the hood(for example [E3Kit](https://github.com/VirgilSecurity/virgil-e3kit-js/)).

## Install
1. Follow the installation guide for [react-native-keychain](https://github.com/oblador/react-native-keychain).

2. Follow the installation guide for [virgil-sdk](https://github.com/VirgilSecurity/virgil-sdk-javascript).
> Skip this step if you use [E3Kit](https://github.com/VirgilSecurity/virgil-e3kit-js/).

3. Install the package itself:
```sh
yarn add @virgilsecurity/key-storage-rn
```

## Usage
The following code snippet shows how to initialize the [KeyEntryStorage](https://github.com/VirgilSecurity/virgil-sdk-javascript/blob/master/src/Storage/KeyEntryStorage/KeyEntryStorage.ts) with an instance of `ReactNativeKeychainStorageAdapter`:
```js
import { ReactNativeKeychainStorageAdapter } from '@virgilsecurity/key-storage-rn';
import { KeyEntryStorage } from 'virgil-sdk';

const keyEntryStorage = new KeyEntryStorage({ adapter: new ReactNativeKeychainStorageAdapter() });
```

## License
This library is released under the [3-clause BSD License](https://github.com/VirgilSecurity/virgil-crypto-javascript/tree/master/LICENSE).

## Support
Our developer support team is here to help you.

You can find us on [Twitter](https://twitter.com/VirgilSecurity) or send us email support@VirgilSecurity.com.

Also, get extra help from our support team on [Slack](https://virgilsecurity.com/join-community).
