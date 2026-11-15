/**
 * usePleosVehicle — Pleos Vehicle SDK / Mock Fallback Hook
 *
 * SDK 대응:
 *   - DrivingMode: ai.pleos.playground.vehicle.api.DrivingMode
 *   - 차속: Android CarPropertyManager (PERF_VEHICLE_SPEED)
 *   - 주행 거리: ai.pleos.playground.vehicle.api.Odometer
 *
 * 권한: pleos.car.permission.CAR_DRIVE
 *
 * Mock 모드:
 *   Pleos Vehicle Bridge가 없으면 시뮬레이션 값을 사용합니다.
 *   드라이브 진행 화면의 속도계, 주행 거리, 모드 감지에 활용됩니다.
 */
import { useState, useEffect, useRef } from 'react';
import { getVehicleStatus, isPleosEnvironment, type VehicleStatus, type DrivingMode } from '../lib/pleosBridge';

export interface UseVehicleState extends VehicleStatus {
  elapsedSeconds: number;
  isMock: boolean;
}

/** 폴링 간격 (ms) — 실제 SDK는 콜백 기반이므로 Bridge 환경에서는 폴링 불필요 */
const POLL_INTERVAL = 1000;

export function usePleosVehicle(isActive: boolean) {
  const [state, setState] = useState<UseVehicleState>({
    drivingMode: 'UNKNOWN',
    speed: 0,
    odometer: 0,
    source: 'mock',
    elapsedSeconds: 0,
    isMock: true,
  });

  const elapsedRef = useRef(0);
  const mockSpeedRef = useRef(68);

  useEffect(() => {
    if (!isActive) return;

    const isPleos = isPleosEnvironment();

    const tick = () => {
      elapsedRef.current += 1;

      if (isPleos) {
        // ── Pleos Vehicle SDK 환경 ──────────────────────────────
        const status = getVehicleStatus();
        setState(_prev => ({
          ...status,
          elapsedSeconds: elapsedRef.current,
          isMock: false,
          // drivingMode가 PARKED이면 속도 0
          speed: status.drivingMode === 'PARKED' ? 0 : status.speed,
        }));
      } else {
        // ── Mock 시뮬레이션 ─────────────────────────────────────
        // 실제 차속 대신 랜덤 변화로 주행 시뮬레이션
        mockSpeedRef.current = Math.max(
          40,
          Math.min(110, mockSpeedRef.current + (Math.random() - 0.5) * 8)
        );

        setState(prev => ({
          drivingMode: 'DRIVING' as DrivingMode,
          speed: mockSpeedRef.current,
          // 모의 주행 거리: 속도(km/h) × 1초 → km
          odometer: prev.odometer + mockSpeedRef.current / 3600,
          source: 'mock',
          elapsedSeconds: elapsedRef.current,
          isMock: true,
        }));
      }
    };

    const timer = setInterval(tick, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [isActive]);

  return state;
}
