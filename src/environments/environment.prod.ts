export const environment = {
  production: true,
  defaultauth: 'http://localhost:8091',
  // Clé secrète pour le cryptage AES-256 du token
  // IMPORTANT: En production, utilisez une variable d'environnement sécurisée
  encryptionSecretKey: 'douane-connect-prod-secret-key-2024-secure-change-me',
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
