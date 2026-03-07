/**
 * DynamoDB Document Client
 * Uses DynamoDBDocumentClient for easy JS-object marshalling/unmarshalling.
 * Credentials and region are loaded from environment variables.
 */
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
    region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
    // Credentials will be automatically loaded from IAM role in production
    // or from environment in development
});

// DynamoDBDocumentClient auto-marshals JS objects ↔ DynamoDB AttributeValue
export const dynamoDb = DynamoDBDocumentClient.from(client);
