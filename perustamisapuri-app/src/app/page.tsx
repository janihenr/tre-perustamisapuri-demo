"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { validateSecretKey, setAuthCookie, isAuthenticated } from "@/lib/auth";

export default function Home() {
  const [signinKey, setSigninKey] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      const redirectTo = searchParams.get('redirect') || '/onboarding';
      router.push(redirectTo);
    }
  }, [router, searchParams]);

  const handleSigninKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSecretKey(signinKey)) {
      // Set authentication cookie
      setAuthCookie();
      
      // Redirect to intended page or onboarding
      const redirectTo = searchParams.get('redirect') || '/onboarding';
      router.push(redirectTo);
    } else {
      // Show error modal and reset the input
      setShowErrorModal(true);
      setSigninKey("");
    }
  };
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-3.5rem)] py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Tervetuloa Perustamisapuriin
          </h1>
          <p className="mt-2 text-muted-foreground">
            Digitaalinen avustaja yrittäjyydelle Tampereella
          </p>
          {searchParams.get('redirect') && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                🔒 Kirjaudu sisään päästäksesi sovellukseen
              </p>
            </div>
          )}
          <Badge variant="secondary" className="mt-4">
            Demo-versio
          </Badge>
        </div>

        <Card className="border-2 shadow-lg bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Kirjaudu sisään</CardTitle>
            <CardDescription className="text-center">
              Käytä sisäänkirjautumisavainta päästäksesi palveluun
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button disabled className="w-full" size="lg">
              Kirjaudu sisään Suomi.fi (ei käytössä)
            </Button>
            
            {/* Signin Key Input */}
            <div className="space-y-2">
              <form onSubmit={handleSigninKeySubmit} className="space-y-2">
                <Input
                  type="text"
                  placeholder="Syötä sisäänkirjautumisavain..."
                  value={signinKey}
                  onChange={(e) => setSigninKey(e.target.value)}
                  className="w-full"
                />
                <Button type="submit" variant="outline" className="w-full" size="sm">
                  Kirjaudu sisään avaimella
                </Button>
              </form>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Demo-versio - ei vaadi oikeita tunnuksia
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground bg-background/80 backdrop-blur-sm rounded-lg p-4">
          <p>
            Perustamisapuri auttaa sinua yrityksen perustamisessa ja 
            yrittäjyyden alkutaipaleella Tampereella.
          </p>
        </div>
      </div>

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Virheellinen avain
            </DialogTitle>
            <DialogDescription>
              Syöttämäsi sisäänkirjautumisavain ei ole oikein. Tarkista avain ja yritä uudelleen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              onClick={() => setShowErrorModal(false)}
              className="w-full"
            >
              Yritä uudelleen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
