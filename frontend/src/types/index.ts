export interface Match {
  match_id: string;
  season: string;
  date: string;
  home_team: string;
  away_team: string;
  venue_city: string;
  home_goals: number;
  away_goals: number;
  result: string;
  home_formation: string;
  away_formation: string;
  weather: string;
  pitch: string;
  home_possession: number;
  away_possession: number;
}

export interface TeamOverview {
  team: string;
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  win_rate: number;
  home_win_rate: number;
  away_win_rate: number;
  home_away_diff: number;
  goals_scored: number;
  goals_conceded: number;
  goal_diff: number;
  clean_sheets: number;
  clean_sheet_pct: number;
  form_streak: string[];
  points: number;
}

export interface TeamDetail {
  overview: TeamOverview;
  tactical_formations: Record<string, number>;
  averages: {
    possession_pct: number;
    shots_on_target: number;
    corners: number;
    yellow_cards: number;
    red_cards: number;
  };
  radar_profile: Array<{ metric: string; value: number }>;
  recent_matches: Array<{
    match_id: string;
    date: string;
    season: string;
    is_home: boolean;
    opponent: string;
    score: string;
    outcome: string;
    venue: string;
  }>;
}

export interface PredictionResult {
  prediction: string;
  home_win_probability: number;
  draw_probability: number;
  away_win_probability: number;
  model_used: string;
  confidence: number;
  home_team: string;
  away_team: string;
  key_influencing_factors: {
    positive: string[];
    negative: string[];
  };
  top_features: Array<{
    feature: string;
    importance: number;
    percentage: number;
  }>;
  prematch_summary: {
    home_formation: string;
    away_formation: string;
    home_market_value_cr: number;
    away_market_value_cr: number;
    home_recent_form_pts: number;
    away_recent_form_pts: number;
    weather: string;
    pitch: string;
    referee_strictness: number;
  };
}

export interface IndianVsForeignData {
  attack: {
    indian_goals: number;
    foreign_goals: number;
    indian_goal_pct: number;
    foreign_goal_pct: number;
    indian_big_chances_created: number;
    foreign_big_chances_created: number;
    indian_big_chances_missed: number;
    foreign_big_chances_missed: number;
    indian_conversion_rate: number;
    foreign_conversion_rate: number;
  };
  defence: {
    indian_clearances_tackles: number;
    foreign_clearances_tackles: number;
    indian_clearances_tackles_pct: number;
    foreign_clearances_tackles_pct: number;
    indian_avg_interception_rate: number;
    foreign_avg_interception_rate: number;
  };
  ratings_creativity: {
    indian_avg_rating: number;
    foreign_avg_rating: number;
    rating_gap: number;
  };
  market_value: {
    avg_squad_market_value_cr: number;
    foreign_market_value_cr: number;
    indian_market_value_cr: number;
    foreign_market_share_pct: number;
    indian_market_share_pct: number;
  };
}

export interface KPIOverview {
  total_matches: number;
  total_teams: number;
  total_seasons: number;
  total_goals: number;
  avg_goals_per_match: number;
  home_win_pct: number;
  draw_pct: number;
  away_win_pct: number;
  home_advantage_differential: number;
  result_distribution: Array<{
    name: string;
    value: number;
    percentage: number;
    color: string;
  }>;
  seasons_trend: Array<{
    season: string;
    matches: number;
    total_goals: number;
    avg_goals: number;
    home_wins: number;
    away_wins: number;
    draws: number;
  }>;
}

export interface ModelComparisonData {
  random_split: Record<string, {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    confusion_matrix: number[][];
  }>;
  temporal_split: Record<string, {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    confusion_matrix: number[][];
  }>;
  paper_benchmarks: Record<string, any>;
  best_model: {
    name: string;
    accuracy: number;
    f1_score: number;
  };
  target_classes: string[];
}
