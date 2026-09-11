import fs from "node:fs/promises";

// Public-domain Natural Earth vector data. This is a build-time utility only;
// the website renders the committed subset without a tile server or API key.
const source = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/";
const names = [
  "ne_50m_admin_0_countries",
  "ne_10m_admin_1_states_provinces_lines",
  "ne_50m_rivers_lake_centerlines",
  "ne_50m_lakes",
];
const datasets = await Promise.all(
  names.map(async (name) => {
    if (process.env.MAP_SOURCE_DIR) {
      return JSON.parse(await fs.readFile(`${process.env.MAP_SOURCE_DIR}/${name}.json`, "utf8"));
    }
    const response = await fetch(`${source}${name}.geojson`);
    if (!response.ok) throw new Error(`Map source ${name}: ${response.status}`);
    return response.json();
  }),
);
const projection = { width: 800, height: 760, centerLng: 43.8, centerLat: 33.2, scale: 64 };
const mercator = (lat) => (Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180) / Math.PI;
const project = ([lng, lat]) => [
  (lng - projection.centerLng) * projection.scale + projection.width / 2,
  (mercator(projection.centerLat) - mercator(lat)) * projection.scale + projection.height / 2,
];
const linePath = (coordinates, closed = false) => {
  const points = coordinates.map(project);
  // The source is already generalized. Keep small details for district zooms.
  return (
    points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`).join("") +
    (closed ? "Z" : "")
  );
};
function geometryPath(geometry) {
  switch (geometry.type) {
    case "Polygon":
      return geometry.coordinates.map((ring) => linePath(ring, true)).join("");
    case "MultiPolygon":
      return geometry.coordinates
        .flatMap((polygon) => polygon.map((ring) => linePath(ring, true)))
        .join("");
    case "LineString":
      return linePath(geometry.coordinates);
    case "MultiLineString":
      return geometry.coordinates.map((line) => linePath(line)).join("");
    default:
      return "";
  }
}
const countries = datasets[0].features
  .filter((feature) =>
    ["IRQ", "IRN", "TUR", "SYR", "JOR", "SAU", "KWT"].includes(feature.properties.ADM0_A3),
  )
  .map((feature) => ({ id: feature.properties.ADM0_A3, path: geometryPath(feature.geometry) }));
const boundaries = datasets[1].features
  .filter((feature) => feature.properties.ADM0_A3 === "IRQ")
  .map((feature) => geometryPath(feature.geometry));
const rivers = datasets[2].features
  .filter((feature) => ["Euphrates", "Tigris"].includes(feature.properties.name))
  .map((feature) => geometryPath(feature.geometry));
const lakes = datasets[3].features
  .filter((feature) => {
    const points = feature.geometry.coordinates.flat(Infinity);
    return points.some(
      (value, i) =>
        i % 2 === 0 && value >= 38 && value <= 49 && points[i + 1] >= 29 && points[i + 1] <= 38,
    );
  })
  .map((feature) => geometryPath(feature.geometry));
await fs.writeFile(
  "lib/iraq-map.json",
  JSON.stringify({
    source: "Natural Earth — public domain",
    sourceUrl: "https://www.naturalearthdata.com/about/terms-of-use/",
    projection,
    countries,
    boundaries,
    rivers,
    lakes,
  }) + "\n",
);
console.log(
  `Saved Iraq, ${countries.length - 1} neighbors, ${boundaries.length} governorate boundaries, ${rivers.length} rivers and ${lakes.length} lakes.`,
);
