import * as cdk from 'aws-cdk-lib';
import * as path from 'path';
import {
  aws_lambda,
  aws_iam as iam,
}
  from 'aws-cdk-lib';
import * as constructs from 'constructs';

export interface CreateLambdaConstructProps extends cdk.StackProps {
  codestarConnectionArn: string;
  gitHubRepo: string;
}

export class Org2Cdk extends constructs.Construct {
  constructor(scope: constructs.Construct, id: string, props: CreateLambdaConstructProps) {
    super(scope, id);


    // create a python lambda using the code in ./lambda that needs a bundler
    const lambda = new aws_lambda.Function(this, 'Org2CdkLambdaFunction', {
      runtime: aws_lambda.Runtime.PYTHON_3_10,
      code: aws_lambda.Code.fromAsset(path.join(__dirname,'./lambda'), {
        bundling: {
          image: aws_lambda.Runtime.PYTHON_3_10.bundlingImage,
          command: [
            'bash', '-c',
            'pip install -r requirements.txt --target /asset-output && cp -r . /asset-output'
          ],
        },
      }),
      handler: 'org2cdk.lambda_handler',
      environment: {
        'CODESTAR_CONNECTION_ARN': props.codestarConnectionArn,
        'GITHUB_REPO': props.gitHubRepo,
      },
      timeout: cdk.Duration.seconds(600),
    });

    lambda.addToRolePolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'codestar-connections:UseConnection',
        ],
        resources: [props.codestarConnectionArn],
    }));

    lambda.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'organizations:ListAccounts',
      ],
      resources: ['*'],
    }));
  }
}