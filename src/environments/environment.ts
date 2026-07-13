// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //defaultauth: 'https://atns-backend.atns-guinee.com',
   defaultauth: 'http://41.77.184.36:8087/douaneConnect',
  // Clé secrète pour le cryptage AES-256 du token stocké dans le navigateur (sessionStorage)
  encryptionSecretKey: 'douane-connect-secret-key-2024-secure',
  // Doit être identique à `token.encryption.secret` dans application.properties du backend :
  // c'est la clé utilisée pour déchiffrer (AES-256-GCM) le token émis par /authenticate
  serverTokenSecret: 'DouaneConnect2025SecureTokenEncryptionKeyForAES256',
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  }
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
