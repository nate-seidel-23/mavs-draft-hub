// src/hooks/useMeasurementsUtils.js
import data from '../data/intern_project_data.json';

export function useMeasurementsUtils() {
  function getPercentile(key, value) {
    const values = data.measurements
      .map(m => m[key])
      .filter(v => v != null)
      .sort((a, b) => a - b);
    if (!values.length || value == null) return null;
    const rank = values.findIndex(v => value <= v);
    return rank === -1
      ? 100
      : Math.round((rank / values.length) * 100);
  }

  function getBarColor(percentile) {
    if (percentile <= 50) {
      const t = percentile / 50;
      const r = Math.round(21 + (255 - 21) * t);
      const g = Math.round(101 + (255 - 101) * t);
      const b = Math.round(192 + (255 - 192) * t);
      return `rgb(${r},${g},${b})`;
    } else {
      const t = (percentile - 50) / 50;
      const r = Math.round(255 + (183 - 255) * t);
      const g = Math.round(255 + (28 - 255) * t);
      const b = Math.round(255 + (28 - 255) * t);
      return `rgb(${r},${g},${b})`;
    }
  }

  return { getPercentile, getBarColor };
}
