/**
 * Google Auth Callback API Route — Exchanges OAuth2 code for Cognito tokens.
 * Redirects to /dashboard on success.
 */
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { code, error } = req.query;

    console.log('[/api/auth/callback] Request received:', {
        hasCode: !!code,
        hasError: !!error,
        error: error,
        method: req.method,
    });

    if (error) {
        console.error('[/api/auth/callback] OAuth error from Cognito:', error);
        return res.redirect(`/login?error=${encodeURIComponent(error as string)}`);
    }

    if (!code) {
        console.error('[/api/auth/callback] No authorization code received');
        return res.redirect('/login?error=no_code');
    }

    try {
        // Load environment variables
        const domain = process.env.COGNITO_DOMAIN;
        const clientId = process.env.COGNITO_CLIENT_ID;
        const clientSecret = process.env.COGNITO_CLIENT_SECRET;
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        
        console.log('[/api/auth/callback] Environment variables check:', {
            hasDomain: !!domain,
            hasClientId: !!clientId,
            hasClientSecret: !!clientSecret,
            hasBaseUrl: !!baseUrl,
            domainPrefix: domain ? domain.substring(0, 15) : 'MISSING',
            clientIdPrefix: clientId ? clientId.substring(0, 10) : 'MISSING',
            baseUrl: baseUrl || 'MISSING',
        });

        // Validate required environment variables
        if (!domain) {
            const errorMsg = 'COGNITO_DOMAIN environment variable is not set';
            console.error('[/api/auth/callback]', errorMsg);
            return res.redirect(`/login?error=${encodeURIComponent('config_error')}&details=${encodeURIComponent(errorMsg)}`);
        }

        if (!clientId) {
            const errorMsg = 'COGNITO_CLIENT_ID environment variable is not set';
            console.error('[/api/auth/callback]', errorMsg);
            return res.redirect(`/login?error=${encodeURIComponent('config_error')}&details=${encodeURIComponent(errorMsg)}`);
        }

        const redirectUri = `${baseUrl || 'http://localhost:3000'}/api/auth/callback`;
        
        console.log('[/api/auth/callback] Preparing token exchange:', {
            tokenEndpoint: `https://${domain}/oauth2/token`,
            redirectUri,
            hasClientSecret: !!clientSecret,
        });

        const details: Record<string, string> = {
            grant_type: 'authorization_code',
            client_id: clientId,
            code: code as string,
            redirect_uri: redirectUri,
        };

        const formBody = Object.keys(details)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key]))
            .join('&');

        const headers: Record<string, string> = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        if (clientSecret) {
            const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
            headers['Authorization'] = `Basic ${auth}`;
            console.log('[/api/auth/callback] Using Basic Auth with client secret');
        } else {
            console.log('[/api/auth/callback] No client secret - using public client flow');
        }

        console.log('[/api/auth/callback] Sending token request...');
        
        const tokenRes = await fetch(`https://${domain}/oauth2/token`, {
            method: 'POST',
            headers,
            body: formBody,
        });

        console.log('[/api/auth/callback] Token response received:', {
            status: tokenRes.status,
            statusText: tokenRes.statusText,
            ok: tokenRes.ok,
        });

        let data;
        try {
            data = await tokenRes.json();
        } catch (parseError) {
            console.error('[/api/auth/callback] Failed to parse response as JSON:', parseError);
            const text = await tokenRes.text();
            console.error('[/api/auth/callback] Response text:', text);
            return res.redirect(`/login?error=${encodeURIComponent('invalid_response')}`);
        }

        if (!tokenRes.ok) {
            console.error('[/api/auth/callback] Token exchange failed:', {
                status: tokenRes.status,
                error: data.error,
                error_description: data.error_description,
                fullResponse: data,
            });
            return res.redirect(`/login?error=${encodeURIComponent(data.error || 'token_exchange_failed')}&details=${encodeURIComponent(data.error_description || '')}`);
        }

        console.log('[/api/auth/callback] Token exchange successful, redirecting to dashboard');

        // We can't set localStorage from a server-side redirect.
        // Instead, we'll pass the tokens in the URL or a temporary session cookie.
        // For simplicity in this demo, we'll pass the access token in a query param
        // and have a small script on the dashboard page store it.
        // NOTE: In production, use HttpOnly cookies for better security.

        return res.redirect(`/dashboard?token=${data.access_token}&user=google_user`);
    } catch (err) {
        console.error('[/api/auth/callback] Unexpected error:', err);
        console.error('[/api/auth/callback] Error details:', {
            name: err instanceof Error ? err.name : 'Unknown',
            message: err instanceof Error ? err.message : String(err),
            stack: err instanceof Error ? err.stack : undefined,
        });
        
        // Return more specific error information
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        return res.redirect(`/login?error=internal_server_error&details=${encodeURIComponent(errorMessage)}`);
    }
}
