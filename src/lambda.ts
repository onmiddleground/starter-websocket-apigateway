import {APIGatewayProxyWebsocketEventV2, Context} from "aws-lambda";

/** Typical Flows for something like Save a Profile
 * - Client (ie React app, mobile app) use the WebSocket APIs to make a connection to the wss socket
 *      - to test this, use a site like (refer to https://websocketking.com/)
 * - The connect Lambda is invoked on connection.  Store the event.requestContext.connectionId in Dynamo along with
 *   token related info as the key (such as a user ID)
 */

export const connect = async (event: APIGatewayProxyWebsocketEventV2, context: Context): Promise<any> => {
    console.log(event);
    return {
        statusCode: 200
    }
};

// export const defaultNoMatch = async (event: APIGatewayProxyWebsocketEventV2, context: Context): Promise<any> => {
//     console.log(event);
//     return {
//         statusCode: 200
//     }
// };

export const sendMessage = async (event: APIGatewayProxyWebsocketEventV2, context: Context): Promise<any> => {
    console.log(`Connection ID: ${event?.requestContext?.connectionId}`);
    console.log(`Body of Request: ${event?.body}`);

    return {
        statusCode: 200
    }
};
