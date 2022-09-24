import {
  requestMultiple,
  request,
  check,
  PERMISSIONS,
  Permission,
  checkMultiple,
  RESULTS,
} from 'react-native-permissions';

export const Permissions = PERMISSIONS;
export const PermissionsStorageKey = 'PERMISSIONS';
export const RequiredAppPermisions = [Permissions.ANDROID.CAMERA, Permissions.ANDROID.READ_EXTERNAL_STORAGE];

export default class PermissionManager {

  static async requestAppPermissions() {
    // check if app already has camera and external storage permissions
    const permissions = await this.checkPermissions(RequiredAppPermisions);
    // if not, request the permissions that have "DENIED" status
    const deniedPermissions = Object.keys(permissions).filter((key) => (permissions as any)[key] === RESULTS.DENIED);
    if (deniedPermissions.length > 0) {
      await this.requestPermissions(deniedPermissions as Permission[]);
    }
  }

  static async requestPermissions(permissions: Permission[]) {
    const result = await requestMultiple(permissions);
    return result;
  }

  static async checkPermissions(permissions: Permission[]) {
    const result = await checkMultiple(permissions);
    return result;
  }

  static async requestPermission(permission: Permission) {
    const result = await request(permission);
    return result;
  }

  static async checkPermission(permission: Permission) {
    const result = await check(permission);
    return result;
  }

  static async checkForRequest(permission: Permission): Promise<boolean> {
    const result = await this.checkPermission(permission);
    if (result === 'granted') {
      return true;
    }
    const resp = await this.requestPermission(permission);
    return resp === 'granted';
  }
}
