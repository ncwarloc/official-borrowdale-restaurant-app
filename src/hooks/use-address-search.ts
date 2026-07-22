import * as Location from 'expo-location';
import { useRef, useState } from 'react';

export type Coords = { lat: number; lng: number };
export type GeoStatus = 'idle' | 'locating' | 'resolved' | 'error';
export type NominatimResult = { display_name: string; lat: string; lon: string };

const SUGGEST_DEBOUNCE_MS = 450;

/** Shared GPS + OpenStreetMap Nominatim address lookup, used by any screen
 * that needs to resolve a free-text address to coordinates (Checkout's
 * delivery address, Profile's saved-address form). */
export function useAddressSearch() {
  const [text, setText] = useState('');
  const [coords, setCoords] = useState<Coords | null>(null);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('idle');
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const useCurrentLocation = async () => {
    setGeoStatus('locating');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGeoStatus('error');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude: lat, longitude: lng } = pos.coords;
      setCoords({ lat, lng });
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        );
        const data = await res.json();
        setText(data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      } catch {
        setText(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      }
      setGeoStatus('resolved');
    } catch {
      setGeoStatus('error');
    }
  };

  const handleTextChange = (v: string) => {
    setText(v);
    setGeoStatus('idle');
    setCoords(null);
    if (suggestTimer.current) clearTimeout(suggestTimer.current);
    if (v.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    suggestTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=zw&q=${encodeURIComponent(v)}`,
        );
        const data = await res.json();
        setSuggestions(data || []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    }, SUGGEST_DEBOUNCE_MS);
  };

  const selectSuggestion = (s: NominatimResult) => {
    setText(s.display_name);
    setCoords({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) });
    setGeoStatus('resolved');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const selectPreset = (address: string, presetCoords: Coords) => {
    setText(address);
    setCoords(presetCoords);
    setGeoStatus('resolved');
  };

  const reset = () => {
    setText('');
    setCoords(null);
    setGeoStatus('idle');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return {
    text,
    coords,
    geoStatus,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    useCurrentLocation,
    handleTextChange,
    selectSuggestion,
    selectPreset,
    reset,
  };
}
