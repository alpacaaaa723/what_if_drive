/**
 * usePleosLocation — Pleos FusedLocation SDK / 브라우저 Geolocation Hook
 *
 * SDK: ai.pleos.playground:FusedLocation:1.1.3
 * 권한: pleos.car.permission.FUSED_LOCATION
 */
import { useState, useEffect } from 'react';
import { getCurrentLocation, isPleosEnvironment, type LocationResult } from '../lib/pleosBridge';

export interface UseLocationState {
  location: LocationResult | null;
  isLoading: boolean;
  error: string | null;
  isPleos: boolean;
}

export function usePleosLocation() {
  const [state, setState] = useState<UseLocationState>({
    location: null,
    isLoading: true,
    error: null,
    isPleos: false,
  });

  useEffect(() => {
    setState(s => ({ ...s, isLoading: true }));

    getCurrentLocation()
      .then(loc => {
        setState({
          location: loc,
          isLoading: false,
          error: null,
          isPleos: isPleosEnvironment(),
        });
      })
      .catch(err => {
        setState({
          location: null,
          isLoading: false,
          error: String(err),
          isPleos: false,
        });
      });
  }, []);

  return state;
}
