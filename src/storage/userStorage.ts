/**
 * userStorage
 */
import storage from './storage';

const UserInfoKey = 'user_info';

export default class UserStorage {

  public static saveUserInfo(user: any): any {
    return storage.setItem(UserInfoKey, user);
  }

  public static getUserInfo(): any {
    return storage.getItem(UserInfoKey, '');
  }
}
