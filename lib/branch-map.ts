import mapData from "./iraq-map.json";
import type { Branch } from "./branches";

export const MAP_WIDTH = mapData.projection.width;
export const MAP_HEIGHT = mapData.projection.height;
export const MAX_MAP_ZOOM = 32;
export const INITIAL_MAP_VIEW = { x: 0, y: 0, zoom: 1 };
export type MapView = typeof INITIAL_MAP_VIEW;
export type MapPoint = { x: number; y: number };
export type MapMarker = MapPoint & { branches: Branch[] };
export type ScreenMarker = MapMarker & { anchorX: number; anchorY: number };

export function projectLocation({ lat, lng }: Branch["coordinates"]): MapPoint {
  const mercator = (latitude: number) =>
    (Math.log(Math.tan(Math.PI / 4 + (latitude * Math.PI) / 360)) * 180) / Math.PI;
  const { centerLng, centerLat, scale } = mapData.projection;
  return {
    x: (lng - centerLng) * scale + MAP_WIDTH / 2,
    y: (mercator(centerLat) - mercator(lat)) * scale + MAP_HEIGHT / 2,
  };
}

export function clusterBranches(items: Branch[], view: MapView, canvasScale: number): MapMarker[] {
  const groups: MapMarker[] = [];
  for (const branch of items) {
    const point = projectLocation(branch.coordinates);
    const group = groups.find(
      (candidate) =>
        candidate.branches[0].city === branch.city &&
        Math.hypot(point.x - candidate.x, point.y - candidate.y) * view.zoom * canvasScale < 46,
    );
    if (group) {
      group.x = (group.x * group.branches.length + point.x) / (group.branches.length + 1);
      group.y = (group.y * group.branches.length + point.y) / (group.branches.length + 1);
      group.branches.push(branch);
    } else groups.push({ ...point, branches: [branch] });
  }
  return groups;
}

// Nearby cities remain individually selectable at the national scale. Move only
// the button, keeping its geographic anchor visible through a short leader line.
export function spreadMarkers(markers: ScreenMarker[], width: number, height: number) {
  const placed: ScreenMarker[] = [];
  for (const marker of markers) {
    if (marker.x < 20 || marker.x > width - 20 || marker.y < 30 || marker.y > height - 40) continue;
    let position = marker;
    const available = (x: number, y: number) =>
      x >= 25 &&
      x <= width - 25 &&
      y >= 35 &&
      y <= height - 45 &&
      placed.every((other) => Math.hypot(x - other.x, y - other.y) >= 56);
    if (!available(marker.x, marker.y)) {
      search: for (let radius = 12; radius <= 120; radius += 12) {
        for (let step = 0; step < 12; step++) {
          const angle = (step * Math.PI) / 6;
          const x = marker.x + Math.cos(angle) * radius;
          const y = marker.y + Math.sin(angle) * radius;
          if (available(x, y)) {
            position = { ...marker, x, y };
            break search;
          }
        }
      }
    }
    placed.push(position);
  }
  return placed;
}

export function fitBranches(items: Branch[], minimumZoom = 1): MapView {
  if (!items.length) return INITIAL_MAP_VIEW;
  const points = items.map((branch) => projectLocation(branch.coordinates));
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs),
    maxX = Math.max(...xs);
  const minY = Math.min(...ys),
    maxY = Math.max(...ys);
  const zoom = Math.min(
    MAX_MAP_ZOOM,
    Math.max(
      minimumZoom,
      Math.min(MAP_WIDTH / (maxX - minX + 24), MAP_HEIGHT / (maxY - minY + 24)) * 0.65,
    ),
  );
  return {
    zoom,
    x: MAP_WIDTH / 2 - ((minX + maxX) / 2) * zoom,
    y: MAP_HEIGHT / 2 - ((minY + maxY) / 2) * zoom,
  };
}

export function nearestBranch(
  location: Branch["coordinates"],
  items: Branch[],
): Branch | undefined {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const distance = (branch: Branch) => {
    const lat = radians(branch.coordinates.lat - location.lat);
    const lng = radians(branch.coordinates.lng - location.lng);
    return (
      Math.sin(lat / 2) ** 2 +
      Math.cos(radians(location.lat)) *
        Math.cos(radians(branch.coordinates.lat)) *
        Math.sin(lng / 2) ** 2
    );
  };
  return items.reduce<Branch | undefined>(
    (closest, branch) => (!closest || distance(branch) < distance(closest) ? branch : closest),
    undefined,
  );
}
