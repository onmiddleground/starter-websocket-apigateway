import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import * as apiGatewayV2 from 'aws-cdk-lib/aws-apigatewayv2';
import {WebSocketLambdaIntegration} from "aws-cdk-lib/aws-apigatewayv2-integrations";

class WebSocketAPIGatewayStack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    const sendMessageFunction = new lambda.Function(scope, `${id}-sendMessage-lambda`, {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset("../aws_dist/"),
      handler: "lambda.sendMessage"
    })

    const connectFunction = new lambda.Function(scope, `${id}-connected-lambda`, {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset("../aws_dist/"),
      handler: "lambda.connect"
    })

    // const disconnectFunction = new lambda.Function(scope, `${id}-disconnect-lambda`, {
    //   runtime: lambda.Runtime.NODEJS_18_X,
    //   code: lambda.Code.fromAsset("../aws_dist/"),
    //   handler: "lambda.disconnect"
    // })

    // const defaultFunction = new lambda.Function(scope, `${id}-default-lambda`, {
    //   runtime: lambda.Runtime.NODEJS_18_X,
    //   code: lambda.Code.fromAsset("../aws_dist/"),
    //   handler: "lambda.defaultNoMatch"
    // })

    const webSocketApi = new apiGatewayV2.WebSocketApi(scope, `${id}-WebSocketApi`);

    

    new apiGatewayV2.WebSocketStage(scope, `${id}-dev`, {
      webSocketApi,
      stageName: 'dev',
      autoDeploy: true,
    });

    webSocketApi.addRoute('sendMessage', {
      integration: new WebSocketLambdaIntegration(`${id}-SendMessageIntegration`, sendMessageFunction),
    });

    webSocketApi.addRoute('$connect', {
      integration: new WebSocketLambdaIntegration(`${id}-ConnectIntegration`, connectFunction),
    });

    // webSocketApi.addRoute('$disconnect', {
    //   integration: new WebSocketLambdaIntegration(`${id}-DisconnectIntegration`, disconnectFunction),
    // });

    // webSocketApi.addRoute('$default', {
    //   integration: new WebSocketLambdaIntegration(`${id}-DefaultIntegration`, defaultFunction),
    // });

    new cdk.CfnOutput(scope, 'WebSocketApiUrl', {
      value: webSocketApi.apiEndpoint!,
    });
  }
}

export class WebsocketCdk extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new WebSocketAPIGatewayStack(this,id,props);
  }
}
