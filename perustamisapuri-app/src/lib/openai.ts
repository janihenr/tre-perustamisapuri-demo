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
- Kysy lisäkysymyksiä yksi kerrallaan seuraavista aiheista:
  1. Liikeidea ja toimiala
  2. Tausta ja osaaminen
  3. Rahoitustarve
  4. Luvat ja säädökset
  5. Verotus ja kirjanpito
  6. Markkinointi ja myynti
  7. Riskit ja haasteet

- Kun olet tyytyväinen vastaukseen johonkin aiheeseen, ehdota ystävällisesti seuraavaa aihetta
- Anna käytännöllisiä neuvoja Tampereen ja Suomen kontekstissa
- Viittaa relevantteihin viranomaislähteisiin (PRH, Verohallinto, TE-palvelut)
- Jos et tiedä jotain, ole rehellinen ja ohjaa oikeisiin lähteisiin

KESKUSTELUN RAKENNE:
- Aloita ystävällisesti ja viittaa käyttäjän antamiin tietoihin
- Kysy yksi selkeä kysymys kerrallaan
- Kuuntele vastaus ja anna palautetta
- Siirry seuraavaan aiheeseen kun olet saanut riittävästi tietoa
- Tee yhteenvetoja säännöllisesti
- Käytä käyttäjän profiilitietoja antaaksesi räätälöityjä neuvoja`;

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
