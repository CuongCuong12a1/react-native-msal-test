import type { MSALConfiguration, MSALInteractiveParams, MSALSilentParams, MSALAccount, MSALSignoutParams, MSALResult, IPublicClientApplication } from './types';
export default class PublicClientApplication implements IPublicClientApplication {
    private readonly config;
    private static readonly notInitializedError;
    private _pca?;
    constructor(config: MSALConfiguration, init?: boolean);
    init(): Promise<void>;
    /**
     * Acquire a token interactively
     * @param {MSALInteractiveParams} params
     * @return Result containing an access token and account identifier
     * used for acquiring subsequent tokens silently
     */
    acquireToken(params: MSALInteractiveParams): Promise<MSALResult>;
    /**
     * Acquire a token silently
     * @param {MSALSilentParams} params - Includes the account identifer retrieved from a
     * previous interactive login
     * @return Result containing an access token and account identifier
     * used for acquiring subsequent tokens silently
     */
    acquireTokenSilent(params: MSALSilentParams): Promise<MSALResult>;
    /**
     * Get all accounts for which this application has refresh tokens
     * @return Promise containing array of MSALAccount objects for which this application has refresh tokens.
     */
    getAccounts(): Promise<MSALAccount[]>;
    /** Retrieve the account matching the identifier
     * @return Promise containing MSALAccount object
     */
    getAccount(accountIdentifier: string): Promise<MSALAccount>;
    /**
     * Removes all tokens from the cache for this application for the provided
     * account.
     * @param {MSALAccount} account
     * @return A promise containing a boolean = true if account removal was successful
     * otherwise rejects
     */
    removeAccount(account: MSALAccount): Promise<boolean>;
    /**
     * Removes all tokens from the cache for this application for the provided
     * account.
     * @param {MSALSignoutParams} params
     * @return A promise which resolves if sign out is successful,
     * otherwise rejects
     */
    signOut(params: MSALSignoutParams): Promise<boolean>;
}
