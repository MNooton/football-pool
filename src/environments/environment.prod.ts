export const environment = {
  production: true,
  s3: {
    S3: {
        bucket: 'footballappdata', // REQUIRED -  Amazon S3 bucket
        region: 'us-west-2', // OPTIONAL -  Amazon service region
    }
  }
};
