/**
 * Pleos SDK Bridge Layer
 * ─────────────────────────────────────────────────────────────
 * 이 파일은 Pleos Playground SDK와 웹 UI 사이의 추상화 레이어입니다.
 *
 * 실행 환경에 따라 자동으로 분기합니다:
 *   1. Android WebView (Pleos Connect 탑재 차량)
 *      → window.PleosLocationBridge / PleosNaviBridge / PleosVehicleBridge 호출
 *   2. 브라우저 (개발/시연 환경)
 *      → navigator.geolocation 또는 Mock Data fallback
 *
 * SDK 공식 문서: https://document.pleos.ai
 * SDK Maven: https://nexus-playground.pleos.ai/repository/maven-releases/
 */

// ────────────────────────────────────────────────────────────────────────────
// 타입 정의: Android WebView에서 주입하는 Bridge 인터페이스
// ────────────────────────────────────────────────────────────────────────────

/** FusedLocation SDK Bridge (ai.pleos.playground:FusedLocation:1.1.3) */
interface PleosLocationBridgeInterface {
  /** fusedLocation.getLastKnownLocation() 결과 반환 (JSON 직렬화) */
  getLastKnownLocation(): string; // JSON: LocationData { lat, lng, address }
  /** fusedLocation.isSupported() */
  isSupported(): boolean;
}

/** NaviHelper SDK Bridge */
interface PleosNaviBridgeInterface {
  /**
   * naviHelper.requestRouteWithWaypoints() 래핑
   * @param routeJson RouteWithWaypointsRequest JSON 직렬화
   */
  requestRouteWithWaypoints(routeJson: string): void;
  /**
   * naviHelper.addWaypoint() 래핑
   * @param waypointJson RequestWaypointInfo JSON 직렬화
   */
  addWaypoint(waypointJson: string): void;
  /** naviHelper.removeWaypoint() 래핑 */
  removeWaypoint(index: number): void;
  /** naviHelper.cancelRoute() */
  cancelRoute(): void;
}

/** Vehicle SDK Bridge (DrivingMode + CarPropertyManager) */
interface PleosVehicleBridgeInterface {
  /** DrivingMode.getCurrentDrivingModeState() */
  getDrivingMode(): 'PARKED' | 'DRIVING' | 'UNKNOWN';
  /**
   * CarPropertyManager.getFloatProperty(PERF_VEHICLE_SPEED)
   * @returns km/h
   */
  getSpeed(): number;
  /** Odometer.registerDistanceDriven() 최신 값 */
  getOdometer(): number; // km
}

