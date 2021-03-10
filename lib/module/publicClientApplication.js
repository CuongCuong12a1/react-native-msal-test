function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { PublicClientApplication as MSALPublicClientApplication } from '@azure/msal-browser';
import { MSALPromptType } from './types';

function promptTypeToString(promptType) {
  switch (promptType) {
    case MSALPromptType.SELECT_ACCOUNT:
      return 'select_account';

    case MSALPromptType.LOGIN:
      return 'login';

    case MSALPromptType.CONSENT:
      return 'consent';

    case MSALPromptType.WHEN_REQUIRED:
      return 'none';
  }
}

export default class PublicClientApplication {
  constructor(config, init = true) {
    this.config = config;

    _defineProperty(this, "_pca", void 0);

    if (init) this.init();
  }

  async init() {
    this._pca = new MSALPublicClientApplication(this.config);
  }
  /**
   * Acquire a token interactively
   * @param {MSALInteractiveParams} params
   * @return Result containing an access token and account identifier
   * used for acquiring subsequent tokens silently
   */


  async acquireToken(params) {
    if (!this._pca) throw PublicClientApplication.notInitializedError;
    const {
      promptType,
      ...paramsWithoutPromptType
    } = params;
    const {
      accessToken,
      account,
      expiresOn,
      idToken,
      idTokenClaims,
      scopes,
      tenantId
    } = await this._pca.acquireTokenPopup(promptType ? { ...paramsWithoutPromptType,
      prompt: promptTypeToString(promptType)
    } : paramsWithoutPromptType);
    return {
      accessToken,
      account: {
        identifier: account.homeAccountId,
        environment: account.environment,
        tenantId: account.tenantId,
        username: account.username,
        claims: idTokenClaims
      },
      expiresOn: expiresOn === null || expiresOn === void 0 ? void 0 : expiresOn.getTime(),
      idToken,
      scopes,
      tenantId
    };
  }
  /**
   * Acquire a token silently
   * @param {MSALSilentParams} params - Includes the account identifer retrieved from a
   * previous interactive login
   * @return Result containing an access token and account identifier
   * used for acquiring subsequent tokens silently
   */


  async acquireTokenSilent(params) {
    var _params$account$envir;

    if (!this._pca) throw PublicClientApplication.notInitializedError;
    const {
      accessToken,
      account,
      expiresOn,
      idToken,
      idTokenClaims,
      scopes,
      tenantId
    } = await this._pca.acquireTokenSilent({ ...params,
      account: { ...params.account,
        homeAccountId: params.account.identifier,
        environment: (_params$account$envir = params.account.environment) !== null && _params$account$envir !== void 0 ? _params$account$envir : '',
        localAccountId: ''
      }
    });
    return {
      accessToken,
      account: {
        identifier: account === null || account === void 0 ? void 0 : account.homeAccountId,
        environment: account === null || account === void 0 ? void 0 : account.environment,
        tenantId: account === null || account === void 0 ? void 0 : account.tenantId,
        username: account === null || account === void 0 ? void 0 : account.username,
        claims: idTokenClaims
      },
      expiresOn: expiresOn === null || expiresOn === void 0 ? void 0 : expiresOn.getTime(),
      idToken,
      scopes,
      tenantId
    };
  }
  /**
   * Get all accounts for which this application has refresh tokens
   * @return Promise containing array of MSALAccount objects for which this application has refresh tokens.
   */


  getAccounts() {
    if (!this._pca) throw PublicClientApplication.notInitializedError;

    const accounts = this._pca.getAllAccounts();

    return Promise.resolve(accounts.map(a => {
      const {
        homeAccountId: identifier,
        environment,
        tenantId,
        username
      } = a;
      return {
        identifier,
        environment,
        tenantId,
        username
      };
    }));
  }
  /** Retrieve the account matching the identifier
   * @return Promise containing MSALAccount object
   */


  getAccount(accountIdentifier) {
    if (!this._pca) throw PublicClientApplication.notInitializedError;

    const account = this._pca.getAccountByHomeId(accountIdentifier);

    if (account == null) {
      return Promise.reject('Account not found');
    } else {
      const {
        homeAccountId: identifier,
        environment,
        tenantId,
        username
      } = account;
      return Promise.resolve({
        identifier,
        environment,
        tenantId,
        username
      });
    }
  }
  /**
   * Removes all tokens from the cache for this application for the provided
   * account.
   * @param {MSALAccount} account
   * @return A promise containing a boolean = true if account removal was successful
   * otherwise rejects
   */


  async removeAccount(account) {
    var _account$environment;

    if (!this._pca) throw PublicClientApplication.notInitializedError;
    await this._pca.logout({
      account: { ...account,
        homeAccountId: account.identifier,
        environment: (_account$environment = account.environment) !== null && _account$environment !== void 0 ? _account$environment : '',
        localAccountId: ''
      }
    });
    return true;
  }
  /**
   * Removes all tokens from the cache for this application for the provided
   * account.
   * @param {MSALSignoutParams} params
   * @return A promise which resolves if sign out is successful,
   * otherwise rejects
   */


  signOut(params) {
    return this.removeAccount(params.account);
  }

}

_defineProperty(PublicClientApplication, "notInitializedError", Error('PublicClientApplication instance not initialized.'));
//# sourceMappingURL=publicClientApplication.js.map