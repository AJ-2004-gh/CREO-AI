import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header to verify user is logged in
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the audio blob from request
    const body = await request.json();
    const { audio_base64, language } = body;

    if (!audio_base64) {
      return NextResponse.json(
        { error: 'No audio data provided' },
        { status: 400 }
      );
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audio_base64, 'base64');

    // Map language names to Deepgram language codes
    const languageCodeMap: Record<string, string> = {
      'English':   'en',
      'Hindi':     'hi',
      'Bengali':   'bn',
      'Telugu':    'te',
      'Malayalam': 'ml',
      'Tamil':     'ta',
      'Marathi':   'mr',
      'Gujarati':  'gu',
      'Kannada':   'kn',
      'Punjabi':   'pa',
    };

    // nova-2 supports these languages; everything else falls back to whisper-large which is multilingual
    const nova2Supported = new Set(['en', 'hi', 'bn', 'te', 'ml']);

    const languageCode = languageCodeMap[language] || 'en';
    const model = nova2Supported.has(languageCode) ? 'nova-2' : 'whisper-large';

    const params = new URLSearchParams({
      model,
      language: languageCode,
      smart_format: 'true',
    });

    // Call Deepgram REST API directly
    const response = await fetch(`https://api.deepgram.com/v1/listen?${params}`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
        'Content-Type': 'audio/wav',
      },
      body: audioBuffer,
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => response.statusText);
      console.error('Deepgram error response:', errBody);
      throw new Error(`Deepgram API error: ${response.status} — ${errBody}`);
    }

    const data = await response.json();

    // Extract the transcript
    const transcript = data.results?.channels[0]?.alternatives[0]?.transcript || '';

    return NextResponse.json({ transcript });
  } catch (error) {
    console.error('Transcription error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Transcription failed';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
