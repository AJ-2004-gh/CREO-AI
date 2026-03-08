/**
 * Login API Route — Cognito InitiateAuth via AWS SDK
 * Accepts { email, password }, returns { accessToken }
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import {
    CognitoIdentityProviderClient,
    CognitoIdentityProviderClientConfig,
    InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { calculateSecretHash } from '@/lib/authUtils';

<<<<<<< HEAD
const config: CognitoIdentityProviderClientConfig = {
    region: process.env.CREO_AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
};

if (process.env.CREO_AWS_ACCESS_KEY_ID && process.env.CREO_AWS_SECRET_ACCESS_KEY) {
    config.credentials = {
        accessKeyId: process.env.CREO_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.CREO_AWS_SECRET_ACCESS_KEY,
    };
}

const cognitoClient = new CognitoIdentityProviderClient(config);
=======
const cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.CREO_AWS_REGION || 'us-east-1',
    credentials: process.env.CREO_AWS_ACCESS_KEY_ID && process.env.CREO_AWS_SECRET_ACCESS_KEY ? {
        accessKeyId: process.env.CREO_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.CREO_AWS_SECRET_ACCESS_KEY,
    } : undefined,
});
>>>>>>> 64e54235b238b63c202762a3f094e7cf6448a81e

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const clientId = process.env.COGNITO_CLIENT_ID!;
        const clientSecret = process.env.COGNITO_CLIENT_SECRET;

        const authParams: Record<string, string> = {
            USERNAME: email,
            PASSWORD: password,
        };

        if (clientSecret) {
            authParams.SECRET_HASH = calculateSecretHash(email, clientId, clientSecret);
        }

        const command = new InitiateAuthCommand({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: clientId,
            AuthParameters: authParams,
        });

        const response = await cognitoClient.send(command);
        const tokens = response.AuthenticationResult;

        if (!tokens?.AccessToken) {
            return res.status(401).json({ error: 'Authentication failed' });
        }

        return res.status(200).json({
            accessToken: tokens.AccessToken,
            idToken: tokens.IdToken,
            refreshToken: tokens.RefreshToken,
        });
    } catch (error) {
        console.error('[/api/auth/login] Error:', error);

        // Extract Cognito error name (e.g. NotAuthorizedException, InvalidParameterException)
        const errorName = (error as { name?: string }).name ?? '';
        const message = error instanceof Error ? error.message : 'Authentication failed';

        console.error('[/api/auth/login] Cognito error name:', errorName, '| message:', message);

        if (errorName === 'NotAuthorizedException' || message.includes('Incorrect username or password')) {
            return res.status(401).json({ error: 'Incorrect email or password' });
        }
        if (errorName === 'UserNotFoundException') {
            return res.status(401).json({ error: 'No account found with this email' });
        }
        if (errorName === 'InvalidParameterException') {
            // Most common cause: USER_PASSWORD_AUTH not enabled on App Client
            return res.status(400).json({
                error: `Cognito config error: ${message}. Ensure USER_PASSWORD_AUTH is enabled on your App Client in the AWS Console.`,
            });
        }
        if (errorName === 'CredentialsProviderError' || message.includes('Could not load credentials')) {
            return res.status(500).json({
                error: 'AWS credentials not configured. Check CREO_AWS_ACCESS_KEY_ID and CREO_AWS_SECRET_ACCESS_KEY in .env',
            });
        }
        // Fallback: return the raw error name so you can debug it
        return res.status(500).json({
            error: `Authentication error [${errorName || 'Unknown'}]: ${message}`,
        });
    }
}
