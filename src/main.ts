import { App } from 'aws-cdk-lib';
import { MyOrg } from './myorg';

const app = new App();

new MyOrg(app, 'org2cdk-dev', {
  //env: devEnv 
});

app.synth();