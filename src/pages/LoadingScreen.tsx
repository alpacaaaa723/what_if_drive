import { useEffect, useState } from 'react';
import type { AppState } from '../types';
import { MOOD_OPTIONS, DURATION_OPTIONS } from '../data/mockData';

interface Props {
  state: AppState;
}

export default function LoadingScreen({ state }: Props) {
  const [dots, setDots] = useState(0);
  const [phase, setPhase] = useState(0);

  const phases = [
    '현재 위치를 분석하는 중',
    '교통 상황을 확인하는 중',
    '최적의 드라이브 코스를 생성하는 중',
  ];

  useEffect(() => {
    const dotsTimer = setInterval(() => setDots(d => (d + 1) % 4), 400);
    const phaseTimer = setInterval(() => setPhase(p => Math.min(p + 1, phases.length - 1)), 700);
    return () => {
      clearInterval(dotsTimer);
      clearInterval(phaseTimer);
    };
  }, []);

  const moodLabel = MOOD_OPTIONS.find(m => m.id === state.selectedMood)?.label ?? '';
  const durationLabel = DURATION_OPTIONS.find(d => d.id === state.selectedDuration)?.label ?? '';

  return (
    <div style={styles.container}>
      <div style={styles.inner}>
        {/* Wordmark */}
        <div style={styles.wordmark}>WHAT IF DRIVE</div>

        {/* Animated indicator */}
        <div style={styles.indicatorWrap}>
          <div style={styles.barTrack}>
            <div style={styles.barFill} />
          </div>
        </div>

        {/* Phase text */}
        <div style={styles.phaseText}>
          {phases[phase]}{'.'.repeat(dots)}
        </div>

        {/* Selection summary */}
        <div style={styles.summary}>
          <span style={styles.summaryItem}>{moodLabel}</span>
          <span style={styles.summaryDivider}>·</span>
          <span style={styles.summaryItem}>{durationLabel}</span>
          <span style={styles.summaryDivider}>·</span>
          <span style={styles.summaryItem}>{state.currentLocation}</span>
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
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg)',
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 32,
    width: 480,
  },
  wordmark: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text-secondary)',
    letterSpacing: '5px',
  },
  indicatorWrap: {
    width: '100%',
  },
  barTrack: {
    width: '100%',
    height: 2,
    background: 'var(--divider)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    width: '40%',
    background: 'var(--accent)',
    animation: 'slide 1.6s ease-in-out infinite',
  },
  phaseText: {
    fontSize: 20,
    fontWeight: 300,
    color: 'var(--text-primary)',
    letterSpacing: '-0.3px',
    minHeight: 32,
    textAlign: 'center',
  },
  summary: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  summaryItem: {
    fontSize: 14,
    color: 'var(--text-secondary)',
  },
  summaryDivider: {
    color: 'var(--divider)',
  },
};
