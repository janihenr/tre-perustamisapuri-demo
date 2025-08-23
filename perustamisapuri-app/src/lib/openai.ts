import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface UserProfile {
  name?: string;
  email?: string;
  municipality?: string;
  businessIdea?: string;
  experience?: string;
  goals?: string;
}

// System prompt for Perustamisapuri - Finnish entrepreneurship assistant
const createSystemPrompt = (profile?: UserProfile) => {
  const basePrompt = `Olet Perustamisapuri, ystävällinen ja ammattimainen AI-assistentti, joka auttaa yrittäjyydessä Tampereella. Sinun tehtäväsi on opastaa ihmisiä yrityksen perustamisessa ja yrittäjyydessä.

TÄRKEÄT OHJEET:
- Puhu aina suomea
- Ole ystävällinen mutta ammattimainen
- Osoita empatiaa, mutta älä ole liian kohtelias
- Analysoi käyttäjän antamia tietoja ja anna henkilökohtaisia neuvoja
- PIDÄ KESKUSTELU AINA LIIKETOIMINTA-AIHEISSA - älä auta muissa aiheissa
- Kysy lisäkysymyksiä yksi kerrallaan seuraavista aiheista:
  1. Liikeidea ja toimiala
  2. Tausta ja osaaminen
  3. Rahoitustarve
  4. Luvat ja säädökset
  5. Verotus ja kirjanpito
  6. Markkinointi ja myynti
  7. Riskit ja haasteet

AIHEESSA PYSYMINEN:
- Jos käyttäjä kysyy liiketoimintaan liittymättömiä asioita (esim. sää, urheilu, politiikka, henkilökohtaiset ongelmat), ÄLÄ vastaa niihin
- Ohjaa keskustelu takaisin yrittäjyysaiheisiin ystävällisesti mutta päättäväisesti
- Sano esimerkiksi: "Ymmärrän kiinnostuksesi, mutta olen erikoistunut auttamaan yrittäjyysasioissa. Palataan liikeideaasi - kerrotko lisää..."
- Hyväksy vain liiketoimintaan, yrittäjyyteen, yrityksen perustamiseen tai markkinointiin liittyvät kysymykset

KESKUSTELUN RAKENNE:
- Aloita ystävällisesti ja viittaa käyttäjän antamiin tietoihin
- Kysy yksi selkeä kysymys kerrallaan
- Kuuntele vastaus ja anna palautetta
- Siirry seuraavaan aiheeseen kun olet saanut riittävästi tietoa
- Tee yhteenvetoja säännöllisesti
- Käytä käyttäjän profiilitietoja antaaksesi räätälöityjä neuvoja
- Anna käytännöllisiä neuvoja Tampereen ja Suomen kontekstissa
- Viittaa relevantteihin viranomaislähteisiin (PRH, Verohallinto, TE-palvelut)
- Jos et tiedä jotain liiketoiminta-asiaa, ole rehellinen ja ohjaa oikeisiin lähteisiin`;

  // Add detailed user profile information if available
  if (profile && Object.keys(profile).some(key => profile[key as keyof UserProfile])) {
    let profileInfo = '\n\n=== KÄYTTÄJÄN PROFIILITIEDOT ===\n';
    
    if (profile.name) {
      profileInfo += `NIMI: ${profile.name}\n`;
    }
    
    if (profile.email) {
      profileInfo += `SÄHKÖPOSTI: ${profile.email}\n`;
    }
    
    if (profile.municipality) {
      profileInfo += `KUNTA: ${profile.municipality}\n`;
      profileInfo += `HUOM: Anna paikallisia neuvoja ${profile.municipality === 'tampere' ? 'Tampereelle' : `${profile.municipality}lle`}\n`;
    }
    
    if (profile.businessIdea) {
      profileInfo += `LIIKEIDEA: ${profile.businessIdea}\n`;
      profileInfo += `ANALYYSI: Analysoi tämä liikeidea ja anna spesifisiä neuvoja tälle toimialalle\n`;
    }
    
    if (profile.experience) {
      profileInfo += `TAUSTA JA OSAAMINEN: ${profile.experience}\n`;
      profileInfo += `ANALYYSI: Hyödynnä tätä taustaa neuvojen antamisessa\n`;
    }
    
    if (profile.goals) {
      profileInfo += `TAVOITTEET: ${profile.goals}\n`;
      profileInfo += `ANALYYSI: Keskity auttamaan näiden tavoitteiden saavuttamisessa\n`;
    }
    
    profileInfo += '\n=== OHJE: Käytä näitä tietoja antaaksesi henkilökohtaisia ja relevantteja neuvoja ===\n';
    
    return basePrompt + profileInfo;
  }

  return basePrompt;
};

