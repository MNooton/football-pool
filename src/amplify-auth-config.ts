export const authConfig = {
  Auth: { 
    Cognito: {
      identityPoolId: 'us-west-2:38573e23-157a-4097-bd61-42a89029b8ce',
      userPoolId: 'us-west-2_BGgWBupjc',
      userPoolClientId: '7bp84fv75sp0d0fi2g6cc5t45u', 
      region: 'us-west-2',
      allowGuestAccess: true
    }
  }, 
  Storage: {
      AWSS3: {
        bucket: 'footballappdata', // REQUIRED -  Amazon S3 bucket
        region: 'us-west-2', // OPTIONAL -  Amazon service region
      }
    }
//   mandatorySignIn: false,    // Add this
//   authenticationFlowType: 'USER_SRP_AUTH', // optional but safe
};