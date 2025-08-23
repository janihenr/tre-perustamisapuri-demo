"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Download, Edit, MessageSquare, FileText, User, Bot } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Load profile data
    const savedProfile = localStorage.getItem('perustamisapuri-profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    // Load chat history
    const savedMessages = localStorage.getItem('perustamisapuri-messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages).map((msg: { id: string; content: string; role: 'user' | 'assistant'; timestamp: string }) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    }
  }, []);

  const handleExportPDF = () => {
    // In a real app, this would generate and download a PDF
    alert("PDF-lataus tulossa - tämä on demo-versio");
  };

  if (!profile) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Profiilia ei löytynyt</h1>
          <p className="text-muted-foreground mt-2">
            Siirry ensin sisäänkirjautumissivulle
          </p>
          <Button asChild className="mt-4">
            <Link href="/">Takaisin etusivulle</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8 bg-background/80 backdrop-blur-sm rounded-lg my-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Yrittäjäprofiili</h1>
          <p className="text-muted-foreground">
            Tarkastele ja hallinnoi yrittäjätietojasi
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Lataa PDF
          </Button>
          <Button variant="outline" asChild>
            <Link href="/onboarding">
              <Edit className="h-4 w-4 mr-2" />
              Muokkaa
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Yleiskatsaus</TabsTrigger>
          <TabsTrigger value="business">Liikeidea</TabsTrigger>
          <TabsTrigger value="chat">Keskustelut</TabsTrigger>
          <TabsTrigger value="documents">Dokumentit</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Perustiedot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nimi</label>
                  <p className="text-lg">{String((profile as any)?.name || '')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Sähköposti</label>
                  <p>{String((profile as any)?.email || '')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Kunta</label>
                  <p>{String((profile as any)?.municipality || '')}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aktiviteetti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Keskusteluviestejä</span>
                  <Badge variant="secondary">{messages.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Viimeisin aktiviteetti</span>
                  <span className="text-sm">
                    {messages.length > 0 
                      ? messages[messages.length - 1].timestamp.toLocaleDateString('fi-FI')
                      : 'Ei aktiviteettia'
                    }
                  </span>
                </div>
                <Separator />
                <Button asChild className="w-full">
                  <Link href="/chat">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Jatka keskustelua
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Liikeidea</CardTitle>
              <CardDescription>
                Liikeideasi ja suunnitelmasi yhteenveto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Liikeidea</label>
                <p className="mt-1 whitespace-pre-wrap">{String((profile as any)?.businessIdea || '')}</p>
              </div>
              
              {(profile as any)?.experience && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tausta ja osaaminen</label>
                  <p className="mt-1 whitespace-pre-wrap">{String((profile as any)?.experience || '')}</p>
                </div>
              )}

              {(profile as any)?.goals && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tavoitteet</label>
                  <p className="mt-1 whitespace-pre-wrap">{String((profile as any)?.goals || '')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Keskusteluhistoria</CardTitle>
              <CardDescription>
                Kaikki keskustelusi Perustamisapurin kanssa
              </CardDescription>
            </CardHeader>
            <CardContent>
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Ei keskusteluja vielä</p>
                  <Button asChild className="mt-4">
                    <Link href="/chat">Aloita keskustelu</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {messages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {message.role === "user" ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {message.role === "user" ? "Sinä" : "Perustamisapuri"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp.toLocaleString('fi-FI')}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content.length > 200 
                            ? `${message.content.substring(0, 200)}...`
                            : message.content
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Dokumentit
              </CardTitle>
              <CardDescription>
                Lataa ja hallinnoi yrittäjyyteen liittyviä dokumentteja
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Ei dokumentteja vielä</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Demo-versiossa dokumenttien lataus ei ole käytössä
                </p>
                <Button variant="outline" className="mt-4" onClick={handleExportPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Lataa profiili PDF:nä
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
