"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, User, Bot, Trash2, RotateCcw } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load profile data
    const savedProfile = localStorage.getItem('perustamisapuri-profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    // Load chat history
    const savedMessages = localStorage.getItem('perustamisapuri-messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    } else {
      // Welcome message
      const welcomeMessage: Message = {
        id: "welcome",
        content: profile?.name 
          ? `Tervetuloa takaisin, ${profile.name}! 

${profile.businessIdea ? `Muistan että suunnittelet: "${profile.businessIdea}"` : ''}
${profile.municipality && profile.municipality !== 'tampere' ? `Ja että asut ${profile.municipality}ssa.` : ''}
${profile.goals ? `Tavoitteenasi on: ${profile.goals}` : ''}

Jatketaan yrittäjyysmatkaasi! Mistä aiheesta haluaisit keskustella tänään? Voin auttaa esimerkiksi:
• Liiketoimintasuunnitelman kehittämisessä
• Lupien ja säädösten selvittämisessä  
• Rahoitusvaihtoehtojen kartoittamisessa
• Markkinoinnin suunnittelussa`
          : `Tervetuloa Perustamisapuriin! Olen täällä auttamassa sinua yrittäjyyden alkutaipaleella Tampereella. 

Aloitetaan tutustumalla sinuun ja liikeideasiisi. Kerro ensiksi: **Mikä on nimesi ja millaista yritystä suunnittelet?**`,
        role: "assistant",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('perustamisapuri-messages', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    // Create placeholder message for streaming
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      content: "",
      role: "assistant",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, assistantMessage]);
    setStreamingMessageId(assistantMessageId);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          profile: profile,
          history: messages,
          stream: true
        }),
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  setStreamingMessageId(null);
                  setIsLoading(false);
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    accumulatedContent += parsed.content;
                    setMessages(prev => prev.map(msg => 
                      msg.id === assistantMessageId 
                        ? { ...msg, content: accumulatedContent }
                        : msg
                    ));
                  }
                } catch (parseError) {
                  // Ignore parsing errors for partial chunks
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      } else {
        // Handle non-streaming response or errors
        const data = await response.json();
        
        if (response.ok) {
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: data.message }
              : msg
          ));
        } else {
          // Handle API errors
          setError(data.error || 'Virhe keskustelussa');
          
          let errorContent = `Anteeksi, tapahtui virhe: ${data.error || 'Tuntematon virhe'}`;
          
          // Special handling for API key errors
          if (data.needsApiKey) {
            errorContent = `🔑 **OpenAI API-avain puuttuu**

Jotta voin vastata kysymyksiisi, tarvitsen OpenAI API-avaimen:

1. **Hanki API-avain**: Mene osoitteeseen https://platform.openai.com/api-keys
2. **Luo avain**: Kirjaudu sisään ja luo uusi "secret key"
3. **Lisää avain**: Luo tiedosto \`.env.local\` projektin juureen sisältöön:
   \`\`\`
   OPENAI_API_KEY=your_actual_api_key_here
   \`\`\`
4. **Käynnistä uudelleen**: Sammuta ja käynnistä palvelin uudelleen

Kun avain on lisätty, voin auttaa sinua yrittäjyyden kysymyksissä! 🚀`;
          }
          
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: errorContent }
              : msg
          ));
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setError('Yhteysongelma palvelimeen');
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, content: "Anteeksi, yhteys palvelimeen epäonnistui. Tarkista internet-yhteytesi ja yritä uudelleen." }
          : msg
      ));
    }

    setStreamingMessageId(null);
    setIsLoading(false);
  };

  const clearSession = () => {
    if (confirm('Haluatko varmasti tyhjentää kaikki keskustelut ja profiilitiedot? Tätä toimintoa ei voi peruuttaa.')) {
      localStorage.removeItem('perustamisapuri-messages');
      localStorage.removeItem('perustamisapuri-profile');
      setMessages([]);
      setProfile(null);
      
      // Add a fresh welcome message
      const welcomeMessage: Message = {
        id: "welcome-fresh",
        content: `Istunto on tyhjennetty! Tervetuloa takaisin Perustamisapuriin! 

Aloitetaan alusta. Kerro ensiksi: **Mikä on nimesi ja millaista yritystä suunnittelet?**`,
        role: "assistant",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  };

  const restartChat = () => {
    if (confirm('Haluatko aloittaa uuden keskustelun? Nykyiset viestit poistetaan, mutta profiilitietosi säilyvät.')) {
      // Clear only messages, keep profile
      localStorage.removeItem('perustamisapuri-messages');
      setMessages([]);
      
             // Add a fresh welcome message with profile context
       const welcomeMessage: Message = {
         id: "restart-welcome",
                 content: (profile as any)?.name 
          ? `Hei ${(profile as any).name}! Aloitetaan uusi keskustelu. 

${(profile as any)?.businessIdea ? `Liikeideasi: "${(profile as any).businessIdea}"` : ''}
${(profile as any)?.experience ? `Taustasi: ${String((profile as any).experience).substring(0, 100)}${String((profile as any).experience).length > 100 ? '...' : ''}` : ''}

Mistä aiheesta haluaisit keskustella tänään? Voin analysoida liikeideaasi syvemmin tai keskittyä johonkin tiettyyn osa-alueeseen.`
           : `Tervetuloa takaisin Perustamisapuriin! Aloitetaan uusi keskustelu. 

Mistä aiheesta haluaisit keskustella?`,
         role: "assistant",
         timestamp: new Date()
       };
      setMessages([welcomeMessage]);
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 border-r bg-background/90 backdrop-blur-sm flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Navigaatio</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/chat" className="block px-3 py-2 rounded-md bg-primary text-primary-foreground">
            Keskustelu
          </Link>
          <Link href="/profile" className="block px-3 py-2 rounded-md hover:bg-muted">
            Yrittäjäprofiili
          </Link>
        </nav>
        <div className="p-4 border-t space-y-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={restartChat}
            className="w-full flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Aloita uusi keskustelu
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={clearSession}
            className="w-full flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Tyhjennä istunto
          </Button>
          <div className="space-y-2">
            <Badge variant="secondary" className="w-full justify-center">
              Demo-versio
            </Badge>
            <Badge variant="outline" className="w-full justify-center text-xs">
              GPT-4o-mini
            </Badge>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-background/80 backdrop-blur-sm">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              <Card className={`max-w-[70%] ${
                message.role === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted"
              }`}>
                <CardContent className="p-3">
                  <p className="whitespace-pre-wrap">
                    {message.content}
                    {streamingMessageId === message.id && (
                      <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1 align-text-bottom">|</span>
                    )}
                  </p>
                  <p className={`text-xs mt-2 opacity-70`}>
                    {message.timestamp.toLocaleTimeString('fi-FI', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {streamingMessageId === message.id && (
                      <span className="ml-2 text-primary">Kirjoittaa...</span>
                    )}
                  </p>
                </CardContent>
              </Card>
              {message.role === "user" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="bg-muted">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="animate-pulse flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <p className="text-muted-foreground">Perustamisapuri miettii vastausta...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t p-4 bg-background/95 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Kysy mitä tahansa yrittäjyydestä..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            {error ? (
              <span className="text-red-500">⚠️ {error}</span>
            ) : (
              "Powered by OpenAI GPT-4o-mini • Stream-tuki • Demo-versio"
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
