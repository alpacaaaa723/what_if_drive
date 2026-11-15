import { useState } from 'react';
import type { AppState, DriveRoute } from './types';
import { getRecommendedRoutes } from './data/mockData';
import HomeScreen from './pages/HomeScreen';
import LoadingScreen from './pages/LoadingScreen';
import RecommendScreen from './pages/RecommendScreen';
import DetailScreen from './pages/DetailScreen';
import DrivingScreen from './pages/DrivingScreen';
import './index.css';

const initialState: AppState = {
  currentScreen: 'home',
  selectedMood: null,
  selectedDuration: null,
  currentLocation: '위치 확인 중...',
  selectedRoute: null,
  recommendedRoutes: [],
  driveStarted: false,
};

function App() {
  const [state, setState] = useState<AppState>(initialState);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleStartRecommend = () => {
    updateState({ currentScreen: 'loading' });
    setTimeout(() => {
      // Mock: 실제 AI 연동 시 Gemini API 또는 Pleos AI 서비스 호출로 교체
      const routes = getRecommendedRoutes(state.selectedMood, state.selectedDuration);
      updateState({
        currentScreen: 'recommend',
        recommendedRoutes: routes,
      });
    }, 2200);
  };

  const handleSelectRoute = (route: DriveRoute) => {
    updateState({ currentScreen: 'detail', selectedRoute: route });
  };

  const handleStartDrive = () => {
    updateState({ currentScreen: 'driving', driveStarted: true });
  };

  const handleGoHome = () => {
    setState(initialState);
  };

  const handleGoBack = () => {
    const backMap: Partial<Record<AppState['currentScreen'], AppState['currentScreen']>> = {
      recommend: 'home',
      detail: 'recommend',
      driving: 'detail',
    };
    const target = backMap[state.currentScreen] ?? 'home';
    updateState({ currentScreen: target });
  };

  const screenProps = { state, updateState, handleGoHome, handleGoBack };

  return (
    <div className="app-container">
      <div className="screen">
        {state.currentScreen === 'home' && (
          <HomeScreen
            state={state}
            updateState={updateState}
            onStartRecommend={handleStartRecommend}
          />
        )}
        {state.currentScreen === 'loading' && (
          <LoadingScreen state={state} />
        )}
        {state.currentScreen === 'recommend' && (
          <RecommendScreen
            {...screenProps}
            onSelectRoute={handleSelectRoute}
          />
        )}
        {state.currentScreen === 'detail' && (
          <DetailScreen
            {...screenProps}
            onStartDrive={handleStartDrive}
          />
        )}
        {state.currentScreen === 'driving' && (
          <DrivingScreen {...screenProps} />
        )}
      </div>
    </div>
  );
}

export default App;
