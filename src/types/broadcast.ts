export type ContentCategory = 
  | 'NEWS'
  | 'LIVE_NEWS'
  | 'SPORTS'
  | 'EDUCATION'
  | 'SCIENCE'
  | 'TECHNOLOGY'
  | 'CULTURE'
  | 'DOCUMENTARY'
  | 'ENTERTAINMENT'
  | 'MUSIC'
  | 'RELIGION'
  | 'COMMUNITY'
  | 'PUBLIC_SERVICE'
  | 'CHILDREN'
  | 'OTHER';

export type DistributionScope = 
  | 'PRIVATE'
  | 'COMMUNITY_ONLY'
  | 'FOLLOWERS_ONLY'
  | 'FEDERATION_ALLOWED'
  | 'PUBLIC';

export type FederationRelationship = 
  | 'DISCOVER'
  | 'FOLLOW'
  | 'ALLOW'
  | 'DENY'
  | 'BLOCK'
  | 'UNFOLLOW';

export interface BroadcastItem {
  id: string;
  title: string;
  category: ContentCategory | 'breaking' | 'national' | 'citizen' | 'investigative' | 'economy' | 'tech';
  categoryLabel: string;
  reporter: string;
  location: string;
  duration: number; // in seconds
  videoUrl: string; // fallback mp4 or direct url
  youtubeId?: string; // YouTube video ID for dry run loop playout
  isShort?: boolean; // YouTube Short / Vertical Mobile Dispatch
  sourceNetwork?: 'Al Jazeera' | 'BBC News' | 'Al Jazeera 101 East' | 'BBC Eye' | 'DW News' | 'Bengal TV Studio' | 'Banglar Darpan LIVE' | 'UK SOA Intelligence' | 'gaan and fun' | string;
  thumbnailUrl: string;
  regulatoryApproved: boolean;
  complianceScore: number;
  uploadedAt: string;
  views: number;
  isLive?: boolean;
  description: string;
  openSourceLicense: string;
  
  // Open IPTV Federation Properties
  ownerCommunityId?: string;
  communityName?: string;
  distributionScope?: DistributionScope;
  classificationTaxonomy?: {
    country: string;
    region: string;
    language: string;
    ageClass: 'ALL' | '12+' | '16+' | '18+';
    editorialClass: 'STANDARD' | 'VERIFIED_INVESTIGATIVE' | 'COMMUNITY_DISPATCH';
  };
  contentHash?: string;
  metadataHash?: string;
  federationReversible?: boolean;
}

export interface RegulatoryDeclaration {
  factualAccuracy: boolean;
  noHateSpeechOrDefamation: boolean;
  copyrightClearance: boolean;
  noThirdPartyWatermark: boolean; // Guaranteed raw footage so Bengal TV Crown logo can be cleanly applied
  publicInterestCompliance: boolean;
  distributionScopeExplicitConsent: boolean;
  communitySovereigntyAcknowledged: boolean;
}

export interface PlayoutStatus {
  currentProgramId: string;
  currentTime: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  quality: '1080p' | '720p' | '480p' | 'auto';
  serverUptime: string;
  activeBitrate: string;
  fps: number;
  droppedFrames: number;
  logoPosition: 'top-right' | 'top-left';
  autoLoopEnabled: boolean;
  emergencyOverrideActive?: boolean;
}

export interface CommunityNode {
  id: string;
  name: string;
  domain: string;
  country: string;
  region: string;
  language: string;
  operator: string;
  relationship: FederationRelationship;
  allowedCategories: string[];
  deniedCategories: string[];
  totalChannels: number;
  activeStreams: number;
  trustScore: number;
  isReferenceNode?: boolean;
  lastSync: string;
}

export interface FederationAuditRecord {
  eventId: string;
  timestamp: string;
  actorId: string;
  actorRole: string;
  communityId: string;
  action: string;
  targetResource: string;
  result: 'SUCCESS' | 'DENIED' | 'REVOKED' | 'ISOLATED';
  policyVersion: string;
  signature: string;
}

export interface EmergencyKillSwitchState {
  globalFederationPause: boolean;
  communityFederationPause: boolean;
  channelDisable: boolean;
  streamDisable: boolean;
  userDisable: boolean;
  apiDisable: boolean;
}
