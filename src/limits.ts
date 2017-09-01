export interface Rate {
  allowedRequests: number;
  seconds: number;
}

export interface RateLimit {
  key: string;
  rate: Rate;
}

export interface MethodLimits {
  LIST_CHAMPION_MASTERIES: Rate;
  GET_CHAMPION_MASTERY: Rate;
  GET_TOTAL_CHAMPION_MASTERY_SCORE: Rate;
  LIST_CHAMPIONS: Rate;
  GET_CHAMPION: Rate;
  GET_CHALLENGER_LEAGUE: Rate;
  GET_LEAGUES_IN_ALL_QUEUES: Rate;
  GET_MASTER_LEAGUE: Rate;
  GET_LEAGUE_POSITIONS_IN_ALL_QUEUES: Rate;
  GET_SHARD_STATUS: Rate;
  GET_MASTERY_PAGES: Rate;
  GET_MATCH: Rate;
  GET_MATCHLIST: Rate;
  GET_RECENT_MATCHLIST: Rate;
  GET_MATCH_TIMELINE: Rate;
  GET_RUNE_PAGES: Rate;
  GET_CURRENT_GAME: Rate;
  LIST_FEATURED_GAMES: Rate;
  GET_SUMMONER_BY_ACCOUNT_ID: Rate;
  GET_SUMMONER_BY_NAME: Rate;
  GET_SUMMONER_BY_ID: Rate;

  RETRIEVE_CHAMPION_LIST: Rate;
  RETRIEVE_CHAMPION_BY_ID: Rate;
  RETRIEVE_ITEM_LIST: Rate;
  RETRIEVE_ITEM_BY_ID: Rate;
  RETRIEVE_LANGUAGE_STRINGS_DATA: Rate;
  RETRIEVE_SUPPORTED_LANGUAGES_DATA: Rate;
  RETRIEVE_MAP_DATA: Rate;
  RETRIEVE_MASTERIES: Rate;
  RETRIEVE_MASTERY_BY_ID: Rate;
  RETRIEVE_PROFILE_ICONS: Rate;
  RETRIEVE_REALM_DATA: Rate;
  RETRIEVE_RUNE_LIST: Rate;
  RETRIEVE_RUNE_BY_ID: Rate;
  RETRIEVE_SUMMONER_SPELL_LIST: Rate;
  RETRIEVE_SUMMONER_SPELL_BY_ID: Rate;
  RETRIEVE_VERSIONS: Rate;
}

export const defaultMethodLimits: MethodLimits = {
  LIST_CHAMPION_MASTERIES: { allowedRequests: 20000, seconds: 10 },
  GET_CHAMPION_MASTERY: { allowedRequests: 20000, seconds: 10 },
  GET_TOTAL_CHAMPION_MASTERY_SCORE: { allowedRequests: 20000, seconds: 10 },
  LIST_CHAMPIONS: { allowedRequests: 200, seconds: 60 },
  GET_CHAMPION: { allowedRequests: 200, seconds: 60 },
  GET_CHALLENGER_LEAGUE: { allowedRequests: 20000, seconds: 10 },
  GET_LEAGUES_IN_ALL_QUEUES: { allowedRequests: 20000, seconds: 10 },
  GET_MASTER_LEAGUE: { allowedRequests: 20000, seconds: 10 },
  GET_LEAGUE_POSITIONS_IN_ALL_QUEUES: { allowedRequests: 20000, seconds: 10 },
  GET_MASTERY_PAGES: { allowedRequests: 200, seconds: 60 },
  GET_MATCH: { allowedRequests: 500, seconds: 10 },
  GET_MATCHLIST: { allowedRequests: 1000, seconds: 10 },
  GET_RECENT_MATCHLIST: { allowedRequests: 20000, seconds: 10 },
  GET_MATCH_TIMELINE: { allowedRequests: 500, seconds: 10 },
  GET_RUNE_PAGES: { allowedRequests: 200, seconds: 60 },
  GET_CURRENT_GAME: { allowedRequests: 20000, seconds: 10 },
  LIST_FEATURED_GAMES: { allowedRequests: 20000, seconds: 10 },
  GET_SHARD_STATUS: { allowedRequests: 20000, seconds: 10 },
  GET_SUMMONER_BY_ACCOUNT_ID: { allowedRequests: 20000, seconds: 10 },
  GET_SUMMONER_BY_ID: { allowedRequests: 20000, seconds: 10 },

  GET_SUMMONER_BY_NAME: { allowedRequests: 20000, seconds: 10 },
  RETRIEVE_CHAMPION_LIST: { allowedRequests: 10, seconds: 3600 },
  RETRIEVE_CHAMPION_BY_ID: { allowedRequests: 10, seconds: 3600 },
  RETRIEVE_ITEM_LIST: { allowedRequests: 10, seconds: 3600 },
  RETRIEVE_ITEM_BY_ID: { allowedRequests: 10, seconds: 3600 },
  RETRIEVE_LANGUAGE_STRINGS_DATA: { allowedRequests: 10, seconds: 3600 },
  RETRIEVE_SUPPORTED_LANGUAGES_DATA: { allowedRequests: 10, seconds: 3600 },
  RETRIEVE_MAP_DATA: { allowedRequests: 10, seconds: 3600 },
  RETRIEVE_MASTERIES: { allowedRequests: 10, seconds: 3600 },
  RETRIEVE_MASTERY_BY_ID: { allowedRequests: 10, seconds: 3600 },
  RETRIEVE_PROFILE_ICONS: { allowedRequests: 10, seconds: 3600 },
  RETRIEVE_REALM_DATA: { allowedRequests: 10, seconds: 3600 },
  RETRIEVE_RUNE_LIST: { allowedRequests: 10, seconds: 3600 },
  RETRIEVE_RUNE_BY_ID: { allowedRequests: 10, seconds: 3600 },
  RETRIEVE_SUMMONER_SPELL_LIST: { allowedRequests: 10, seconds: 3600 },
  RETRIEVE_SUMMONER_SPELL_BY_ID: { allowedRequests: 10, seconds: 3600 },
  RETRIEVE_VERSIONS: { allowedRequests: 10, seconds: 3600 }
};
