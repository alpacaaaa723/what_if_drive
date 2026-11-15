import type { AppState } from '../types';

interface Props {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  handleGoHome: () => void;
  handleGoBack: () => void;
  onStartDrive: () => void;
}

const WAYPOINT_ICONS: Record<string, string> = {
  scenic: '🔭',
  rest: '🛑',
  cafe: '☕',
  landmark: '🏛️',
};

export default function DetailScreen({ state, handleGoBack, handleGoHome, onStartDrive }: Props) {
  const route = state.selectedRoute;
  if (!route) return null;

  return (
    <div style={styles.container}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <button className="btn btn-ghost" onClick={handleGoBack} style={styles.navBtn}>
          ← 다른 코스 보기
        </button>
        <div style={styles.wordmark}>WHAT IF DRIVE</div>
        <button className="btn btn-ghost" onClick={handleGoHome} style={{ ...styles.navBtn, textAlign: 'right' }}>
          처음으로
        </button>
      </div>

      <div style={styles.divider} />

      {/* Main layout: map left, info right */}
      <div style={styles.main}>
        {/* Map placeholder (left) */}
        <div style={styles.mapSection}>
          <MapPlaceholder route={route} />
        </div>

        {/* Route details (right) */}
        <div style={styles.infoSection}>
          {/* Route header */}
          <div style={styles.routeHeader}>
            <div style={styles.routeName}>{route.name}</div>
            <div style={styles.routeTagline}>{route.tagline}</div>
          </div>

          <div style={styles.sectionDivider} />

          {/* Stats row */}
          <div style={styles.statsRow}>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>총 소요 시간</span>
              <span style={styles.statValue}>{route.totalDuration}</span>
            </div>
            <div style={styles.statVertDivider} />
            <div style={styles.statItem}>
              <span style={styles.statLabel}>이동 거리</span>
              <span style={styles.statValue}>{route.totalDistance}</span>
            </div>
          </div>

          <div style={styles.sectionDivider} />

          {/* Waypoints */}
          <div style={styles.waypointsSection}>
            {/* Departure */}
            <div style={styles.waypointRow}>
              <div style={styles.waypointDot} />
              <div style={styles.waypointInfo}>
                <span style={styles.waypointType}>출발</span>
                <span style={styles.waypointName}>{route.departure}</span>
              </div>
            </div>

            {route.waypoints.map((wp, i) => (
              <div key={i}>
                <div style={styles.waypointConnector} />
                <div style={styles.waypointRow}>
                  <div style={styles.waypointDotSmall}>
                    <span style={{ fontSize: 11 }}>{WAYPOINT_ICONS[wp.type]}</span>
                  </div>
                  <div style={styles.waypointInfo}>
                    <div style={styles.waypointNameRow}>
                      <span style={styles.waypointName}>{wp.name}</span>
                      <span style={styles.waypointDuration}>{wp.duration}</span>
                    </div>
                    <span style={styles.waypointDesc}>{wp.description}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Destination */}
            <div style={styles.waypointConnector} />
            <div style={styles.waypointRow}>
              <div style={{ ...styles.waypointDot, background: 'var(--accent)' }} />
              <div style={styles.waypointInfo}>
                <span style={styles.waypointType}>도착</span>
                <span style={{ ...styles.waypointName, color: 'var(--accent)' }}>{route.destination}</span>
              </div>
            </div>
          </div>

          <div style={styles.sectionDivider} />

          {/* Reason */}
          <div style={styles.reasonBox}>
            <div style={styles.reasonLabel}>AI 추천 이유</div>
            <div style={styles.reasonText}>{route.reason}</div>
          </div>

          {/* Action buttons */}
          <div style={styles.actionRow}>
            <button className="btn btn-secondary" onClick={handleGoBack} style={styles.changeBtn}>
              코스 변경
            </button>
            <button className="btn btn-primary" onClick={onStartDrive} style={styles.startBtn}>
              내비게이션 시작
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MapPlaceholder({ route }: { route: NonNullable<AppState['selectedRoute']> }) {
  return (
    <div style={mapStyles.container}>
      {/* Simulated map background */}
      <div style={mapStyles.mapBg}>
        {/* Grid lines */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`h${i}`} style={{ ...mapStyles.gridLine, top: `${(i + 1) * 11}%`, width: '100%', height: 1 }} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`v${i}`} style={{ ...mapStyles.gridLine, left: `${(i + 1) * 11}%`, width: 1, height: '100%' }} />
        ))}

        {/* Simulated route path */}
        <svg style={mapStyles.svg} viewBox="0 0 400 500" preserveAspectRatio="none">
          <path
            d="M 200 460 C 160 420 120 380 140 320 C 160 260 220 240 200 180 C 180 120 140 100 160 60"
            fill="none"
            stroke="#A7C8B8"
            strokeWidth="3"
            strokeDasharray="8,5"
          />
          {/* Waypoint dots on path */}
          <circle cx="200" cy="460" r="6" fill="#D9E5E2" />
          <circle cx="145" cy="315" r="5" fill="#A7C8B8" opacity="0.8" />
          <circle cx="200" cy="178" r="5" fill="#A7C8B8" opacity="0.8" />
          <circle cx="162" cy="60" r="7" fill="#A7C8B8" />
        </svg>

        {/* Labels */}
        <div style={{ ...mapStyles.mapLabel, bottom: 70, left: '50%', transform: 'translateX(-50%)' }}>
          현재 위치
        </div>
        <div style={{ ...mapStyles.mapLabel, top: 40, left: '45%' }}>
          {route.destination}
        </div>

        {/* Waypoint labels */}
        {route.waypoints.map((wp, i) => (
          <div
            key={i}
            style={{
              ...mapStyles.waypointLabel,
              top: `${[38, 56, 74][i] ?? 50}%`,
              left: `${[55, 60, 55][i] ?? 55}%`,
            }}
          >
            {wp.name}
          </div>
        ))}

        {/* Map info overlay */}
        <div style={mapStyles.infoOverlay}>
          <span style={mapStyles.infoText}>지도 미리보기</span>
          <span style={mapStyles.infoNote}>실제 지도 API 미연결</span>
        </div>
      </div>
    </div>
  );
}

