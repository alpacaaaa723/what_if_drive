export type Mood = 'sea' | 'mountain' | 'night' | 'cafe' | 'quiet';
export type Duration = '1h' | '2h' | '3h' | 'free';

export interface MoodOption {
  id: Mood;
  label: string;
  icon: string;
}

export interface DurationOption {
  id: Duration;
  label: string;
  minutes: number | null;
}

export interface Waypoint {
  name: string;
  description: string;
  duration: string; // "약 20분 소요"
  type: 'scenic' | 'rest' | 'cafe' | 'landmark';
}

export interface DriveRoute {
  id: string;
  name: string;
  tagline: string;
  mood: Mood;
  imageUrl: string;
  totalDuration: string;
  totalDistance: string;
  departure: string;
  destination: string;
  waypoints: Waypoint[];
  reason: string;
  highlights: string[];
  difficulty: 'easy' | 'moderate' | 'scenic';
}

export interface AppState {
  currentScreen: Screen;
  selectedMood: Mood | null;
  selectedDuration: Duration | null;
  currentLocation: string;
  selectedRoute: DriveRoute | null;
  recommendedRoutes: DriveRoute[];
  driveStarted: boolean;
}

export type Screen = 'home' | 'loading' | 'recommend' | 'detail' | 'driving';
