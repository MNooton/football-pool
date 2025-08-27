// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
  production: false,
  Auth: { 
    Cognito: {
      identityPoolId: 'us-west-2:38573e23-157a-4097-bd61-42a89029b8ce',
      userPoolId: 'us-west-2_BGgWBupjc',
      userPoolClientId: '7bp84fv75sp0d0fi2g6cc5t45u', // <-- Note the 'Web' here
      region: 'us-west-2'
    }
  }, 
  s3: {
    S3: { // ✅ not AWSS3
      bucket: 'footballappdata', // ✅ no arn
      region: 'us-west-2'
    }
  }
};
