export const environment = {
  production: true,
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
