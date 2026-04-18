// Auth
export interface User {
  id: string;
  email: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  total_polls_created: number;
  total_votes_received: number;
  date_joined: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

// Poll
export type PollStatus = 'draft' | 'active' | 'closed' | 'archived';
export type QuestionType = 'single' | 'multi' | 'ranked' | 'open_text';
export type EmbedTheme = 'light' | 'dark' | 'auto';

export interface Choice {
  id: string;
  text: string;
  description: string;
  image_url: string;
  order: number;
  color: string;
  vote_count: number;
  vote_percentage: number;
}

export interface Question {
  id: string;
  text: string;
  description: string;
  question_type: QuestionType;
  order: number;
  is_required: boolean;
  min_choices: number | null;
  max_choices: number | null;
  max_text_length: number;
  total_responses: number;
  choices: Choice[];
}

export interface PollTag {
  name: string;
}

export interface Poll {
  id: string;
  short_id: string;
  title: string;
  description: string;
  cover_image_url: string;
  status: PollStatus;
  is_public: boolean;
  password: string;
  allow_anonymous: boolean;
  show_results_before_vote: boolean;
  show_results_after_close: boolean;
  voter_cap: number | null;
  expires_at: string | null;
  total_votes: number;
  unique_voters: number;
  question_count: number;
  embed_enabled: boolean;
  embed_theme: EmbedTheme;
  embed_url: string;
  is_expired: boolean;
  is_accepting_votes: boolean;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  creator: PublicUser;
  tags: PollTag[];
  questions?: Question[];
}

export interface PublicUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
}

// Vote submission
export interface VoteResponse {
  question_id: string;
  choice_ids?: string[];
  ranks?: number[];
  text_response?: string;
}

export interface VotePayload {
  browser_fingerprint?: string;
  password?: string;
  responses: VoteResponse[];
}

// Results
export interface RankedChoiceRound {
  tally: Record<string, number>;
  total_votes: number;
  winner?: string;
  eliminated?: string[];
  tie?: string[];
}

export interface RankedChoiceResult {
  winner: string | null;
  rounds: RankedChoiceRound[];
  tie?: string[];
}

export interface ChoiceResult {
  id: string;
  text: string;
  color: string;
  order: number;
  vote_count: number;
  vote_percentage: number;
}

export interface QuestionResult {
  id: string;
  text: string;
  question_type: QuestionType;
  order: number;
  total_responses: number;
  choices: ChoiceResult[];
  ranked_choice_result: RankedChoiceResult | null;
  text_responses: string[];
}

export interface PollResults {
  id: string;
  short_id: string;
  title: string;
  status: PollStatus;
  total_votes: number;
  unique_voters: number;
  created_at: string;
  closed_at: string | null;
  creator: PublicUser;
  questions: QuestionResult[];
}

// WebSocket messages
export type WSMessageType = 'initial_results' | 'results_updated' | 'pong';

export interface WSMessage {
  type: WSMessageType;
  payload?: PollResults;
}

// API responses
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface APIError {
  detail?: string;
  [key: string]: unknown;
}

// Poll builder
export interface ChoiceDraft {
  id: string;
  text: string;
  color: string;
  order: number;
}

export interface QuestionDraft {
  id: string;
  text: string;
  description: string;
  question_type: QuestionType;
  order: number;
  is_required: boolean;
  min_choices: number | null;
  max_choices: number | null;
  max_text_length: number;
  choices: ChoiceDraft[];
}

export interface PollDraft {
  title: string;
  description: string;
  status: PollStatus;
  is_public: boolean;
  password: string;
  allow_anonymous: boolean;
  show_results_before_vote: boolean;
  show_results_after_close: boolean;
  voter_cap: number | null;
  expires_at: string | null;
  embed_enabled: boolean;
  embed_theme: EmbedTheme;
  tags: string[];
  questions: QuestionDraft[];
}
