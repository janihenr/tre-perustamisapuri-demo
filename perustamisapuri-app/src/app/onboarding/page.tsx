"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function OnboardingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    municipality: "",
    businessIdea: "",
    experience: "",
    goals: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to database
    localStorage.setItem('perustamisapuri-profile', JSON.stringify(formData));
    window.location.href = '/chat';
  };

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Takaisin
          </Link>
        </Button>
      </div>

      <div className="space-y-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">
            Vaihe 1/1
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">
            Kerro itsestäsi
          </h1>
          <p className="mt-2 text-muted-foreground">
            Näiden tietojen avulla Perustamisapuri voi auttaa sinua paremmin
          </p>
        </div>

        <Card className="border-2 shadow-lg bg-card/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Perustiedot</CardTitle>
            <CardDescription>
              Anna perustiedot yrittäjäprofiiliasi varten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nimi *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Etunimi Sukunimi"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Sähköposti *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="etunimi.sukunimi@esimerkki.fi"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="municipality" className="text-sm font-medium">
                  Kunta *
                </label>
                <Select value={formData.municipality} onValueChange={(value) => setFormData({...formData, municipality: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Valitse kunta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="akaa">Akaa</SelectItem>
                    <SelectItem value="hämeenkyrö">Hämeenkyrö</SelectItem>
                    <SelectItem value="ikaalinen">Ikaalinen</SelectItem>
                    <SelectItem value="juupajoki">Juupajoki</SelectItem>
                    <SelectItem value="kangasala">Kangasala</SelectItem>
                    <SelectItem value="kihniö">Kihniö</SelectItem>
                    <SelectItem value="kuhmoinen">Kuhmoinen</SelectItem>
                    <SelectItem value="lempäälä">Lempäälä</SelectItem>
                    <SelectItem value="mänttä-vilppula">Mänttä-Vilppula</SelectItem>
                    <SelectItem value="nokia">Nokia</SelectItem>
                    <SelectItem value="orivesi">Orivesi</SelectItem>
                    <SelectItem value="parkano">Parkano</SelectItem>
                    <SelectItem value="pirkkala">Pirkkala</SelectItem>
                    <SelectItem value="punkalaidun">Punkalaidun</SelectItem>
                    <SelectItem value="pälkäne">Pälkäne</SelectItem>
                    <SelectItem value="ruovesi">Ruovesi</SelectItem>
                    <SelectItem value="sastamala">Sastamala</SelectItem>
                    <SelectItem value="tampere">Tampere</SelectItem>
                    <SelectItem value="urjala">Urjala</SelectItem>
                    <SelectItem value="valkeakoski">Valkeakoski</SelectItem>
                    <SelectItem value="vesilahti">Vesilahti</SelectItem>
                    <SelectItem value="virrat">Virrat</SelectItem>
                    <SelectItem value="ylöjärvi">Ylöjärvi</SelectItem>
                    <SelectItem value="muu">Muu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="businessIdea" className="text-sm font-medium">
                  Liikeidea *
                </label>
                <Textarea
                  id="businessIdea"
                  placeholder="Kuvaile lyhyesti liikeideaasi ja mitä aiot tehdä..."
                  value={formData.businessIdea}
                  onChange={(e) => setFormData({...formData, businessIdea: e.target.value})}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="experience" className="text-sm font-medium">
                  Tausta ja osaaminen
                </label>
                <Textarea
                  id="experience"
                  placeholder="Kerro taustastasi, osaamisestasi ja kokemuksestasi..."
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="goals" className="text-sm font-medium">
                  Tavoitteet
                </label>
                <Textarea
                  id="goals"
                  placeholder="Mitä haluat saavuttaa yrittäjänä? Millaiset ovat tavoitteesi?"
                  value={formData.goals}
                  onChange={(e) => setFormData({...formData, goals: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" asChild>
                  <Link href="/">
                    Peruuta
                  </Link>
                </Button>
                <Button type="submit" className="flex items-center gap-2">
                  Jatka keskusteluun
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
