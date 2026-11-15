import { useState } from 'react';
import type { AppState } from '../types';
import { usePleosVehicle } from '../hooks/usePleosVehicle';
import { startNavigation, type RouteDestination, type RouteWaypoint } from '../lib/pleosBridge';

interface Props {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  handleGoHome: () => void;
  handleGoBack: () => void;
}

export default function DrivingScreen({ state, handleGoHome }: Props) {
  const route = state.selectedRoute;
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);

  // ── Pleos Vehicle SDK / Mock 훅 ──────────────────────────────────────────
  const vehicle = usePleosVehicle(true);

  // ── NaviHelper SDK: 화면 진입 시 내비게이션 시작 ──────────────────────────
  // (실제 Pleos 환경에서는 requestRouteWithWaypoints 호출)
  const [naviResult] = useState(() => {
    if (!route) return null;

    const destination: RouteDestination = {
      latitude: 37.5665, // Mock 좌표 (실제 POI 연동 시 교체)
      longitude: 126.9780,
      poiName: route.destination,
      address: route.destination,
    };

    const waypoints: RouteWaypoint[] = route.waypoints.slice(0, 2).map((wp, i) => ({
      latitude: 37.5 + i * 0.05, // Mock 좌표
      longitude: 127.0 + i * 0.03,
      poiName: wp.name,
      address: wp.name,
      waypointIndex: i as 0 | 1,
    }));

    return startNavigation(destination, waypoints);
  });

  if (!route) return null;

  const totalWaypoints = route.waypoints.length;
  const currentWaypoint = route.waypoints[currentWaypointIndex];
  const nextLabel =
    currentWaypointIndex < totalWaypoints - 1
      ? route.waypoints[currentWaypointIndex + 1].name
      : route.destination;

  const remainMin = Math.max(0, 90 - Math.floor(vehicle.elapsedSeconds / 60));
  const remainSec = 59 - (vehicle.elapsedSeconds % 60);

  const handleNextWaypoint = () => {
    if (currentWaypointIndex < totalWaypoints - 1) {
      setCurrentWaypointIndex(i => i + 1);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left: Map */}
      <div style={styles.mapSection}>
        <DrivingMap route={route} currentIndex={currentWaypointIndex} />
      </div>

      {/* Right: Navigation panel */}
      <div style={styles.navPanel}>
        {/* Top bar */}
        <div style={styles.panelTop}>
          <div>
            <div style={styles.wordmark}>WHAT IF DRIVE</div>
            {/* SDK 연동 상태 표시 */}
            <div style={styles.sdkStatus}>
              {vehicle.isMock ? (
                <span style={styles.statusMock}>시뮬레이션 모드</span>
              ) : (
                <span style={styles.statusLive}>● Pleos Vehicle SDK</span>
              )}
            </div>
          </div>
          <button className="btn btn-ghost" onClick={handleGoHome} style={styles.stopBtn}>
            종료
          </button>
        </div>

        <div style={styles.panelDivider} />

        {/* NaviHelper 연동 상태 */}
        {naviResult && (
          <div style={styles.naviStatusBar}>
            <span style={{
              ...styles.naviStatusText,
              color: naviResult.method === 'pleos-navi-sdk' ? 'var(--accent)' : 'var(--text-secondary)',
            }}>
              {naviResult.method === 'pleos-navi-sdk'
                ? '● NaviHelper SDK 연결됨'
                : '○ NaviHelper SDK 미연결 (시뮬레이션)'}
            </span>
          </div>
        )}

        <div style={styles.panelDivider} />

        {/* Speed + elapsed */}
        <div style={styles.liveRow}>
          <div style={styles.speedBox}>
            <span style={styles.speedValue}>{Math.round(vehicle.speed)}</span>
            <span style={styles.speedUnit}>km/h</span>
          </div>
          <div style={styles.timeBox}>
            <span style={styles.elapsedLabel}>경과 시간</span>
            <span style={styles.elapsedValue}>
              {String(Math.floor(vehicle.elapsedSeconds / 60)).padStart(2, '0')}
              :{String(vehicle.elapsedSeconds % 60).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div style={styles.panelDivider} />

        {/* Direction */}
        <div style={styles.directionBox}>
          <div style={styles.dirLabel}>다음 목적지까지</div>
          <div style={styles.dirValue}>
            {remainMin}분 {remainSec}초
          </div>
          <div style={styles.dirDestination}>→ {currentWaypoint?.name ?? route.destination}</div>
        </div>

        <div style={styles.panelDivider} />

        {/* Waypoint progress */}
        <div style={styles.progressSection}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>경유지</span>
            <span style={styles.progressCount}>
              {currentWaypointIndex + 1} / {totalWaypoints}
            </span>
          </div>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${((currentWaypointIndex + 1) / totalWaypoints) * 100}%`,
              }}
            />
          </div>

          {route.waypoints.map((wp, i) => (
            <div
              key={i}
              style={{
                ...styles.waypointItem,
                opacity: i < currentWaypointIndex ? 0.4 : 1,
              }}
            >
              <div style={{
                ...styles.wpDot,
                background: i === currentWaypointIndex
                  ? 'var(--accent)'
                  : i < currentWaypointIndex
                  ? 'var(--divider)'
                  : 'var(--surface)',
                borderColor: i === currentWaypointIndex ? 'var(--accent)' : 'var(--divider)',
              }} />
              <div style={styles.wpInfo}>
                <span style={{
                  ...styles.wpName,
                  color: i === currentWaypointIndex ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}>
                  {wp.name}
                </span>
                <span style={styles.wpDesc}>{wp.description}</span>
              </div>
            </div>
          ))}

          {/* Odometer */}
          <div style={styles.odoRow}>
            <span style={styles.odoLabel}>이동 거리</span>
            <span style={styles.odoValue}>{vehicle.odometer.toFixed(1)} km</span>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={styles.panelDivider} />
        <div style={styles.bottomActions}>
          <div style={styles.nearbyBox}>
            <span style={styles.nearbyLabel}>다음</span>
            <span style={styles.nearbyValue}>{nextLabel}</span>
          </div>
          {currentWaypointIndex < totalWaypoints - 1 ? (
            <button className="btn btn-accent" onClick={handleNextWaypoint} style={styles.nextBtn}>
              다음 경유지
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleGoHome} style={styles.nextBtn}>
              드라이브 완료
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DrivingMap({
  route,
  currentIndex,
}: {
  route: NonNullable<AppState['selectedRoute']>;
  currentIndex: number;
}) {
  const totalPoints = route.waypoints.length;
  const progress = (currentIndex + 1) / (totalPoints + 1);

  return (
    <div style={drivingMapStyles.container}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={`h${i}`} style={{ ...drivingMapStyles.gridLine, top: `${(i + 1) * 9}%`, width: '100%', height: 1 }} />
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={`v${i}`} style={{ ...drivingMapStyles.gridLine, left: `${(i + 1) * 9}%`, width: 1, height: '100%' }} />
      ))}

      <svg style={drivingMapStyles.svg} viewBox="0 0 600 500" preserveAspectRatio="none">
        <path
          d="M 300 450 C 250 400 200 350 230 290 C 260 230 320 210 300 160 C 280 110 240 90 260 50"
          fill="none"
          stroke="rgba(52,56,58,0.8)"
          strokeWidth="4"
        />
        <path
          d="M 300 450 C 250 400 200 350 230 290 C 260 230 320 210 300 160 C 280 110 240 90 260 50"
          fill="none"
          stroke="#A7C8B8"
          strokeWidth="4"
          strokeDasharray={`${progress * 800} 800`}
        />
        {route.waypoints.map((_, i) => {
          const positions = [
            { cx: 232, cy: 288 },
            { cx: 300, cy: 158 },
            { cx: 262, cy: 48 },
          ];
          const pos = positions[i] ?? { cx: 300, cy: 200 };
          return (
            <circle
              key={i}
              cx={pos.cx}
              cy={pos.cy}
              r={i === currentIndex ? 7 : 5}
              fill={i < currentIndex ? '#34383A' : i === currentIndex ? '#A7C8B8' : '#3A3E40'}
              stroke={i === currentIndex ? '#A7C8B8' : 'transparent'}
              strokeWidth={2}
            />
          );
        })}
        <circle cx="300" cy="450" r="10" fill="#D9E5E2" />
        <circle cx="300" cy="450" r="5" fill="#111315" />
      </svg>

      <div style={drivingMapStyles.arrowOverlay}>
        <span style={drivingMapStyles.arrowIcon}>↑</span>
        <span style={drivingMapStyles.arrowText}>
          {route.waypoints[currentIndex]?.name ?? route.destination} 방면
        </span>
      </div>

      <div style={drivingMapStyles.scale}>
        <div style={drivingMapStyles.scaleLine} />
        <span style={drivingMapStyles.scaleLabel}>10 km</span>
      </div>

      <div style={drivingMapStyles.mockNote}>
        지도: 실제 NaviHelper SDK 연동 시 차량 내비게이션 화면으로 대체됨
      </div>
    </div>
  );
}

const drivingMapStyles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100%',
    background: '#181B1E',
    position: 'relative',
    overflow: 'hidden',
  },
  gridLine: {
    position: 'absolute',
    background: 'rgba(52,56,58,0.4)',
  },
  svg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
  },
  arrowOverlay: {
    position: 'absolute',
    top: 24,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    background: 'rgba(28,31,34,0.95)',
    padding: '12px 24px',
  },
  arrowIcon: {
    fontSize: 28,
    color: 'var(--text-primary)',
    lineHeight: 1,
  },
  arrowText: {
    fontSize: 13,
    color: 'var(--text-secondary)',
  },
  scale: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  scaleLine: {
    width: 60,
    height: 2,
    background: 'var(--text-secondary)',
  },
  scaleLabel: {
    fontSize: 11,
    color: 'var(--text-secondary)',
  },
  mockNote: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    fontSize: 10,
    color: '#5A6063',
    maxWidth: 200,
    textAlign: 'right' as const,
    lineHeight: 1.5,
  },
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    background: 'var(--bg)',
  },
  mapSection: {
    flex: 1,
    overflow: 'hidden',
  },
  navPanel: {
    width: 320,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '1px solid var(--divider)',
    background: 'var(--bg)',
    overflow: 'hidden',
  },
  panelTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '16px 24px',
  },
  wordmark: {
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--text-secondary)',
    letterSpacing: '3px',
  },
  sdkStatus: {
    marginTop: 4,
  },
  statusMock: {
    fontSize: 10,
    color: '#5A6063',
  },
  statusLive: {
    fontSize: 10,
    color: 'var(--accent)',
  },
  stopBtn: {
    fontSize: 13,
    color: 'var(--danger)',
    padding: '8px 0',
  },
  panelDivider: {
    height: 1,
    background: 'var(--divider)',
    flexShrink: 0,
  },
  naviStatusBar: {
    padding: '8px 24px',
    background: 'var(--surface)',
  },
  naviStatusText: {
    fontSize: 11,
    letterSpacing: '0.3px',
  },
  liveRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
  },
  speedBox: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 4,
  },
  speedValue: {
    fontSize: 44,
    fontWeight: 300,
    color: 'var(--text-primary)',
    letterSpacing: '-2px',
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
  },
  speedUnit: {
    fontSize: 14,
    color: 'var(--text-secondary)',
  },
  timeBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 2,
  },
  elapsedLabel: {
    fontSize: 11,
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  elapsedValue: {
    fontSize: 20,
    fontWeight: 400,
    color: 'var(--text-primary)',
    fontVariantNumeric: 'tabular-nums',
  },
  directionBox: {
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  dirLabel: {
    fontSize: 11,
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  dirValue: {
    fontSize: 28,
    fontWeight: 300,
    color: 'var(--text-primary)',
    letterSpacing: '-1px',
  },
  dirDestination: {
    fontSize: 15,
    color: 'var(--accent)',
    marginTop: 4,
  },
  progressSection: {
    padding: '16px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    overflowY: 'auto',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 11,
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  progressCount: {
    fontSize: 13,
    color: 'var(--text-secondary)',
  },
  progressBar: {
    height: 2,
    background: 'var(--divider)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'var(--accent)',
    transition: 'width 0.5s ease',
  },
  waypointItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    paddingBottom: 10,
    borderBottom: '1px solid var(--divider)',
  },
  wpDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: 5,
    border: '1px solid',
    transition: 'all 0.3s ease',
  },
  wpInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  wpName: {
    fontSize: 14,
    fontWeight: 500,
    transition: 'color 0.3s ease',
  },
  wpDesc: {
    fontSize: 12,
    color: 'var(--text-secondary)',
    lineHeight: 1.4,
  },
  odoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  odoLabel: {
    fontSize: 11,
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  odoValue: {
    fontSize: 15,
    fontWeight: 500,
    color: 'var(--text-primary)',
    fontVariantNumeric: 'tabular-nums',
  },
  bottomActions: {
    padding: '16px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  nearbyBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nearbyLabel: {
    fontSize: 11,
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  nearbyValue: {
    fontSize: 14,
    color: 'var(--accent)',
    fontWeight: 500,
  },
  nextBtn: {
    width: '100%',
    padding: '18px',
    fontSize: 16,
    borderRadius: 0,
  },
};
