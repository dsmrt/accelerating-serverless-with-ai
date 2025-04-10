import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
// import * as dotenv from 'dotenv'; NOOOOOO
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AcceleratingServerlessWithAiStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const wisdomLambda = new lambdaNodejs.NodejsFunction(this, 'wisdom-get', {
            runtime: lambda.Runtime.NODEJS_18_X,
            timeout: cdk.Duration.seconds(10),
            environment: {
                // NOOOOO
                OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
            },
        });

        const api = new apigateway.RestApi(this, 'WisdomAPI', {
            restApiName: 'Words of Wisdom Service',
            description: 'Returns insightful wisdom from ChatGPT.',
            deployOptions: {
                stageName: 'prod',
            },
        });

        // Create API Key and Usage Plan
        const apiKey = api.addApiKey('WisdomApiKey', {
            apiKeyName: 'WisdomApiKey',
        });

        const plan = api.addUsagePlan('WisdomUsagePlan', {
            name: 'EasyPlan',
            apiStages: [{ api, stage: api.deploymentStage }],
        });

        plan.addApiKey(apiKey);

        const wisdomIntegration = new apigateway.LambdaIntegration(wisdomLambda);
        wisdomLambda.addToRolePolicy(new iam.PolicyStatement({
            actions: ['ssm:GetParameter'],

            // resources: ['arn:aws:ssm:<region>:<account-id>:parameter/openai/api-key']
            // ... I guess I have to do this
            resources: [`arn:aws:ssm:${cdk.Stack.of(this).region}:${cdk.Stack.of(this).account}:parameter/openai/api-key`]
        }));

        api.root
        .resourceForPath('wisdom')
        .addMethod('GET', wisdomIntegration, {
            apiKeyRequired: true,  // enforce API key
        });

        // Output API Key value
        new cdk.CfnOutput(this, 'ApiKeyValue', {
            value: apiKey.keyId,
            description: 'API Gateway Key ID (retrieve full value from AWS Console)',
        });

        new cdk.CfnOutput(this, 'ApiUrl', {
            value: api.url + 'wisdom',
            description: 'URL of the API endpoint',
        });
    }
}
