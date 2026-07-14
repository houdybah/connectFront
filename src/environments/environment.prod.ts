export const environment = {
  production: true,
  // defaultauth: 'http://41.77.184.36:8087/douaneConnect',
  defaultauth: 'http://localhost:8091',
  // Clé secrète pour le cryptage AES-256 du token stocké dans le navigateur (sessionStorage)
  // IMPORTANT: En production, utilisez une variable d'environnement sécurisée
  encryptionSecretKey: 'douane-connect-prod-secret-key-2024-secure-change-me',
  // Doit être identique à `token.encryption.secret` dans application.properties du backend
  // IMPORTANT: En production, synchroniser via variable d'environnement sécurisée
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