const mapStyles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    background: '#181B1E',
  },
  mapBg: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    background: 'rgba(52,56,58,0.5)',
  },
  svg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
  },
  mapLabel: {
    position: 'absolute',
    fontSize: 11,
    color: 'var(--text-primary)',
    background: 'rgba(28,31,34,0.9)',
    padding: '4px 10px',
    whiteSpace: 'nowrap' as const,
  },
  waypointLabel: {
    position: 'absolute',
    fontSize: 10,
    color: 'var(--accent)',
    background: 'rgba(28,31,34,0.85)',
    padding: '3px 8px',
    whiteSpace: 'nowrap' as const,
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 2,
  },
  infoText: {
    fontSize: 11,
    color: 'var(--text-secondary)',
  },
  infoNote: {
    fontSize: 10,
    color: '#5A6063',
  },
};

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
    padding: '16px 48px',
    flexShrink: 0,
  },
  navBtn: {
    fontSize: 15,
    color: 'var(--text-secondary)',
    padding: '10px 0',
    minWidth: 120,
  },
  wordmark: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-secondary)',
    letterSpacing: '4px',
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
    minHeight: 0,
  },
  mapSection: {
    flex: 1,
    borderRight: '1px solid var(--divider)',
    overflow: 'hidden',
  },
  infoSection: {
    width: 440,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    padding: '28px 36px',
    gap: 16,
    overflowY: 'auto',
  },
  routeHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  routeName: {
    fontSize: 22,
    fontWeight: 500,
    color: 'var(--text-primary)',
    letterSpacing: '-0.5px',
    lineHeight: 1.3,
  },
  routeTagline: {
    fontSize: 14,
    color: 'var(--text-secondary)',
  },
  sectionDivider: {
    height: 1,
    background: 'var(--divider)',
  },
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 24,
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  statLabel: {
    fontSize: 11,
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  statVertDivider: {
    width: 1,
    height: 36,
    background: 'var(--divider)',
  },
  waypointsSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  waypointRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
  },
  waypointDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: 'var(--primary)',
    flexShrink: 0,
    marginTop: 4,
  },
  waypointDotSmall: {
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--surface)',
    flexShrink: 0,
    marginLeft: -7,
  },
  waypointConnector: {
    width: 1,
    height: 16,
    background: 'var(--divider)',
    marginLeft: 4,
    marginBottom: 4,
    marginTop: 4,
  },
  waypointInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    paddingBottom: 4,
  },
  waypointType: {
    fontSize: 11,
    color: 'var(--text-secondary)',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
  },
  waypointNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  waypointName: {
    fontSize: 15,
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  waypointDuration: {
    fontSize: 12,
    color: 'var(--text-secondary)',
  },
  waypointDesc: {
    fontSize: 13,
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  reasonBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    flex: 1,
  },
  reasonLabel: {
    fontSize: 11,
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  reasonText: {
    fontSize: 14,
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
  },
  actionRow: {
    display: 'flex',
    gap: 12,
    marginTop: 'auto',
    paddingTop: 8,
  },
  changeBtn: {
    flex: 1,
    padding: '16px',
    fontSize: 15,
    borderRadius: 0,
  },
  startBtn: {
    flex: 2,
    padding: '16px',
    fontSize: 17,
    borderRadius: 0,
  },
};
