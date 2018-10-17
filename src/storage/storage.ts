/**
 * localStorage
 */

export default class Storage {
  public static getItem(key: any, defaultValue: any): any {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    } else if (defaultValue) {
      return defaultValue;
    }
    return null;
  }

  public static setItem(key: any, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public static removeItem(key: any): void {
    localStorage.removeItem(key);
  }
}
