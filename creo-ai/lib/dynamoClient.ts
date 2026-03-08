/**
 * DynamoDB Document Client
 * Uses DynamoDBDocumentClient for easy JS-object marshalling/unmarshalling.
 * Credentials and region are loaded from environment variables.
 */
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
    region: process.env.CREO_AWS_REGION || 'us-east-1',
    credentials: process.env.CREO_AWS_ACCESS_KEY_ID && process.env.CREO_AWS_SECRET_ACCESS_KEY ? {
        accessKeyId: process.env.CREO_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.CREO_AWS_SECRET_ACCESS_KEY,
    } : undefined,
});

// DynamoDBDocumentClient auto-marshals JS objects ↔ DynamoDB AttributeValue
export const dynamoDb = DynamoDBDocumentClient.from(client);
