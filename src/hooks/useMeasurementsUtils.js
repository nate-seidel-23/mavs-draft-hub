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
    // Red:   rgb(183,28,28)
    // White: rgb(255,255,255)
    // Green: rgb(56,142,60)
    if (percentile <= 50) {
      // Interpolate from red to white
      const t = percentile / 50;
      const r = Math.round(183 + (255 - 183) * t);
      const g = Math.round(28 + (255 - 28) * t);
      const b = Math.round(28 + (255 - 28) * t);
      return `rgb(${r},${g},${b})`;
    } else {
      // Interpolate from white to green
      const t = (percentile - 50) / 50;
      const r = Math.round(255 + (56 - 255) * t);
      const g = Math.round(255 + (142 - 255) * t);
      const b = Math.round(255 + (60 - 255) * t);
      return `rgb(${r},${g},${b})`;
    }
  }

  return { getPercentile, getBarColor };
}
