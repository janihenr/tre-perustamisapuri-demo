"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Zap, Sparkles, LogOut } from "lucide-react";
import { clearAuthCookie } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";

export default function OnboardingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    municipality: "",
    businessIdea: "",
    experience: "",
    goals: ""
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  // Demo data constants
  const demoData = {
    name: "Matti Meikäläinen",
    email: "matti.meikalanen@gmmmmai.com",
    municipality: "lempäälä",
    businessIdea: `Liikeideamme perustuu tekoälyä hyödyntävän älykkään automaatiopalvelualustan kehittämiseen pk-yrityksille. Useat pk-sektorin toimijat kamppailevat yhä erilaisten manuaalisten prosessien kanssa: tiedon syöttö, asiakaspalvelun rutiinit, raportointi ja dokumenttien hallinta vievät huomattavan määrän työaikaa, mikä vähentää aikaa varsinaiselle liiketoiminnalle. Meidän ratkaisumme yhdistää nämä tarpeet yhteen selkeään alustaan, joka toimii pilvipohjaisesti ja on helppo ottaa käyttöön ilman syvää teknistä osaamista.

Palvelu hyödyntää uusinta luonnollisen kielen prosessointia (NLP) sekä RAG-mallinnusta, jolloin asiakkaan omat dokumentit, sopimukset ja ohjeistukset voidaan ottaa älykkään haun ja automaattisen sisällöntuotannon pohjaksi. Käytännössä tämä tarkoittaa, että yrityksen työntekijä voi kysyä alustalta kysymyksiä, kuten "Miten meillä raportoidaan matkakulut?" tai "Mitä velvoitteita GDPR tuo asiakastietojen käsittelyyn?", ja järjestelmä palauttaa täsmällisen vastauksen yrityksen sisäisiin käytäntöihin perustuen.

Liikeideamme keskeinen vahvuus on helppokäyttöisyys ja skaalautuvuus: asiakas maksaa vain tarvitsemistaan ominaisuuksista, ja palvelua voi laajentaa modulaarisesti. Tarjoamme valmiita integraatioita yleisimpiin järjestelmiin (esim. O365, Google Workspace, CRM-järjestelmät) sekä avoimen rajapinnan, jotta alusta voidaan liittää osaksi asiakkaan omaa ekosysteemiä.

Markkinassa on nähtävissä selkeä tarve kevyille mutta älykkäille automaatiotyökaluille, joiden kustannus on pk-yrityksille realistinen. Kansainvälinen kilpailu lisää painetta prosessien tehostamiseen, ja juuri tässä kohden meidän alustamme tuo ratkaisevan eron.`,
    experience: `Yrityksemme tausta perustuu monipuoliseen IT- ja konsultointiosaamiseen. Tiimimme koostuu neljästä perustajasta, joilla jokaisella on yli kymmenen vuoden kokemus ohjelmistokehityksestä, data-analytiikasta ja tekoälyn hyödyntämisestä liiketoiminnassa. Olemme työskennelleet niin julkisen sektorin kuin yksityisen teollisuuden digitalisaatiohankkeissa, ja olemme nähneet läheltä, miten paljon potentiaalia yrityksillä olisi hyödyntää dataansa tehokkaammin.

Yksi perustajista on erikoistunut pilviarkkitehtuureihin ja on sertifioitu Azure- ja AWS-ympäristöissä. Hänen osaamisensa mahdollistaa ratkaisumme turvallisen ja kustannustehokkaan toteutuksen pilvessä. Toisen perustajan vahvuus on koneoppimismallien rakentamisessa, erityisesti generatiivisen tekoälyn käytössä tiedonhakuun ja sisällöntuotantoon. Kolmannella perustajalla on taustaa käyttöliittymäsuunnittelussa ja saavutettavuusvaatimuksissa, mikä varmistaa, että tuotteemme on aidosti loppukäyttäjäystävällinen. Neljäs perustaja on työskennellyt pitkään liiketoiminnan kehityksessä ja ymmärtää syvällisesti pk-yritysten tarpeita.

Olemme myös rakentaneet verkoston kumppaneista, joihin kuuluu esimerkiksi paikallisia tilitoimistoja ja IT-palveluyrityksiä, jotka voivat tarjota meille asiakaskontakteja ja pilotointimahdollisuuksia. Tämän ansiosta pystymme validoimaan ideamme todellisissa käyttöympäristöissä jo varhaisessa vaiheessa.

Yhdistämällä teknisen osaamisen, liiketoimintaymmärryksen ja käytännön kokemuksen olemme ainutlaatuisessa asemassa kehittämään ratkaisun, joka on sekä teknisesti vahva että aidosti arvoa tuottava.`,
    goals: `Ensimmäisen toimintavuoden päätavoitteemme on pilotointien onnistunut läpivienti viiden pk-yrityksen kanssa. Tämä antaa meille arvokasta palautetta ja mahdollistaa tuotteen jatkokehityksen asiakaslähtöisesti. Tavoitteena on saada vähintään kaksi näistä piloteista maksaviksi asiakkaiksi, jolloin liiketoimintamalli validoituu.

Kolmen vuoden aikajänteellä tavoitteemme on saavuttaa 100 maksavaa asiakasta Suomessa. Tämä saavutetaan keskittymällä aluksi selkeisiin toimialoihin, kuten tilitoimistot, konsultointiyritykset ja luovan alan toimijat, joilla on paljon toistuvia dokumentaatio- ja raportointiprosesseja. Näillä markkinoilla ratkaisumme tuo suoraan mitattavaa hyötyä ajansäästön ja laadun paranemisen kautta.

Viiden vuoden aikajänteellä tavoitteemme on kansainvälistyminen Pohjoismaihin. Tähän mennessä alustan perustoiminnallisuudet ovat kypsiä, ja voimme tarjota myös monikielisen tuen. Samalla haluamme kasvattaa modulaarisuutta: asiakas voi valita tarvitsemansa palvelut (chatbot, raportointityökalu, sopimushaku, laskenta). Tämä mahdollistaa joustavan hinnoittelumallin, joka tukee erilaisia yrityskokoja.

Pitkällä aikavälillä tavoitteemme on asemoitua luotettavana tekoälyratkaisujen tarjoajana pk-yrityksille. Haluamme rakentaa maineen toimijana, joka tarjoaa selkeitä, helposti käyttöönotettavia ja kustannustehokkaita palveluja. Kasvun myötä tavoittelemme 20–30 hengen organisaatiota, jossa yhdistyvät vahva tuotekehitys ja asiakastuki.

Liiketoiminnan tavoitteet eivät rajoitu vain liikevaihtoon, vaan myös asiakasarvon tuottamiseen: jokainen käyttöönotto vähentää manuaalista työtä ja parantaa työntekijöiden tyytyväisyyttä. Tämä on linjassa myös kestävän kehityksen tavoitteiden kanssa, kun työskentely tehostuu ja resurssit kohdentuvat paremmin arvoa luovaan tekemiseen.`
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to database
    localStorage.setItem('perustamisapuri-profile', JSON.stringify(formData));
    
    // Clear any existing chat messages to start fresh
    localStorage.removeItem('perustamisapuri-messages');
    
    // Set a flag to indicate this is a fresh form submission
    localStorage.setItem('perustamisapuri-fresh-start', 'true');
    
    window.location.href = '/chat';
  };

  const handleDemoFill = () => {
    setFormData(demoData);
  };

  const handleAIBusinessIdea = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-business-idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success && result.data) {
        setFormData({
          name: result.data.name,
          email: result.data.email,
          municipality: result.data.municipality,
          businessIdea: result.data.businessIdea,
          experience: result.data.experience,
          goals: result.data.goals
        });
      } else {
        console.error('AI generation failed:', result.error);
        // Fallback to demo data if AI generation fails
        setFormData(demoData);
      }
    } catch (error) {
      console.error('Error generating business idea:', error);
      // Fallback to demo data if there's an error
      setFormData(demoData);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Haluatko varmasti kirjautua ulos? Sinut ohjataan takaisin sisäänkirjautumissivulle.')) {
      clearAuthCookie();
      router.push('/');
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
      <div className="container max-w-2xl mx-auto px-4 py-8 flex-1">
        <div className="mb-8 flex justify-between items-center">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Takaisin
            </Link>
          </Button>
          <Button variant="secondary" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Kirjaudu ulos
          </Button>
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Kerro liikeideastasi
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
            {/* Demo Buttons */}
            <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-muted-foreground/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-muted-foreground">Demo-toiminnot</span>
                <Badge variant="secondary" className="text-xs">
                  Testikäyttö
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleDemoFill}
                  className="flex-1 hover:bg-secondary/80"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Täytä demotiedoilla
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleAIBusinessIdea}
                  disabled={isGenerating}
                  className="flex-1 hover:bg-secondary/80"
                >
                  <Sparkles className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? 'Generoidaan...' : 'Generoi demo-liikeidea'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Nämä painikkeet täyttävät lomakkeen esimerkkitiedoilla.
              </p>
            </div>
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
       </div>
    </AuthGuard>
   );
 }
