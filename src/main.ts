import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { Amplify } from 'aws-amplify';
import { fetchAuthSession, signOut } from 'aws-amplify/auth';
import { authConfig } from './amplify-auth-config';

function clearAmplifyStorage() {
  try {
    localStorage.removeItem('CognitoIdentityId'); // identity id
    localStorage.removeItem('aws.cognito.identity.id');
    localStorage.removeItem('aws.cognito.identity.providers');
    localStorage.removeItem('aws.cognito.identity');
    sessionStorage.clear();

    // Clear IndexedDB
    indexedDB.deleteDatabase('amplify-datastore');
    indexedDB.deleteDatabase('AmplifyDatastore');
  } catch (err) {
    console.warn('Error clearing Amplify storage', err);
  }
}

if (environment.production) {
  enableProdMode();
}

Amplify.configure({
  Auth: authConfig.Auth as any,
  Storage: environment.s3 , // ✅ add this
});



async function initAuth() {
  try {
    const session = await fetchAuthSession();
    // console.log('AWS credentials:', session.credentials);
  } catch (err: any) {
    console.error('Auth session error:', err);

    if (
      err.message?.includes('Invalid identity pool configuration') ||
      err.message?.includes('NoCredentials')
    ) {
      console.warn('Clearing stale Amplify credentials and retrying...');
      
      await signOut({ global: true });
      clearAmplifyStorage();

      try {
        const session = await fetchAuthSession();
      } catch (retryErr) {
        console.error('Retry still failed:', retryErr);
      }
    }
  }
}

initAuth();

  platformBrowser()
  .bootstrapModule(AppModule)
  .then(async () => {
    try {
      const session = await fetchAuthSession();
      // console.log('AWS credentials:', session.credentials);
    } catch (err) {
      console.error('Error fetching session:', err);
    }
  })
  .catch(err => console.error(err));