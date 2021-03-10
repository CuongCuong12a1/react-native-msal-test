function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Platform } from 'react-native';
import RNMSAL from './nativeModule';
export default class PublicClientApplication {
  constructor(config, init = true) {
    this.config = config;

    _defineProperty(this, "isInitialized", false);

    if (init) this.init();
  }

  async init() {
    if (!this.isInitialized) {
      await RNMSAL.createPublicClientApplication(this.config);
      this.isInitialized = true;
    }
  }
  /**
   * Acquire a token interactively
   * @param {MSALInteractiveParams} params
   * @return Result containing an access token and account identifier
   * used for acquiring subsequent tokens silently
   */


  acquireToken(params) {
    this.throwIfNotInitialized();
    return RNMSAL.acquireToken(params);
  }
  /**
   * Acquire a token silently
   * @param {MSALSilentParams} params - Includes the account identifer retrieved from a
   * previous interactive login
   * @return Result containing an access token and account identifier
   * used for acquiring subsequent tokens silently
   */


  acquireTokenSilent(params) {
    this.throwIfNotInitialized();
    return RNMSAL.acquireTokenSilent(params);
  }
  /**
   * Get all accounts for which this application has refresh tokens
   * @return Promise containing array of MSALAccount objects for which this application has refresh tokens.
   */


  getAccounts() {
    this.throwIfNotInitialized();
    return RNMSAL.getAccounts();
  }
  /** Retrieve the account matching the identifier
   * @return Promise containing MSALAccount object
   */


  getAccount(accountIdentifier) {
    this.throwIfNotInitialized();
    return RNMSAL.getAccount(accountIdentifier);
  }
  /**
   * Removes all tokens from the cache for this application for the provided
   * account.
   * @param {MSALAccount} account
   * @return A promise containing a boolean = true if account removal was successful
   * otherwise rejects
   */


  removeAccount(account) {
    this.throwIfNotInitialized();
    return RNMSAL.removeAccount(account);
  }
  /**
   * NOTE: iOS only. On Android this is the same as `removeAccount`
   * Removes all tokens from the cache for this application for the provided
   * account. Additionally, this will remove the account from the system browser.
   * @param {MSALSignoutParams} params
   * @return A promise which resolves if sign out is successful,
   * otherwise rejects
   * @platform ios
   */


  signOut(params) {
    this.throwIfNotInitialized();
    return Platform.OS === 'ios' ? RNMSAL.signout(params) : this.removeAccount(params.account);
  }

  throwIfNotInitialized() {
    if (!this.isInitialized) {
      throw Error('PublicClientApplication instance not initialized.');
    }
  }

}
//# sourceMappingURL=publicClientApplication.native.js.map