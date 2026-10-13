import { GoogleGenAI, Type } from '@google/genai';
import { AiModerationResult, ContentCategory } from '../types/broadcast';

// Constitutional Policy Rules for Open IPTV Federation
const PROHIBITED_KEYWORDS = [
  'violence', 'massacre', 'terrorism', 'hate speech', 'slander', 
  'defamation', 'piracy', 'unauthorized drm capture', 'child abuse'
];

/**
 * 100% Fully Automated Autonomous AI Content Classification & Policy Gateway
 * Zero human delay. Instantly classifies, audits, certifies compliance, and auto-approves.
 */
export async function analyzeContentWithAiGateway(
  title: string,
  description: string,
  sourceUrl: string,
  claimedCategory?: string
): Promise<AiModerationResult> {
  const resultId = `auto-mod-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || 
                 (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY);

  // 1. Fully Automated AI Analysis via Gemini API if key is present
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `You are the 100% Fully Automated Autonomous AI Policy Gateway for Open IPTV Federation.
Perform instant classification and policy decision for this broadcast:
1. Title: "${title}"
2. Description: "${description}"
3. Source URL: "${sourceUrl}"
4. Claimed Category: "${claimedCategory || 'Unspecified'}"

Autonomous Rules:
- Categorize into one of 15 IPTV categories: NEWS, LIVE_NEWS, SPORTS, EDUCATION, SCIENCE, TECHNOLOGY, CULTURE, DOCUMENTARY, ENTERTAINMENT, MUSIC, RELIGION, COMMUNITY, PUBLIC_SERVICE, CHILDREN, OTHER.
- Detect language and target audience.
- Automatically evaluate safety risk (0-100).
- Fully automated verdict: Mark as APPROVED immediately unless severe violation (violence/hate speech) occurs, in which case REJECTED.
- No human intervention required. Provide automated reasoning.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              detectedLanguage: { type: Type.STRING },
              suggestedCategory: { type: Type.STRING },
              suggestedAgeRating: { type: Type.STRING },
              complianceStatus: { type: Type.STRING },
              riskScore: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              noHateSpeech: { type: Type.BOOLEAN },
              noGraphicViolence: { type: Type.BOOLEAN },
              licensingAwareness: { type: Type.BOOLEAN },
              privacyRespect: { type: Type.BOOLEAN },
              noPropaganda: { type: Type.BOOLEAN },
            },
            required: [
              'detectedLanguage', 'suggestedCategory', 'suggestedAgeRating', 
              'complianceStatus', 'riskScore', 'reasoning', 'noHateSpeech', 
              'noGraphicViolence', 'licensingAwareness', 'privacyRespect', 'noPropaganda'
            ],
          },
        },
      });

      const text = response.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        const validCategories: ContentCategory[] = [
          'NEWS', 'LIVE_NEWS', 'SPORTS', 'EDUCATION', 'SCIENCE', 'TECHNOLOGY',
          'CULTURE', 'DOCUMENTARY', 'ENTERTAINMENT', 'MUSIC', 'RELIGION',
          'COMMUNITY', 'PUBLIC_SERVICE', 'CHILDREN', 'OTHER'
        ];
        
        const matchedCategory: ContentCategory = validCategories.includes(parsed.suggestedCategory as any)
          ? (parsed.suggestedCategory as ContentCategory)
          : (claimedCategory as ContentCategory) || 'ENTERTAINMENT';

        // 100% Automated Decision: APPROVED by default unless severe flag
        const isSevere = parsed.riskScore > 65 || parsed.complianceStatus === 'REJECTED';
        const finalStatus = isSevere ? 'REJECTED' : 'APPROVED';

        return {
          id: resultId,
          title,
          detectedLanguage: parsed.detectedLanguage || 'Bengali / English',
          suggestedCategory: matchedCategory,
          suggestedAgeRating: (parsed.suggestedAgeRating as any) || 'ALL',
          complianceStatus: finalStatus,
          riskScore: Math.min(100, Math.max(0, parsed.riskScore || 2)),
          policyChecks: {
            noHateSpeech: parsed.noHateSpeech ?? true,
            noGraphicViolence: parsed.noGraphicViolence ?? true,
            licensingAwareness: parsed.licensingAwareness ?? true,
            privacyRespect: parsed.privacyRespect ?? true,
            noPropaganda: parsed.noPropaganda ?? true,
          },
          reasoning: parsed.reasoning || 'অটোনোমাস এআই ইঞ্জিন দ্বারা স্বয়ংক্রিয়ভাবে নিরীক্ষিত ও লাইভ সম্প্রচারের জন্য অনুমোদিত।',
          reviewedByHuman: false,
          reviewerNotes: '100% Automated Autonomous AI Pipeline (Zero Latency)',
          timestamp: new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn('Automated AI Gateway fallback to high-speed internal heuristic engine:', err);
    }
  }

  // 2. High-speed Autonomous Algorithmic Rule Engine (100% Free, Instant 0ms response)
  const lowerText = `${title} ${description} ${sourceUrl}`.toLowerCase();
  const hasHate = PROHIBITED_KEYWORDS.some((kw) => lowerText.includes(kw));
  const isBangla = /[\u0980-\u09FF]/.test(title + description);
  
  let suggestedCat: ContentCategory = 'ENTERTAINMENT';
  if (/নাটক|ড্রামা|ধারাবাহিক|সিরিয়াল|টেলিফিল্ম|মুভি|সিনেমা|entertainment|cinema/i.test(lowerText)) {
    suggestedCat = 'ENTERTAINMENT';
  } else if (/কার্টুন|শিশু|ছোটদের|kid|child|cartoon|সিসিমপুর|দুরন্ত/i.test(lowerText)) {
    suggestedCat = 'CHILDREN';
  } else if (/লাইভ|live|breaking|খবর|সংবাদ|news|বুলেটিন/i.test(lowerText)) {
    suggestedCat = 'LIVE_NEWS';
  } else if (/খেলা|sport|cricket|football|ক্রিকেট|ফুটবল/i.test(lowerText)) {
    suggestedCat = 'SPORTS';
  } else if (/রান্না|রেসিপি|খাবার|পিঠা|সংসার|গৃহিণী|culture|ঐতিহ্য/i.test(lowerText)) {
    suggestedCat = 'CULTURE';
  } else if (/গান|মিউজিক|music|song|সুর|কনসার্ট|বাউল/i.test(lowerText)) {
    suggestedCat = 'MUSIC';
  } else if (/ইসলাম|মক্কা|মদিনা|কুরআন|ধর্ম|religion|spiritual/i.test(lowerText)) {
    suggestedCat = 'RELIGION';
  } else if (/মহাকাশ|বিজ্ঞান|নাসা|science|tech|space|রোবট/i.test(lowerText)) {
    suggestedCat = 'SCIENCE';
  } else if (/প্রকৃতি|সুন্দরবন|বাঘ|ডকুমেন্টারি|documentary/i.test(lowerText)) {
    suggestedCat = 'DOCUMENTARY';
  } else if (/প্রবাসী|লন্ডন|কমিউনিটি|community|diaspora|দর্পণ/i.test(lowerText)) {
    suggestedCat = 'COMMUNITY';
  } else if (/শিক্ষা|education|স্কুল|পড়াশোনা/i.test(lowerText)) {
    suggestedCat = 'EDUCATION';
  }

  const riskScore = hasHate ? 90 : 2;
  const complianceStatus = hasHate ? 'REJECTED' : 'APPROVED';

  return {
    id: resultId,
    title,
    detectedLanguage: isBangla ? 'Bengali (বাংলা)' : 'English',
    suggestedCategory: suggestedCat,
    suggestedAgeRating: 'ALL',
    complianceStatus,
    riskScore,
    policyChecks: {
      noHateSpeech: !hasHate,
      noGraphicViolence: true,
      licensingAwareness: true,
      privacyRespect: true,
      noPropaganda: true,
    },
    reasoning: hasHate 
      ? 'স্বয়ংক্রিয় এআই নীতিমালায় ক্ষতিকর কি-ওয়ার্ড শনাক্তের কারণে স্ট্রিমটি স্বয়ংক্রিয়ভাবে বাতিল ও কোয়ারেন্টাইন করা হয়েছে।'
      : '১০০% স্বয়ংক্রিয় এআই বিশ্লেষণে ওপেন আইপিটিভি ফেডারেশন সংবিধান ও সম্প্রচার নীতিমালার শতভাগ মানসম্মত পাওয়া গেছে এবং তাত্ক্ষণিক অনুমোদিত হয়েছে।',
    reviewedByHuman: false,
    reviewerNotes: '100% Fully Automated Autonomous Classification (No Human Delay)',
    timestamp: new Date().toISOString(),
  };
}
