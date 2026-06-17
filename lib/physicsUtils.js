// lib/physicsUtils.js

/**
 * Format telemetry data for display
 * @param {Object} data - Telemetry data object
 * @returns {Object} Formatted telemetry with rounded values
 */
export function formatTelemetry(data) {
  const format = (val, decimals = 2) => {
    if (val === undefined || val === null || !isFinite(val)) return '—';
    return Number(val.toFixed(decimals));
  };

  return {
    time: format(data.time),
    speed: format(data.speed),
    position: {
      x: format(data.position?.x),
      y: format(data.position?.y),
      z: format(data.position?.z),
    },
    maxHeight: format(data.maxHeight),
    totalRange: format(data.totalRange),
    flightTime: format(data.flightTime),
  };
}

/**
 * Calculate distance between two 3D points
 */
export function calculateDistance(p1, p2) {
  return Math.sqrt(
    Math.pow(p2.x - p1.x, 2) +
    Math.pow(p2.y - p1.y, 2) +
    Math.pow(p2.z - p1.z, 2)
  );
}

/**
 * Clamp a value between min and max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Convert degrees to radians
 */
export function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
export function radToDeg(radians) {
  return radians * (180 / Math.PI);
}