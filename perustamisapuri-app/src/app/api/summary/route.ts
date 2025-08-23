import { NextRequest, NextResponse } from 'next/server';
import { summarizeConversation, ChatMessage, UserProfile } from '@/lib/openai';

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

    const body = await request.json();
    const { messages, profile } = body;

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Viestit ovat pakollisia yhteenvedon luomiseen.' },
        { status: 400 }
      );
    }

    if (messages.length < 2) {
      return NextResponse.json(
        { error: 'Keskustelu on liian lyhyt yhteenvedon luomiseen.' },
        { status: 400 }
      );
    }

    // Convert messages to the format expected by OpenAI
    const chatMessages: ChatMessage[] = messages
      .filter((msg: any) => msg.role === 'user' || msg.role === 'assistant')
      .map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }));

    // Generate summary using OpenAI
    const summary = await summarizeConversation(chatMessages, profile as UserProfile);

    return NextResponse.json({
      summary: summary,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Summary API error:', error);
    
    // Check if it's an OpenAI API error
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'OpenAI API-avain puuttuu. Tarkista ympäristömuuttujat.' },
          { status: 500 }
        );
      }
      
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'API-rajat ylittyneet. Yritä hetken kuluttua uudelleen.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Virhe yhteenvedon luomisessa. Yritä uudelleen.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Summary API toimii - käytä POST-pyyntöä yhteenvedon luomiseen' });
}