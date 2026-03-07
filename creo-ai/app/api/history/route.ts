import { NextResponse } from 'next/server';
import { dynamoDb } from '@/lib/dynamoClient';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID!,
  tokenUse: 'access',
  clientId: process.env.COGNITO_CLIENT_ID!,
});

const POSTS_TABLE = process.env.POSTS_TABLE!;

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    if (!authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const payload = await verifier.verify(token);
    const userId = payload.sub;

    const command = new QueryCommand({
      TableName: POSTS_TABLE,
      KeyConditionExpression: 'user_id = :uid',
      ExpressionAttributeValues: {
        ':uid': userId,
      },
      ScanIndexForward: false, // Descending order (newest first)
    });

    const result = await dynamoDb.send(command);

    return NextResponse.json({ posts: result.Items || [] });
  } catch (error) {
    console.error('[/api/history] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
