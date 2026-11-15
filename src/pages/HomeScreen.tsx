import { useState, useEffect } from 'react';
import type { AppState, Mood, Duration } from '../types';
import { MOOD_OPTIONS, DURATION_OPTIONS } from '../data/mockData';
import { usePleosLocation } from '../hooks/usePleosLocation';

interface Props {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  onStartRecommend: () => void;
}

export default function HomeScreen({ state, updateState, onStartRecommend }: Props) {
  const [time, setTime] = useState(new Date());
  const { location, isLoading: locationLoading } = usePleosLocation();

  // 위치 정보를 state에 반영
  useEffect(() => {
    if (location) {
      updateState({ currentLocation: location.address });
    }
  }, [location]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const canStart = state.selectedMood !== null && state.selectedDuration !== null;

  const timeStr = time.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const dateStr = time.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  const locationLabel = locationLoading
    ? '위치 확인 중...'
    : state.currentLocation;

  const locationSource = location?.source;
  const isPleos = locationSource === 'pleos-sdk';

  return (
    <div style={styles.container}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <div>
          <div style={styles.clock}>{timeStr}</div>
          <div style={styles.date}>{dateStr}</div>
        </div>
        <div style={styles.wordmark}>WHAT IF DRIVE</div>
        <div style={styles.locationBox}>
          <span style={{ ...styles.locationIcon, color: isPleos ? 'var(--accent)' : '#7A8485' }}>◎</span>
          <div>
            <div style={styles.locationText}>{locationLabel}</div>
            {locationSource && (
              <div style={styles.locationSource}>
                {isPleos
                  ? 'Pleos FusedLocation SDK'
                  : locationSource === 'browser-geolocation'
                  ? '브라우저 위치'
                  : 'Mock 위치'}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={styles.divider} />

      {/* Main content */}
      <div style={styles.main}>
        {/* Left column */}
        <div style={styles.leftCol}>
          <div>
            <div style={styles.headline}>오늘은 어디로</div>
            <div style={styles.headline}>달려볼까요?</div>
            <div style={styles.subline}>분위기와 시간을 선택하면 AI가 코스를 추천합니다.</div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionLabel}>드라이브 분위기</div>
            <div style={styles.moodGrid}>
              {MOOD_OPTIONS.map(mood => (
                <button
                  key={mood.id}
                  className={`chip ${state.selectedMood === mood.id ? 'selected' : ''}`}
                  onClick={() => updateState({ selectedMood: mood.id as Mood })}
                  style={styles.moodChip}
                >
                  <span>{mood.icon}</span>
                  <span>{mood.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={styles.rightCol}>
          <div style={styles.section}>
            <div style={styles.sectionLabel}>이동 가능 시간</div>
            <div style={styles.durationGrid}>
              {DURATION_OPTIONS.map(dur => (
                <button
                  key={dur.id}
                  className={`chip ${state.selectedDuration === dur.id ? 'selected' : ''}`}
                  onClick={() => updateState({ selectedDuration: dur.id as Duration })}
                  style={styles.durationChip}
                >
                  {dur.label}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.startSection}>
            {canStart ? (
              <div style={styles.readySummary}>
                <span style={styles.readyDot} />
                <span style={{ color: 'var(--accent)', fontSize: 14 }}>
                  {MOOD_OPTIONS.find(m => m.id === state.selectedMood)?.label} ·{' '}
                  {DURATION_OPTIONS.find(d => d.id === state.selectedDuration)?.label}
                </span>
              </div>
            ) : (
              <div style={{ height: 24 }} />
            )}
            <button
              className="btn btn-primary"
              onClick={onStartRecommend}
              disabled={!canStart}
              style={{
                ...styles.startBtn,
                opacity: canStart ? 1 : 0.35,
                cursor: canStart ? 'pointer' : 'not-allowed',
              }}
            >
              코스 추천 받기
            </button>
            {!canStart && (
              <div style={styles.hintText}>분위기와 시간을 선택해 주세요</div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={styles.divider} />
      <div style={styles.bottomBar}>
        <span style={styles.bottomLabel}>AI 기반 드라이브 코스 추천</span>
        <div style={styles.bottomRight}>
          <span style={styles.sdkBadge}>NaviHelper SDK</span>
          <span style={styles.sdkBadge}>FusedLocation SDK</span>
          <span style={styles.bottomNote}>프로토타입 · Pleos SDK 연동 예정</span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--bg)',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 48px',
    flexShrink: 0,
  },
  clock: {
    fontSize: 32,
    fontWeight: 300,
    color: 'var(--text-primary)',
    letterSpacing: '-1px',
    lineHeight: 1,
  },
  date: {
    fontSize: 13,
    color: 'var(--text-secondary)',
    marginTop: 4,
  },
  wordmark: {
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--text-secondary)',
    letterSpacing: '4px',
  },
  locationBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    textAlign: 'right' as const,
  },
  locationIcon: {
    fontSize: 16,
    transition: 'color 0.3s ease',
  },
  locationText: {
    fontSize: 14,
    color: 'var(--text-secondary)',
  },
  locationSource: {
    fontSize: 11,
    color: '#5A6063',
    marginTop: 2,
    textAlign: 'right' as const,
  },
  divider: {
    width: '100%',
    height: 1,
    background: 'var(--divider)',
    flexShrink: 0,
  },
  main: {
    flex: 1,
    display: 'flex',
    gap: 0,
    overflow: 'hidden',
  },
  leftCol: {
    flex: 1,
    padding: '48px 48px 40px 48px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRight: '1px solid var(--divider)',
  },
  rightCol: {
    width: 480,
    padding: '48px 48px 40px 48px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  headline: {
    fontSize: 42,
    fontWeight: 300,
    color: 'var(--text-primary)',
    letterSpacing: '-1.5px',
    lineHeight: 1.2,
  },
  subline: {
    fontSize: 15,
    color: 'var(--text-secondary)',
    marginTop: 12,
    fontWeight: 300,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text-secondary)',
    letterSpacing: '1.5px',
    textTransform: 'uppercase' as const,
  },
  moodGrid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 10,
  },
  moodChip: {
    flexShrink: 0,
  },
  durationGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
  },
  durationChip: {
    width: '100%',
    justifyContent: 'center',
    fontSize: 17,
    padding: '18px 16px',
  },
  startSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  readySummary: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  readyDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--accent)',
    flexShrink: 0,
  },
  startBtn: {
    width: '100%',
    fontSize: 18,
    padding: '20px',
    letterSpacing: '0.5px',
    borderRadius: 0,
  },
  hintText: {
    fontSize: 13,
    color: 'var(--text-secondary)',
    textAlign: 'center' as const,
    marginTop: 4,
  },
  bottomBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 48px',
    flexShrink: 0,
  },
  bottomLabel: {
    fontSize: 12,
    color: 'var(--text-secondary)',
    letterSpacing: '0.5px',
  },
  bottomRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  sdkBadge: {
    fontSize: 10,
    color: 'var(--accent)',
    border: '1px solid rgba(167,200,184,0.3)',
    padding: '2px 7px',
    letterSpacing: '0.3px',
    opacity: 0.7,
  },
  bottomNote: {
    fontSize: 11,
    color: '#5A6063',
    letterSpacing: '0.3px',
  },
};
