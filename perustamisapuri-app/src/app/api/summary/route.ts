import { NextRequest, NextResponse } from 'next/server';
import { summarizeConversation, ChatMessage } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, profile } = body;

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Viestit ovat pakollisia yhteenvedon luomiseksi.' },
        { status: 400 }
      );
    }

    // Convert messages to the format expected by OpenAI
    const chatMessages: ChatMessage[] = messages
      .filter((msg: { role: string }) => msg.role === 'user' || msg.role === 'assistant')
      .map((msg: { role: 'user' | 'assistant'; content: string }) => ({
        role: msg.role,
        content: msg.content
      }));

    if (chatMessages.length === 0) {
      return NextResponse.json(
        { error: 'Ei tarpeeksi keskustelua yhteenvedon luomiseksi.' },
        { status: 400 }
      );
    }

    // Generate summary using OpenAI
    const summary = await summarizeConversation(chatMessages, profile);

    return NextResponse.json({
      summary,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Summary API error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'OpenAI API-avain puuttuu. Tarkista ympäristömuuttujat.' },
          { status: 500 }
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
