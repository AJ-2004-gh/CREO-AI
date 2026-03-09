/**
 * DynamoDB Document Client
 * Uses DynamoDBDocumentClient for easy JS-object marshalling/unmarshalling.
 * Credentials and region are loaded from environment variables.
 */
import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const config: DynamoDBClientConfig = {
    region: process.env.CREO_AWS_REGION || process.env.NEXT_PUBLIC_REGION || 'us-east-1',
};

if (process.env.CREO_AWS_ACCESS_KEY_ID && process.env.CREO_AWS_SECRET_ACCESS_KEY) {
    config.credentials = {
        accessKeyId: process.env.CREO_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.CREO_AWS_SECRET_ACCESS_KEY,
    };
}

const client = new DynamoDBClient(config);

// DynamoDBDocumentClient auto-marshals JS objects ↔ DynamoDB AttributeValue
export const dynamoDb = DynamoDBDocumentClient.from(client);
