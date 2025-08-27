// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
  production: false,
  s3: {
    S3: { // ✅ not AWSS3
      bucket: 'footballappdata', // ✅ no arn
      region: 'us-west-2'
    }
  }
};
