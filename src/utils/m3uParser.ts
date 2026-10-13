import { BroadcastItem, ContentCategory } from '../types/broadcast';

// Private and reserved IP blocks that are forbidden to access (SSRF prevention)
const BLOCKED_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\./,
  /^metadata\.google\.internal$/i,
  /^100\.64\./,
  /^::1$/,
];

export function validateSafeUrl(rawUrl: string): { valid: boolean; reason?: string } {
  if (!rawUrl || rawUrl.trim().length === 0) {
    return { valid: false, reason: 'URL cannot be empty' };
  }
  try {
    const url = new URL(rawUrl.trim());
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return { valid: false, reason: `Unsupported protocol: ${url.protocol}` };
    }
    const hostname = url.hostname.toLowerCase();
    for (const pattern of BLOCKED_HOST_PATTERNS) {
      if (pattern.test(hostname)) {
        return { valid: false, reason: `Private/internal address blocked for security: ${hostname}` };
      }
    }
    return { valid: true };
  } catch {
    return { valid: false, reason: 'Malformed URL' };
  }
}

export function mapGroupToCategory(groupTitle?: string): ContentCategory {
  if (!groupTitle) return 'NEWS';
  const g = groupTitle.toUpperCase();
  if (g.includes('SPORT')) return 'SPORTS';
  if (g.includes('EDU') || g.includes('LEARN') || g.includes('SCHOOL')) return 'EDUCATION';
  if (g.includes('SCI') || g.includes('SPACE')) return 'SCIENCE';
  if (g.includes('TECH') || g.includes('IT')) return 'TECHNOLOGY';
  if (g.includes('CULT') || g.includes('HERITAGE') || g.includes('HISTORY')) return 'CULTURE';
  if (g.includes('DOC') || g.includes('INVESTIGAT')) return 'DOCUMENTARY';
  if (g.includes('ENT') || g.includes('DRAMA') || g.includes('MOVIE') || g.includes('CINEMA')) return 'ENTERTAINMENT';
  if (g.includes('MUSIC') || g.includes('SONG') || g.includes('BEAT')) return 'MUSIC';
  if (g.includes('RELIG') || g.includes('ISLAM') || g.includes('PEACE')) return 'RELIGION';
  if (g.includes('COMMUN') || g.includes('LOCAL')) return 'COMMUNITY';
  if (g.includes('PUBLIC') || g.includes('PARLIAMENT') || g.includes('SANGSAD')) return 'PUBLIC_SERVICE';
  if (g.includes('KID') || g.includes('CHILD') || g.includes('ANIMATION')) return 'CHILDREN';
  if (g.includes('LIVE') || g.includes('BREAKING')) return 'LIVE_NEWS';
  return 'NEWS';
}

export interface ParseM3uResult {
  channels: BroadcastItem[];
  errors: string[];
  totalParsed: number;
}

export function parseM3uContent(content: string, communityId: string = 'comm-local-node'): ParseM3uResult {
  const lines = content.split(/\r?\n/);
  const channels: BroadcastItem[] = [];
  const errors: string[] = [];

  let pendingHeader: {
    name: string;
    logo?: string;
    groupTitle?: string;
    tvgId?: string;
    language?: string;
    country?: string;
  } | null = null;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]?.trim();
    if (!raw) continue;

    if (raw.startsWith('#EXTINF:')) {
      // Parse #EXTINF:-1 tvg-id="..." tvg-name="..." tvg-logo="..." group-title="...",Channel Name
      const commaIdx = raw.lastIndexOf(',');
      const displayName = commaIdx !== -1 ? raw.substring(commaIdx + 1).trim() : 'Unnamed Channel';
      const headerProps = commaIdx !== -1 ? raw.substring(0, commaIdx) : raw;

      // Extract attributes
      const getAttr = (key: string): string | undefined => {
        const match = headerProps.match(new RegExp(`${key}="([^"]*)"`, 'i'));
        return match ? match[1] : undefined;
      };

      pendingHeader = {
        name: displayName || getAttr('tvg-name') || 'IPTV Channel',
        logo: getAttr('tvg-logo'),
        groupTitle: getAttr('group-title'),
        tvgId: getAttr('tvg-id'),
        language: getAttr('tvg-language') || 'Bengali',
        country: getAttr('tvg-country') || 'Bangladesh',
      };
      continue;
    }

    if (raw.startsWith('#')) {
      // Skip comments / metadata tags like #EXTVLCOPT
      continue;
    }

    // Line is a stream URL
    if (pendingHeader) {
      const validation = validateSafeUrl(raw);
      if (!validation.valid) {
        errors.push(`[${pendingHeader.name}] Skipped: ${validation.reason}`);
        pendingHeader = null;
        continue;
      }

      const category = mapGroupToCategory(pendingHeader.groupTitle);
      const isHls = raw.includes('.m3u8') || raw.includes('/hls');

      channels.push({
        id: `m3u-${channels.length + 1}-${Date.now().toString(36)}`,
        channelNumber: channels.length + 101,
        title: pendingHeader.name,
        category,
        categoryLabel: pendingHeader.groupTitle || category,
        location: pendingHeader.country || 'Global Stream',
        duration: 3600,
        videoUrl: raw,
        streamType: isHls ? 'hls' : 'direct',
        thumbnailUrl: pendingHeader.logo || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=600&auto=format&fit=crop&q=80',
        logoUrl: pendingHeader.logo,
        regulatoryApproved: true,
        complianceScore: 100,
        uploadedAt: 'M3U Custom Ingest',
        views: 1200,
        isLive: true,
        description: `Imported via Open IPTV Federation M3U Ingest Engine. Category: ${category}.`,
        openSourceLicense: 'Community Ingest License',
        ownerCommunityId: communityId,
        distributionScope: 'COMMUNITY_ONLY',
        classificationTaxonomy: {
          country: pendingHeader.country || 'Global',
          region: 'Local Node',
          language: pendingHeader.language || 'bn',
          ageClass: 'ALL',
          editorialClass: 'STANDARD',
        },
      });

      pendingHeader = null;
    }
  }

  return {
    channels,
    errors,
    totalParsed: channels.length,
  };
}
