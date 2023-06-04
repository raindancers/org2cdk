import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Org2Cdk } from './constructs/org2cdk';


export class MyOrg extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

	new Org2Cdk(this, 'Org2Cdk', {
		codestarConnectionArn: 'arn:aws:codestar-connections:ap-southeast-2:160165474064:connection/ff49fac1-98e7-4498-8d82-89ff10e7a222',
		gitHubRepo: '/raindancers/org',
	});
  }
}	