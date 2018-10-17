/**
 * tokenStorage
 */
import storage from './storage';

const StorageKey = 'Token';

export default class TokenStorage {

  public static getToken(): any {
    return storage.getItem(StorageKey, '');
  }

  public static setToken(value: any): void {
    storage.setItem(StorageKey, JSON.stringify(value));
  }

  public static removeItem(): void {
    storage.removeItem(StorageKey);
  }
}
