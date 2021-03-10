import { MSALInteractiveParams, MSALResult, MSALSilentParams, MSALSignoutParams, MSALConfiguration } from 'react-native-msal';
export interface B2CPolicies {
    signInSignUp: string;
    passwordReset?: string;
}
export declare type B2CConfiguration = Omit<MSALConfiguration, 'auth'> & {
    auth: {
        clientId: string;
        authorityBase: string;
        policies: B2CPolicies;
        redirectUri?: string;
    };
};
export declare type B2CSignInParams = Omit<MSALInteractiveParams, 'authority'>;
export declare type B2CAcquireTokenSilentParams = Pick<MSALSilentParams, 'forceRefresh' | 'scopes'>;
export declare type B2CSignOutParams = Pick<MSALSignoutParams, 'signoutFromBrowser' | 'webviewParameters'>;
export default class B2CClient {
    private readonly config;
    private static readonly B2C_PASSWORD_CHANGE;
    private static readonly B2C_EXPIRED_GRANT;
    private pca;
    /** Construct a B2CClient object
     * @param clientId The id of the b2c application
     * @param authorityBase The authority URL, without a policy name.
     * Has the form: https://TENANT_NAME.b2clogin.com/tfp/TENANT_NAME.onmicrosoft.com/
     * @param policies An object containing the policies you will be using.
     * The sign in sign up policy is required, the rest are optional
     */
    constructor(config: B2CConfiguration);
    /** Initiates an interactive sign-in. If the user clicks "Forgot Password", and a reset password policy
     *  was provided to the client, it will initiate the password reset flow
     */
    signIn(params: B2CSignInParams): Promise<MSALResult>;
    /** Gets a token silently. Will only work if the user is already signed in */
    acquireTokenSilent(params: B2CAcquireTokenSilentParams): Promise<MSALResult>;
    /** Returns true if a user is signed in, false if not */
    isSignedIn(): Promise<boolean>;
    /** Removes all accounts from the device for this app. User will have to sign in again to get a token */
    signOut(params?: B2CSignOutParams): Promise<boolean>;
    private resetPassword;
    private getAccountForPolicy;
    private getAuthority;
}
