import { NextRequest, NextResponse } from 'next/server';
import { generateBusinessIdea } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_openai_api_key_here') {
      return NextResponse.json(
        { 
          error: 'OpenAI API-avain puuttuu tai on virheellinen. Tarkista että .env tai .env.local tiedostossa on oikea API-avain.',
          needsApiKey: true,
          debug: `API key status: ${apiKey ? 'exists but invalid' : 'missing'}`
        },
        { status: 503 }
      );
    }

    // Generate the business idea
    const generatedProfile = await generateBusinessIdea();

    return NextResponse.json({
      success: true,
      data: generatedProfile
    });

  } catch (error) {
    console.error('Business idea generation error:', error);
    
    // Return a user-friendly error message
    const errorMessage = error instanceof Error ? error.message : 'Tuntematon virhe';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        success: false
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Vain POST-pyynnöt sallittu' },
    { status: 405 }
  );
}
