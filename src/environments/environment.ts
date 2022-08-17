// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  cognito: {
    userPoolId: 'us-west-2_BGgWBupjc', // 'us-east-1_GuwbXcMjJ',
    userPoolWebClientId: '7bp84fv75sp0d0fi2g6cc5t45u', // 'sjo7m2jn0085jne07shsjldvv', // 'u9ag63dicaas31345it4gb1d0',
    region: 'us-west-2'
  },
  s3: {
    AWSS3: {
        bucket: 'arn:aws:s3:::footballappdata', // REQUIRED -  Amazon S3 bucket
        region: 'us-west-2', // OPTIONAL -  Amazon service region
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
