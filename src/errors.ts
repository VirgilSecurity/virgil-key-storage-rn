export class VirgilKeyStorageRnError extends Error {
  name: string;
  // tslint:disable-next-line variable-name
  constructor(m: string, name: string = 'VirgilError', ParentClass: any = VirgilKeyStorageRnError) {
    super(m);
    Object.setPrototypeOf(this, ParentClass.prototype);
    this.name = name;
  }
}

export class KeyEntryAlreadyExistsError extends VirgilKeyStorageRnError {
  constructor(name?: string) {
    super(
      `Key entry ${name ? `named ${name}` : 'with same name'}already exists`,
      'KeyEntryAlreadyExistsError',
      KeyEntryAlreadyExistsError,
    );
  }
}

export class KeyEntryDoesNotExistError extends VirgilKeyStorageRnError {
  constructor(name: string) {
    super(
      `Key entry ${name ? `named ${name}` : 'with the given name'} does not exist.`,
      'KeyEntryDoesNotExistError',
      KeyEntryDoesNotExistError,
    );
  }
}
