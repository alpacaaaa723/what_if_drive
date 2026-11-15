import type { AppState, DriveRoute } from '../types';

interface Props {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  handleGoHome: () => void;
  handleGoBack: () => void;
  onSelectRoute: (route: DriveRoute) => void;
}

export default function RecommendScreen({ state, handleGoHome, handleGoBack, onSelectRoute }: Props) {
  const routes = state.recommendedRoutes;

  return (
    <div style={styles.container}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <button className="btn btn-ghost" onClick={handleGoBack} style={styles.backBtn}>
          ← 돌아가기
        </button>
        <div style={styles.topCenter}>
          <div style={styles.wordmark}>WHAT IF DRIVE</div>
          <div style={styles.topTitle}>AI 추천 코스</div>
        </div>
        <button className="btn btn-ghost" onClick={handleGoHome} style={styles.homeBtn}>
          처음으로
        </button>
      </div>

      <div style={styles.divider} />

      {/* Route list */}
      <div style={styles.routeList}>
        {routes.map((route, index) => (
          <RouteCard
            key={route.id}
            route={route}
            index={index}
            onSelect={() => onSelectRoute(route)}
          />
        ))}
      </div>
    </div>
  );
}

function RouteCard({
  route,
  index,
  onSelect,
}: {
  route: DriveRoute;
  index: number;
  onSelect: () => void;
}) {
  return (
    <div style={styles.routeCard} onClick={onSelect}>
      {/* Image section */}
      <div style={styles.imageWrap}>
        <img src={route.imageUrl} alt={route.name} style={styles.routeImage} />
        <div style={styles.imageOverlay} />
        <div style={styles.indexBadge}>{String(index + 1).padStart(2, '0')}</div>
      </div>

      {/* Info section */}
      <div style={styles.routeInfo}>
        <div style={styles.routeNameRow}>
          <div>
            <div style={styles.routeName}>{route.name}</div>
            <div style={styles.routeTagline}>{route.tagline}</div>
          </div>
        </div>

        <div style={styles.routeMeta}>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>소요 시간</span>
            <span style={styles.metaValue}>{route.totalDuration}</span>
          </div>
          <div style={styles.metaVertDivider} />
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>이동 거리</span>
            <span style={styles.metaValue}>{route.totalDistance}</span>
          </div>
          <div style={styles.metaVertDivider} />
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>도착지</span>
            <span style={styles.metaValue}>{route.destination}</span>
          </div>
        </div>

        <div style={styles.routeReason}>{route.reason}</div>

        <div style={styles.waypointRow}>
          {route.waypoints.map((wp, i) => (
            <span key={i} style={styles.waypointChip}>{wp.name}</span>
          ))}
        </div>
      </div>

      {/* Select arrow */}
      <div style={styles.selectArrow}>→</div>
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
    padding: '16px 48px',
    flexShrink: 0,
  },
  backBtn: {
    fontSize: 15,
    color: 'var(--text-secondary)',
    padding: '10px 0',
    minWidth: 100,
    justifyContent: 'flex-start',
  },
  homeBtn: {
    fontSize: 15,
    color: 'var(--text-secondary)',
    padding: '10px 0',
    minWidth: 100,
    justifyContent: 'flex-end',
  },
  topCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  wordmark: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-secondary)',
    letterSpacing: '4px',
  },
  topTitle: {
    fontSize: 20,
    fontWeight: 500,
    color: 'var(--text-primary)',
    letterSpacing: '-0.3px',
  },
  divider: {
    width: '100%',
    height: 1,
    background: 'var(--divider)',
    flexShrink: 0,
  },
  routeList: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  routeCard: {
    display: 'flex',
    alignItems: 'stretch',
    borderBottom: '1px solid var(--divider)',
    cursor: 'pointer',
    flex: 1,
    transition: 'background 0.12s ease',
    minHeight: 0,
  },
  imageWrap: {
    width: 220,
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  routeImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to right, transparent, rgba(17,19,21,0.4))',
  },
  indexBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    fontSize: 32,
    fontWeight: 300,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: '-1px',
    lineHeight: 1,
  },
  routeInfo: {
    flex: 1,
    padding: '28px 36px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 12,
    minWidth: 0,
  },
  routeNameRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  routeName: {
    fontSize: 20,
    fontWeight: 500,
    color: 'var(--text-primary)',
    letterSpacing: '-0.4px',
    lineHeight: 1.3,
  },
  routeTagline: {
    fontSize: 14,
    color: 'var(--text-secondary)',
    marginTop: 4,
  },
  routeMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  metaLabel: {
    fontSize: 11,
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 16,
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  metaVertDivider: {
    width: 1,
    height: 32,
    background: 'var(--divider)',
  },
  routeReason: {
    fontSize: 14,
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  waypointRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  waypointChip: {
    fontSize: 12,
    color: 'var(--accent)',
    border: '1px solid var(--accent)',
    padding: '3px 10px',
    opacity: 0.8,
  },
  selectArrow: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 32px',
    fontSize: 22,
    color: 'var(--text-secondary)',
    flexShrink: 0,
  },
};