export async function generateChatResponse(
  messages: ChatMessage[],
  profile?: UserProfile
): Promise<string> {
  try {
    const systemPrompt = createSystemPrompt(profile);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-10), // Keep last 10 messages for context
      ],
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    return completion.choices[0]?.message?.content || 'Anteeksi, en pystynyt muodostamaan vastausta. Voitko yrittää uudelleen?';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Virhe AI-palvelussa. Yritä hetken kuluttua uudelleen.');
  }
}

export async function generateChatResponseStream(
  messages: ChatMessage[],
  profile?: UserProfile
) {
  try {
    const systemPrompt = createSystemPrompt(profile);
    
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-10), // Keep last 10 messages for context
      ],
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
      stream: true,
    });

    return stream;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Virhe AI-palvelussa. Yritä hetken kuluttua uudelleen.');
  }
}

export async function summarizeConversation(
  messages: ChatMessage[],
  _profile?: UserProfile
): Promise<string> {
  try {
    const summaryPrompt = `Tee lyhyt yhteenveto tästä yrittäjyyskeskustelusta. Korosta tärkeimmät päätökset ja suunnitelmat. Kirjoita suomeksi ja käytä selkeää rakennetta:

1. Liikeidea
2. Tärkeimmät päätökset
3. Seuraavat askeleet
4. Avoimet kysymykset

Keskustelu:
${messages.map(m => `${m.role === 'user' ? 'Käyttäjä' : 'Apuri'}: ${m.content}`).join('\n\n')}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: summaryPrompt }],
      max_tokens: 300,
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content || 'Yhteenvetoa ei voitu luoda.';
  } catch (error) {
    console.error('OpenAI summarization error:', error);
    throw new Error('Virhe yhteenvedon luomisessa.');
  }
}

export interface GeneratedBusinessProfile {
  name: string;
  email: string;
  municipality: string;
  businessIdea: string;
  experience: string;
  goals: string;
}

export async function generateBusinessIdea(): Promise<GeneratedBusinessProfile> {
  try {
    // Define industries to choose from
    const industries = [
      'teknologia ja ohjelmistokehitys',
      'kestävä kehitys ja ympäristöteknologia',
      'terveys- ja hyvinvointipalvelut',
      'koulutus ja konsultointi',
      'luova ala ja sisällöntuotanto',
      'ruoka ja ravintola-ala',
      'liikunta ja urheilu',
      'matkailu ja elämyspalvelut',
      'kiertotalous ja kierrätys',
      'digitaalinen markkinointi',
      'senioripalvelut',
      'lasten ja perheiden palvelut',
      'kauneus ja hyvinvointi',
      'käsityö ja design',
      'logistiikka ja kuljetus'
    ];

    // Finnish names to choose from
    const finnishNames = [
      'Aino Virtanen', 'Eero Laakso', 'Helmi Koskinen', 'Väinö Nieminen', 'Siiri Mäkinen',
      'Onni Hakala', 'Aada Järvinen', 'Eino Saarinen', 'Lempi Rantanen', 'Toivo Heikkinen',
      'Elsa Korhonen', 'Arvo Laine', 'Inkeri Mattila', 'Paavo Tuominen', 'Sylvi Lehtonen',
      'Urho Kivinen', 'Aili Ahonen', 'Veikko Karjalainen', 'Helvi Hämäläinen', 'Martti Ojala',
      'Tyyne Kallio', 'Eemeli Peltonen', 'Hilja Lindström', 'Aleksi Vanhanen', 'Lempi Salonen'
    ];

    // Municipalities from the dropdown
    const municipalities = [
      'akaa', 'hämeenkyrö', 'ikaalinen', 'juupajoki', 'kangasala', 'kihniö', 'kuhmoinen',
      'lempäälä', 'mänttä-vilppula', 'nokia', 'orivesi', 'parkano', 'pirkkala', 'punkalaidun',
      'pälkäne', 'ruovesi', 'sastamala', 'tampere', 'urjala', 'valkeakoski', 'vesilahti',
      'virrat', 'ylöjärvi'
    ];

    // Random selections
    const selectedIndustry = industries[Math.floor(Math.random() * industries.length)];
    const selectedName = finnishNames[Math.floor(Math.random() * finnishNames.length)];
    const selectedMunicipality = municipalities[Math.floor(Math.random() * municipalities.length)];
    
    // Generate email from name
    const emailName = selectedName.toLowerCase()
      .replace(/ä/g, 'a')
      .replace(/ö/g, 'o')
      .replace(/å/g, 'a')
      .replace(/\s+/g, '.');
    const email = `${emailName}@aigeneratedmail.fi`;

    const prompt = `Sinä olet yrittäjyysasiantuntija. Luo kolme erilaista liikeideaa toimialalle "${selectedIndustry}". 

Jokaisen liikeidean tulee olla:
- Realistinen ja toteutettavissa Suomessa
- Innovatiivinen mutta käytännöllinen
- Sopiva pk-yritykselle

Anna jokaiselle idealle lyhyt kuvaus (1-2 lausetta) ja arvioi liiketoimintapotentiaali asteikolla 1-10.

Muoto:
IDEA 1: [kuvaus] - Potentiaali: X/10
IDEA 2: [kuvaus] - Potentiaali: X/10  
IDEA 3: [kuvaus] - Potentiaali: X/10

Valitse sitten paras idea ja luo sille:

VALITTU IDEA: [idean nimi]

LIIKEIDEA (max 300 sanaa):
[Yksityiskohtainen kuvaus liikeideasta, markkinasta, ratkaisusta ja kilpailueduista]

TAUSTA JA OSAAMINEN (max 300 sanaa):
[Kuvaus siitä millaista taustaa ja osaamista tämä liikeidea vaatii, mukaan lukien tiimi ja kumppanuudet]

TAVOITTEET (max 300 sanaa):
[Lyhyen ja pitkän aikavälin tavoitteet, kasvusuunnitelma ja menestyksen mittarit]

Kirjoita kaikki suomeksi ja ole konkreettinen.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.8,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    // Function to clean text from markdown and unwanted formatting
    const cleanText = (text: string): string => {
      return text
        // Remove markdown headers (###, ####, etc.)
        .replace(/^#{1,6}\s+/gm, '')
        // Remove markdown bold/italic markers
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/__([^_]+)__/g, '$1')
        .replace(/_([^_]+)_/g, '$1')
        // Remove markdown links but keep the text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        // Remove markdown code blocks
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`([^`]+)`/g, '$1')
        // Remove bullet points and list markers
        .replace(/^\s*[-*+]\s+/gm, '')
        .replace(/^\s*\d+\.\s+/gm, '')
        // Remove extra whitespace and normalize line breaks
        .replace(/\n{3,}/g, '\n\n')
        .replace(/^\s+|\s+$/g, '')
        .trim();
    };
    
    // Parse the response to extract the sections
    const liikeideaMatch = response.match(/LIIKEIDEA[^:]*:\s*([\s\S]*?)(?=TAUSTA JA OSAAMINEN|$)/i);
    const taustaMatch = response.match(/TAUSTA JA OSAAMINEN[^:]*:\s*([\s\S]*?)(?=TAVOITTEET|$)/i);
    const tavoitteetMatch = response.match(/TAVOITTEET[^:]*:\s*([\s\S]*?)$/i);

    const businessIdea = cleanText(liikeideaMatch?.[1] || 'AI-generoitu liikeidea ei ole saatavilla.');
    const experience = cleanText(taustaMatch?.[1] || 'Tausta ja osaaminen ei ole saatavilla.');
    const goals = cleanText(tavoitteetMatch?.[1] || 'Tavoitteet eivät ole saatavilla.');

    return {
      name: selectedName,
      email: email,
      municipality: selectedMunicipality,
      businessIdea: businessIdea,
      experience: experience,
      goals: goals
    };

  } catch (error) {
    console.error('OpenAI business idea generation error:', error);
    throw new Error('Virhe liikeideaa generoitaessa. Yritä hetken kuluttua uudelleen.');
  }
}