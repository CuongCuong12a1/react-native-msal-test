import type { B2CConfiguration } from './b2cClient';

export const b2cConfig: B2CConfiguration = {
  auth: {
    clientId: '1b760dc7-4422-4dff-904b-3fece6b848d0',
    authorityBase: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    policies: {
      signInSignUp: 'B2C_1_SignInUp',
      passwordReset: 'B2C_1_PasswordReset',
    },
  },
  // web only:
  cache: { cacheLocation: 'localStorage' },
};

export const b2cScopes = ['https://orgb7413eb8.crm5.dynamics.com/.default'];
