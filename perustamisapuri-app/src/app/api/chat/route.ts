import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse, generateChatResponseStream, generatePreworkMessage, ChatMessage } from '@/lib/openai';

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
    const { message, profile, history, stream } = body;

    // Handle prework message generation
    if (message === 'GENERATE_PREWORK') {
      if (!profile) {
        return NextResponse.json(
          { error: 'Profiilitiedot puuttuvat prework-viestin luomiseen.' },
          { status: 400 }
        );
      }
      
      try {
        const preworkMessage = await generatePreworkMessage(profile);
        return NextResponse.json({
          message: preworkMessage,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Prework generation error:', error);
        return NextResponse.json(
          { error: 'Virhe prework-viestin luomisessa.' },
          { status: 500 }
        );
      }
    }

    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Viesti on pakollinen.' },
        { status: 400 }
      );
    }

    // Convert history to the format expected by OpenAI
    const chatMessages: ChatMessage[] = [];
    
    // Add recent history (last 8 messages to keep context manageable)
    if (history && Array.isArray(history)) {
      const recentHistory = history.slice(-8);
      for (const msg of recentHistory) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          chatMessages.push({
            role: msg.role,
            content: msg.content
          });
        }
      }
    }

    // Add the current user message
    chatMessages.push({
      role: 'user',
      content: message
    });

    // Check if streaming is requested
    if (stream) {
      // Generate streaming response using OpenAI
      const streamResponse = await generateChatResponseStream(chatMessages, profile);

      // Create a readable stream for the client
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of streamResponse) {
              const content = chunk.choices[0]?.delta?.content;
              if (content) {
                const data = `data: ${JSON.stringify({ content })}\n\n`;
                controller.enqueue(encoder.encode(data));
              }
            }
            // Send end signal
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          } catch (error) {
            console.error('Streaming error:', error);
            controller.error(error);
          }
        }
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Generate regular response using OpenAI
      const aiResponse = await generateChatResponse(chatMessages, profile);

      return NextResponse.json({
        message: aiResponse,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('Chat API error:', error);
    
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
      { error: 'Virhe keskustelussa. Yritä uudelleen.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Chat API toimii - käytä POST-pyyntöä keskusteluun' });
}