declare global {
  interface Window {
    PleosLocationBridge?: PleosLocationBridgeInterface;
    PleosNaviBridge?: PleosNaviBridgeInterface;
    PleosVehicleBridge?: PleosVehicleBridgeInterface;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// 환경 감지
// ────────────────────────────────────────────────────────────────────────────

/** Pleos Android WebView 환경인지 확인 */
export const isPleosEnvironment = (): boolean => {
  return typeof window !== 'undefined' &&
    (!!window.PleosLocationBridge || !!window.PleosNaviBridge || !!window.PleosVehicleBridge);
};

// ────────────────────────────────────────────────────────────────────────────
// Location API
// ────────────────────────────────────────────────────────────────────────────

export interface LocationResult {
  latitude: number;
  longitude: number;
  address: string;
  source: 'pleos-sdk' | 'browser-geolocation' | 'mock';
}

/**
 * 현재 위치를 가져옵니다.
 *
 * 우선순위:
 *   1. Pleos FusedLocation SDK (Android WebView)
 *   2. 브라우저 Geolocation API (개발 환경)
 *   3. Mock fallback (위치 접근 불가)
 *
 * SDK 대응: ai.pleos.playground.location.fused.FusedLocation
 * 권한: pleos.car.permission.FUSED_LOCATION
 */
export async function getCurrentLocation(): Promise<LocationResult> {
  // 1. Pleos FusedLocation SDK
  if (window.PleosLocationBridge?.isSupported()) {
    try {
      const raw = window.PleosLocationBridge.getLastKnownLocation();
      const data = JSON.parse(raw) as { lat: number; lng: number; address: string };
      return {
        latitude: data.lat,
        longitude: data.lng,
        address: data.address,
        source: 'pleos-sdk',
      };
    } catch (err) {
      console.error('[PleosLocationBridge] getLastKnownLocation 실패:', err);
    }
  }

  // 2. 브라우저 Geolocation API
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          maximumAge: 30000,
        })
      );
      return {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        address: `위도 ${pos.coords.latitude.toFixed(4)}, 경도 ${pos.coords.longitude.toFixed(4)}`,
        source: 'browser-geolocation',
      };
    } catch (err) {
      console.warn('[Geolocation] 위치 접근 실패:', err);
    }
  }

  // 3. Mock fallback
  return {
    latitude: 37.5172,
    longitude: 127.0473,
    address: '서울시 강남구 테헤란로',
    source: 'mock',
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Navigation API
// ────────────────────────────────────────────────────────────────────────────

export interface RouteDestination {
  latitude: number;
  longitude: number;
  poiName: string;
  poiId?: string;
  address: string;
}

export interface RouteWaypoint extends RouteDestination {
  waypointIndex: 0 | 1; // WaypointIndex.FIRST | WaypointIndex.SECOND
}

export interface StartNavigationResult {
  success: boolean;
  method: 'pleos-navi-sdk' | 'mock';
  message: string;
}

/**
 * 경유지 포함 내비게이션 경로를 시작합니다.
 *
 * SDK 대응:
 *   naviHelper.requestRouteWithWaypoints(RouteWithWaypointsRequest)
 *   - destination: RouteInfo
 *   - waypoints: listOf(RequestWaypointInfo)
 *
 * 최대 경유지 수: 2개 (Pleos NaviHelper SDK 제한)
 */
export function startNavigation(
  destination: RouteDestination,
  waypoints: RouteWaypoint[]
): StartNavigationResult {
  if (window.PleosNaviBridge) {
    try {
      const payload = JSON.stringify({ destination, waypoints });
      window.PleosNaviBridge.requestRouteWithWaypoints(payload);
      return {
        success: true,
        method: 'pleos-navi-sdk',
        message: '내비게이션이 시작되었습니다.',
      };
    } catch (err) {
      console.error('[PleosNaviBridge] requestRouteWithWaypoints 실패:', err);
      return {
        success: false,
        method: 'mock',
        message: `NaviHelper SDK 오류: ${String(err)}`,
      };
    }
  }

  // Mock fallback (브라우저 개발 환경)
  console.info('[Mock] startNavigation 호출됨 (Pleos NaviHelper SDK 미연결):', {
    destination,
    waypoints,
  });
  return {
    success: true,
    method: 'mock',
    message: 'Mock 내비게이션 (Pleos NaviHelper SDK 미연결)',
  };
}

/**
 * 경유지를 개별 추가합니다.
 * SDK 대응: naviHelper.addWaypoint(RequestWaypointInfo)
 */
export function addWaypoint(waypoint: RouteWaypoint): boolean {
  if (window.PleosNaviBridge) {
    try {
      window.PleosNaviBridge.addWaypoint(JSON.stringify(waypoint));
      return true;
    } catch (err) {
      console.error('[PleosNaviBridge] addWaypoint 실패:', err);
      return false;
    }
  }
  console.info('[Mock] addWaypoint:', waypoint);
  return true;
}

/**
 * 경유지를 제거합니다.
 * SDK 대응: naviHelper.removeWaypoint(WaypointIndex)
 */
export function removeWaypoint(index: 0 | 1): boolean {
  if (window.PleosNaviBridge) {
    try {
      window.PleosNaviBridge.removeWaypoint(index);
      return true;
    } catch (err) {
      console.error('[PleosNaviBridge] removeWaypoint 실패:', err);
      return false;
    }
  }
  console.info('[Mock] removeWaypoint index:', index);
  return true;
}

/**
 * 경로를 취소합니다.
 * SDK 대응: naviHelper.cancelRoute()
 */
export function cancelRoute(): void {
  if (window.PleosNaviBridge) {
    try {
      window.PleosNaviBridge.cancelRoute();
    } catch (err) {
      console.error('[PleosNaviBridge] cancelRoute 실패:', err);
    }
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Vehicle Status API
// ────────────────────────────────────────────────────────────────────────────

export type DrivingMode = 'PARKED' | 'DRIVING' | 'UNKNOWN';

export interface VehicleStatus {
  drivingMode: DrivingMode;
  speed: number;    // km/h
  odometer: number; // km
  source: 'pleos-vehicle-sdk' | 'mock';
}

/**
 * 차량 상태를 가져옵니다.
 *
 * SDK 대응:
 *   - 주행 모드: DrivingMode.getCurrentDrivingModeState() (Vehicle SDK)
 *   - 차속: CarPropertyManager.getFloatProperty(PERF_VEHICLE_SPEED) × 3.6 → km/h
 *   - 주행 거리: Odometer.registerDistanceDriven() (Vehicle SDK)
 *
 * 권한: pleos.car.permission.CAR_DRIVE
 */
export function getVehicleStatus(): VehicleStatus {
  if (window.PleosVehicleBridge) {
    try {
      return {
        drivingMode: window.PleosVehicleBridge.getDrivingMode(),
        speed: window.PleosVehicleBridge.getSpeed(),
        odometer: window.PleosVehicleBridge.getOdometer(),
        source: 'pleos-vehicle-sdk',
      };
    } catch (err) {
      console.error('[PleosVehicleBridge] 차량 상태 조회 실패:', err);
    }
  }

  // Mock fallback
  return {
    drivingMode: 'UNKNOWN',
    speed: 0,
    odometer: 0,
    source: 'mock',
  };
}
