import OpenAI from 'openai';
import { 
  createSystemPrompt, 
  createPreworkPrompt, 
  createSummaryPrompt, 
  createBusinessIdeaPrompt,
  AI_CONFIG 
} from '@/config/prompts';

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

// Note: System prompt creation is now handled in src/config/prompts.ts

export async function generateChatResponse(
  messages: ChatMessage[],
  profile?: UserProfile
): Promise<string> {
  try {
    const systemPrompt = createSystemPrompt(profile);
    
    const completion = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-10), // Keep last 10 messages for context
      ],
      max_tokens: AI_CONFIG.chat.maxTokens,
      temperature: AI_CONFIG.chat.temperature,
      presence_penalty: AI_CONFIG.chat.presencePenalty,
      frequency_penalty: AI_CONFIG.chat.frequencyPenalty,
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
      model: AI_CONFIG.model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-10), // Keep last 10 messages for context
      ],
      max_tokens: AI_CONFIG.chat.maxTokens,
      temperature: AI_CONFIG.chat.temperature,
      presence_penalty: AI_CONFIG.chat.presencePenalty,
      frequency_penalty: AI_CONFIG.chat.frequencyPenalty,
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
  profile?: UserProfile
): Promise<string> {
  try {
    const summaryPrompt = createSummaryPrompt(messages, profile);

    const completion = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [{ role: 'user', content: summaryPrompt }],
      max_tokens: AI_CONFIG.summary.maxTokens,
      temperature: AI_CONFIG.summary.temperature,
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

export async function generatePreworkMessage(profile: UserProfile): Promise<string> {
  try {
    const prompt = createPreworkPrompt(profile);

    const completion = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: AI_CONFIG.prework.maxTokens,
      temperature: AI_CONFIG.prework.temperature,
    });

    return completion.choices[0]?.message?.content || 'Tervetuloa Perustamisapuriin! Aloitetaan keskustelu liikeideasi kehittämisestä.';
  } catch (error) {
    console.error('OpenAI prework message generation error:', error);
    throw new Error('Virhe tervetuloviestin luomisessa.');
  }
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

    const prompt = createBusinessIdeaPrompt(selectedIndustry);

    const completion = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: AI_CONFIG.businessIdea.maxTokens,
      temperature: AI_CONFIG.businessIdea.temperature,
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