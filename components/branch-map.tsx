"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpLeft,
  Clock3,
  Crosshair,
  Instagram,
  List,
  Map as MapIcon,
  MapPin,
  MessageCircle,
  Minus,
  Navigation,
  Phone,
  Plus,
  RotateCcw,
  Search,
  ShoppingBag,
  Truck,
  Utensils,
  X,
} from "lucide-react";
import { branches, branchDirectionsUrl, cities, type Branch } from "@/lib/branches";
import {
  clusterBranches,
  fitBranches,
  INITIAL_MAP_VIEW,
  MAP_HEIGHT,
  MAP_WIDTH,
  MAX_MAP_ZOOM,
  nearestBranch,
  projectLocation,
  spreadMarkers,
  type MapView,
} from "@/lib/branch-map";
import mapData from "@/lib/iraq-map.json";
import { getOrderContactLinks } from "@/lib/order-contact";
import { normalizeArabic, site } from "@/lib/site";
import { BrandStar } from "./brand";
import styles from "./branch-map.module.css";

const countryLabels = [
  { name: "العراق", lat: 34.3, lng: 43.2, home: true },
  { name: "تركيا", lat: 37.55, lng: 42.0 },
  { name: "سوريا", lat: 35.2, lng: 38.7 },
  { name: "الأردن", lat: 31.5, lng: 38.4 },
  { name: "إيران", lat: 34.8, lng: 47.7 },
  { name: "السعودية", lat: 29.0, lng: 42.3 },
  { name: "الكويت", lat: 29.0, lng: 47.7 },
];

function limitView(view: MapView): MapView {
  return {
    zoom: Math.min(MAX_MAP_ZOOM, Math.max(1, view.zoom)),
    x: Math.min(MAP_WIDTH * 0.35, Math.max(-MAP_WIDTH * (view.zoom - 0.65), view.x)),
    y: Math.min(MAP_HEIGHT * 0.35, Math.max(-MAP_HEIGHT * (view.zoom - 0.65), view.y)),
  };
}

function BranchDetails({ branch }: { branch: Branch }) {
  const phone = branch.phone || site.orderPhone;
  const links = getOrderContactLinks({
    phone,
    whatsapp: branch.whatsapp || site.orderWhatsapp,
    branchName: branch.name,
  });
  return (
    <article className={styles.details} aria-label={`معلومات فرع ${branch.name}`}>
      <Image
        className={styles.branchImage}
        src={branch.image || "/images/restaurant.webp"}
        alt="واجهة سوبر صوص بالأحمر والأبيض"
        width={720}
        height={420}
        sizes="(max-width: 760px) 100vw, 380px"
      />
      <div className={styles.detailsBody}>
        <h3>فرع {branch.name}</h3>
        <p className={styles.branchCity}>
          {branch.city} · {branch.area}
        </p>
        <dl className={styles.facts}>
          <div>
            <dt>
              <MapPin size={19} aria-hidden="true" />
              <span className="sr-only">العنوان</span>
            </dt>
            <dd>{branch.address}</dd>
          </div>
          <div>
            <dt>
              <Phone size={19} aria-hidden="true" />
              <span className="sr-only">رقم الهاتف</span>
            </dt>
            <dd>
              <bdi dir="ltr">{links.phone ? phone : "07XX XXX XXXX"}</bdi>
            </dd>
          </div>
          <div>
            <dt>
              <Clock3 size={19} aria-hidden="true" />
              <span className="sr-only">أوقات العمل</span>
            </dt>
            <dd>{branch.hours}</dd>
          </div>
        </dl>
        <ul className={styles.services} aria-label="خدمات الفرع">
          {branch.services.map((service) => {
            const Icon = service === "صالة" ? Utensils : service === "توصيل" ? Truck : ShoppingBag;
            return (
              <li key={service}>
                <Icon size={15} aria-hidden="true" />
                {service}
              </li>
            );
          })}
        </ul>
        <a
          className={`button button-red ${styles.directions}`}
          href={branchDirectionsUrl(branch)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Navigation size={19} aria-hidden="true" /> افتح الاتجاهات
          <span className="sr-only">، يفتح في نافذة جديدة</span>
        </a>
        {(links.phone || links.whatsapp) && (
          <div className={styles.contactActions}>
            {links.phone && (
              <a href={links.phone}>
                <Phone size={17} aria-hidden="true" /> اتصل بالفرع
              </a>
            )}
            {links.whatsapp && (
              <a href={links.whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} aria-hidden="true" /> واتساب
                <span className="sr-only">، يفتح في نافذة جديدة</span>
              </a>
            )}
          </div>
        )}
        <div className={styles.detailLinks}>
          <Link href={`/branches/${branch.slug}`}>
            تفاصيل الفرع <ArrowLeft size={15} aria-hidden="true" />
          </Link>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="تواصل عبر إنستغرام، يفتح في نافذة جديدة"
          >
            <Instagram size={17} aria-hidden="true" /> إنستغرام
          </a>
        </div>
      </div>
    </article>
  );
}

export function BranchMap() {
  const [city, setCity] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState(branches[0]?.slug);
  const [view, setView] = useState<MapView>(INITIAL_MAP_VIEW);
  const [listView, setListView] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [size, setSize] = useState({ width: MAP_WIDTH, height: MAP_HEIGHT });
  const canvas = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDialogElement>(null);
  const sheetTrigger = useRef<HTMLElement | null>(null);
  const locationRequest = useRef(0);
  const suppressClickUntil = useRef(0);
  const drag = useRef<{ pointer: number; x: number; y: number; view: MapView } | null>(null);
  const visible = branches.filter(
    (branch) =>
      (city === "all" || branch.city === city) &&
      normalizeArabic(`${branch.name} ${branch.city} ${branch.area} ${branch.address}`).includes(
        normalizeArabic(query),
      ),
  );
  const selected = visible.find((branch) => branch.slug === selectedSlug) || visible[0];
  const canvasScale = Math.min(size.width / MAP_WIDTH, size.height / MAP_HEIGHT);
  const offset = {
    x: (size.width - MAP_WIDTH * canvasScale) / 2,
    y: (size.height - MAP_HEIGHT * canvasScale) / 2,
  };
  const markers = spreadMarkers(
    clusterBranches(visible, view, canvasScale).map((marker) => {
      const x = offset.x + (marker.x * view.zoom + view.x) * canvasScale;
      const y = offset.y + (marker.y * view.zoom + view.y) * canvasScale;
      return { ...marker, x, y, anchorX: x, anchorY: y };
    }),
    size.width,
    size.height,
  );

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0)
        setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(element);
    const pendingRequests = locationRequest;
    return () => {
      observer.disconnect();
      pendingRequests.current++;
    };
  }, []);

  useEffect(() => {
    const element = canvas.current;
    if (!element || listView || !visible.length) return;
    type Point = { x: number; y: number };
    let previous: Point[] = [];
    const touchIds = new Set<number>();
    const point = (x: number, y: number): Point => {
      const matrix = element.querySelector("svg")!.getScreenCTM()!;
      return new DOMPoint(x, y).matrixTransform(matrix.inverse());
    };
    const transform = (from: Point, to: Point, factor: number) => {
      setView((current) => {
        const next = Math.min(MAX_MAP_ZOOM, Math.max(1, current.zoom * factor));
        const ratio = next / current.zoom;
        return limitView({
          zoom: next,
          x: to.x - (from.x - current.x) * ratio,
          y: to.y - (from.y - current.y) * ratio,
        });
      });
    };
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      const delta =
        event.deltaY *
        (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientHeight : 1);
      const anchor = point(event.clientX, event.clientY);
      transform(anchor, anchor, Math.exp(-Math.max(-200, Math.min(200, delta)) * 0.003));
    };
    const points = (event: TouchEvent) =>
      Array.from(event.touches)
        .filter((touch) => touchIds.has(touch.identifier))
        .slice(0, 2)
        .map((touch) => point(touch.clientX, touch.clientY));
    const start = (event: TouchEvent) => {
      for (const touch of Array.from(event.changedTouches)) {
        if (element.contains(touch.target as Node)) touchIds.add(touch.identifier);
      }
      previous = points(event);
      if (previous.length > 1) {
        event.preventDefault();
        suppressClickUntil.current = Date.now() + 500;
      }
    };
    const move = (event: TouchEvent) => {
      const next = points(event);
      if (next.length && next.length === previous.length) {
        event.preventDefault();
        const midpoint = (p: Point[]) =>
          p.length === 1 ? p[0] : { x: (p[0].x + p[1].x) / 2, y: (p[0].y + p[1].y) / 2 };
        const distance = (p: Point[]) => Math.hypot(p[1].x - p[0].x, p[1].y - p[0].y);
        transform(
          midpoint(previous),
          midpoint(next),
          next.length === 2 ? distance(next) / Math.max(1, distance(previous)) : 1,
        );
        suppressClickUntil.current = Date.now() + 500;
      }
      previous = next;
    };
    const end = (event: TouchEvent) => {
      for (const touch of Array.from(event.changedTouches)) touchIds.delete(touch.identifier);
      previous = points(event);
    };
    element.addEventListener("wheel", wheel, { passive: false });
    element.addEventListener("touchstart", start, { passive: false });
    element.addEventListener("touchmove", move, { passive: false });
    element.addEventListener("touchend", end);
    element.addEventListener("touchcancel", end);
    return () => {
      element.removeEventListener("wheel", wheel);
      element.removeEventListener("touchstart", start);
      element.removeEventListener("touchmove", move);
      element.removeEventListener("touchend", end);
      element.removeEventListener("touchcancel", end);
    };
  }, [listView, visible.length]);

  useEffect(() => {
    const dialog = sheet.current;
    if (!sheetOpen || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    const fallbackFocus = canvas.current;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 761px)");
    const resize = () => {
      if (desktop.matches) dialog.close();
    };
    desktop.addEventListener("change", resize);
    return () => {
      desktop.removeEventListener("change", resize);
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (sheetTrigger.current?.isConnected) sheetTrigger.current.focus({ preventScroll: true });
      else fallbackFocus?.focus({ preventScroll: true });
    };
  }, [sheetOpen]);

  const cancelLocation = () => {
    locationRequest.current++;
    setLocating(false);
    setLocationMessage("");
  };
  const reset = () => {
    cancelLocation();
    setCity("all");
    setQuery("");
    setView(INITIAL_MAP_VIEW);
  };
  const selectBranch = (branch: Branch, trigger?: HTMLElement, nextView = view) => {
    setSelectedSlug(branch.slug);
    if (window.matchMedia("(max-width: 760px)").matches) {
      sheetTrigger.current = trigger || (document.activeElement as HTMLElement);
      if (!listView) {
        const point = projectLocation(branch.coordinates);
        setView({
          ...nextView,
          x: MAP_WIDTH / 2 - point.x * nextView.zoom,
          y: (65 - offset.y) / canvasScale - point.y * nextView.zoom,
        });
        canvas.current?.scrollIntoView({ block: "start", behavior: "instant" });
      }
      setSheetOpen(true);
    }
  };
  const changeCity = (next: string) => {
    cancelLocation();
    setCity(next);
    setQuery("");
    setView(
      next === "all"
        ? INITIAL_MAP_VIEW
        : fitBranches(branches.filter((branch) => branch.city === next)),
    );
  };
  const zoom = (factor: number) => {
    setView((current) => {
      const next = Math.min(MAX_MAP_ZOOM, Math.max(1, current.zoom * factor));
      const ratio = next / current.zoom;
      return limitView({
        zoom: next,
        x: MAP_WIDTH / 2 - (MAP_WIDTH / 2 - current.x) * ratio,
        y: MAP_HEIGHT / 2 - (MAP_HEIGHT / 2 - current.y) * ratio,
      });
    });
  };
  const findLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("تحديد الموقع غير متاح. ابحث باسم منطقتك.");
      return;
    }
    const request = ++locationRequest.current;
    const trigger = document.activeElement as HTMLElement;
    setLocating(true);
    setLocationMessage("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (request !== locationRequest.current) return;
        const branch = nearestBranch(
          { lat: position.coords.latitude, lng: position.coords.longitude },
          branches,
        );
        setLocating(false);
        if (!branch) return;
        setCity("all");
        setQuery("");
        const nextView = fitBranches(branches.filter((item) => item.city === branch.city));
        setView(nextView);
        setLocationMessage(`أقرب فرع إلك: فرع ${branch.name}.`);
        selectBranch(branch, trigger, nextView);
      },
      (error) => {
        if (request !== locationRequest.current) return;
        setLocating(false);
        setLocationMessage(
          error.code === 1
            ? "لم تسمح بتحديد موقعك. تقدر تختار المحافظة أو تبحث باسم المنطقة."
            : "ما قدرنا نحدد موقعك. جرّب مرة ثانية أو ابحث باسم المنطقة.",
        );
      },
      { timeout: 10000, maximumAge: 60000 },
    );
  };

  return (
    <section className={styles.section} id="branch-map" aria-labelledby="branch-map-title">
      <div className="container">
        <div className={styles.heading}>
          <div>
            <h2 id="branch-map-title">
              <BrandStar />
              اعثر على أقرب فرع
            </h2>
            <p>اختار مكانك على الخريطة، وخلي اللّمة علينا.</p>
          </div>
          <button
            type="button"
            className={styles.locate}
            onClick={findLocation}
            disabled={locating}
          >
            <Crosshair size={19} aria-hidden="true" />
            {locating ? "نحدد موقعك..." : "استخدم موقعي"}
          </button>
        </div>
        <div className={styles.toolbar}>
          <div className={styles.cityFilters} aria-label="تصفية الخريطة حسب المحافظة">
            {["all", ...cities].map((name) => (
              <button
                type="button"
                key={name}
                onClick={() => changeCity(name)}
                aria-pressed={city === name}
              >
                {name === "all" ? "كل المحافظات" : name}
              </button>
            ))}
          </div>
          <div className={styles.search}>
            <Search size={18} aria-hidden="true" />
            <label className="sr-only" htmlFor="map-search">
              ابحث في خريطة الفروع
            </label>
            <input
              id="map-search"
              type="search"
              placeholder="ابحث عن فرع أو منطقة..."
              value={query}
              onChange={(event) => {
                cancelLocation();
                setQuery(event.target.value);
                setView(INITIAL_MAP_VIEW);
              }}
            />
            {query && (
              <button type="button" aria-label="مسح بحث الخريطة" onClick={() => setQuery("")}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        {locationMessage && (
          <p className={styles.locationMessage} role="status">
            {locationMessage}
          </p>
        )}
        <div className={styles.workspace}>
          <aside className={styles.desktopPanel}>
            {selected ? (
              <BranchDetails branch={selected} />
            ) : (
              <div className={styles.emptyPanel}>
                <MapPin size={38} />
                <h3>ما لقينا فرع بهالبحث.</h3>
                <p>جرّب اسم منطقة ثانية، أو اعرض كل الفروع.</p>
                <button type="button" className="button button-red" onClick={reset}>
                  عرض كل الفروع
                </button>
              </div>
            )}
          </aside>
          <div className={styles.mapColumn}>
            <div className={styles.mapTopline}>
              <span aria-live="polite">
                {visible.length} {visible.length === 1 ? "فرع" : "فروع"}
              </span>
              <div className={styles.viewSwitch} aria-label="طريقة عرض الفروع">
                <button type="button" aria-pressed={!listView} onClick={() => setListView(false)}>
                  <MapIcon size={16} aria-hidden="true" />
                  الخريطة
                </button>
                <button type="button" aria-pressed={listView} onClick={() => setListView(true)}>
                  <List size={16} aria-hidden="true" />
                  القائمة
                </button>
              </div>
            </div>
            <div
              ref={canvas}
              className={styles.canvas}
              data-list={listView}
              data-zoom={view.zoom.toFixed(2)}
              tabIndex={listView ? -1 : 0}
              role="group"
              aria-label="خريطة فروع سوبر صوص في العراق"
              aria-describedby="branch-map-instructions"
              onClickCapture={(event) => {
                if (event.detail && Date.now() < suppressClickUntil.current) {
                  event.preventDefault();
                  event.stopPropagation();
                }
              }}
              onKeyDown={(event) => {
                if (event.target !== event.currentTarget) return;
                if (
                  [
                    "+",
                    "=",
                    "-",
                    "Home",
                    "ArrowLeft",
                    "ArrowRight",
                    "ArrowUp",
                    "ArrowDown",
                  ].includes(event.key)
                )
                  event.preventDefault();
                if (event.key === "+" || event.key === "=") zoom(1.7);
                if (event.key === "-") zoom(1 / 1.7);
                if (event.key === "Home") setView(INITIAL_MAP_VIEW);
                const movement: Record<string, [number, number]> = {
                  ArrowLeft: [60, 0],
                  ArrowRight: [-60, 0],
                  ArrowUp: [0, 60],
                  ArrowDown: [0, -60],
                };
                if (movement[event.key])
                  setView((current) =>
                    limitView({
                      ...current,
                      x: current.x + movement[event.key][0],
                      y: current.y + movement[event.key][1],
                    }),
                  );
              }}
              onPointerDown={(event) => {
                if (
                  listView ||
                  event.pointerType === "touch" ||
                  event.button !== 0 ||
                  (event.target as Element).closest("button, a")
                )
                  return;
                drag.current = {
                  pointer: event.pointerId,
                  x: event.clientX,
                  y: event.clientY,
                  view,
                };
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerMove={(event) => {
                const start = drag.current;
                if (!start || start.pointer !== event.pointerId) return;
                if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 5)
                  suppressClickUntil.current = Date.now() + 500;
                setView(
                  limitView({
                    ...start.view,
                    x: start.view.x + (event.clientX - start.x) / canvasScale,
                    y: start.view.y + (event.clientY - start.y) / canvasScale,
                  }),
                );
              }}
              onPointerUp={() => {
                drag.current = null;
              }}
              onPointerCancel={() => {
                drag.current = null;
              }}
            >
              <div className={styles.mapDrawing} hidden={listView || !visible.length}>
                <svg
                  className={styles.artwork}
                  viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                  aria-hidden="true"
                >
                  <g transform={`translate(${view.x} ${view.y}) scale(${view.zoom})`}>
                    {mapData.countries
                      .filter((country) => country.id !== "IRQ")
                      .map((country) => (
                        <path
                          key={country.id}
                          className={styles.neighbor}
                          d={country.path}
                          vectorEffect="non-scaling-stroke"
                        />
                      ))}
                    <path
                      className={styles.iraq}
                      d={mapData.countries.find((country) => country.id === "IRQ")?.path}
                      vectorEffect="non-scaling-stroke"
                    />
                    {mapData.boundaries.map((path, index) => (
                      <path
                        key={`boundary-${index}`}
                        className={styles.boundary}
                        d={path}
                        vectorEffect="non-scaling-stroke"
                      />
                    ))}
                    {mapData.lakes.map((path, index) => (
                      <path key={`lake-${index}`} className={styles.lake} d={path} />
                    ))}
                    {mapData.rivers.map((path, index) => (
                      <path
                        key={`river-${index}`}
                        className={styles.river}
                        d={path}
                        vectorEffect="non-scaling-stroke"
                      />
                    ))}
                    {view.zoom < 2.5 &&
                      countryLabels.map((label) => {
                        const point = projectLocation(label);
                        return (
                          <text
                            key={label.name}
                            x={point.x}
                            y={point.y}
                            textAnchor="middle"
                            className={label.home ? styles.iraqLabel : styles.countryLabel}
                          >
                            {label.name}
                          </text>
                        );
                      })}
                  </g>
                </svg>
                <svg className={styles.leaders} aria-hidden="true">
                  {markers.map((marker) =>
                    marker.x !== marker.anchorX || marker.y !== marker.anchorY ? (
                      <g key={marker.branches[0].slug}>
                        <line x1={marker.anchorX} y1={marker.anchorY} x2={marker.x} y2={marker.y} />
                        <circle cx={marker.anchorX} cy={marker.anchorY} r={2.5} />
                      </g>
                    ) : null,
                  )}
                </svg>
                {markers.map((marker) => {
                  const clustered = marker.branches.length > 1;
                  const branch = marker.branches[0];
                  const active = marker.branches.some((item) => item.slug === selected?.slug);
                  const label = clustered
                    ? marker.branches.every((item) => item.city === branch.city)
                      ? branch.city
                      : ""
                    : view.zoom > 8
                      ? branch.name
                      : branch.city;
                  return (
                    <button
                      type="button"
                      key={marker.branches.map((item) => item.slug).join("-")}
                      className={`${styles.marker} ${clustered ? styles.cluster : ""} ${active ? styles.selectedMarker : ""}`}
                      style={{ left: marker.x, top: marker.y }}
                      aria-label={
                        clustered
                          ? `تكبير تجمع ${marker.branches.length} فروع`
                          : `عرض فرع ${branch.name}، ${branch.city}`
                      }
                      aria-pressed={clustered ? undefined : active}
                      onClick={(event) => {
                        cancelLocation();
                        if (clustered) {
                          if (view.zoom >= MAX_MAP_ZOOM) {
                            setListView(true);
                            return;
                          }
                          setView(fitBranches(marker.branches, view.zoom * 1.8));
                          canvas.current?.focus({ preventScroll: true });
                        } else selectBranch(branch, event.currentTarget);
                      }}
                    >
                      {clustered ? (
                        <span className={styles.clusterCount}>{marker.branches.length}</span>
                      ) : (
                        <MapPin size={35} aria-hidden="true" />
                      )}
                      {label && (
                        <span className={styles.markerLabel} aria-hidden="true">
                          {label}
                        </span>
                      )}
                    </button>
                  );
                })}
                <div className={styles.zoomControls}>
                  <button
                    type="button"
                    aria-label="تكبير الخريطة"
                    disabled={view.zoom >= MAX_MAP_ZOOM}
                    onClick={() => zoom(1.7)}
                  >
                    <Plus size={21} />
                  </button>
                  <button
                    type="button"
                    aria-label="تصغير الخريطة"
                    disabled={view.zoom <= 1}
                    onClick={() => zoom(1 / 1.7)}
                  >
                    <Minus size={21} />
                  </button>
                </div>
                <button
                  type="button"
                  className={styles.resetView}
                  onClick={() => setView(INITIAL_MAP_VIEW)}
                >
                  <RotateCcw size={15} aria-hidden="true" />
                  عرض العراق
                </button>
                <a
                  className={styles.attribution}
                  href="https://www.naturalearthdata.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="بيانات الخريطة من Natural Earth، يفتح في نافذة جديدة"
                >
                  Natural Earth
                </a>
              </div>
              {listView && (
                <div className={styles.branchList} aria-label="قائمة فروع الخريطة">
                  {visible.map((branch) => (
                    <button
                      type="button"
                      key={branch.slug}
                      aria-pressed={selected?.slug === branch.slug}
                      onClick={(event) => {
                        cancelLocation();
                        selectBranch(branch, event.currentTarget);
                        setView(fitBranches(branches.filter((item) => item.city === branch.city)));
                      }}
                    >
                      <MapPin size={24} aria-hidden="true" />
                      <span>
                        <b>فرع {branch.name}</b>
                        <small>
                          {branch.city} · {branch.address}
                        </small>
                      </span>
                      <ArrowLeft size={19} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              )}
              {!visible.length && (
                <div className={styles.noResults} role="status">
                  <Search size={28} aria-hidden="true" />
                  <b>ما لقينا فرع بهالبحث.</b>
                  <button type="button" onClick={reset}>
                    عرض كل الفروع <ArrowLeft size={16} />
                  </button>
                </div>
              )}
            </div>
            <p className={styles.mapInstructions} id="branch-map-instructions">
              اسحب لتحريك الخريطة، وقرّب أو باعد بإصبعين للتكبير والتصغير، أو استخدم عجلة الماوس.
              اضغط على دبوس لعرض الفرع.
              <span className="sr-only">
                {" "}
                اسحب لتحريك الخريطة. بلوحة المفاتيح استخدم الأسهم للتحريك، والزائد والناقص للتكبير،
                وHome لعرض العراق.
              </span>
            </p>
            {selected && (
              <button
                type="button"
                className={styles.mobileSummary}
                onClick={(event) => selectBranch(selected, event.currentTarget)}
              >
                <MapPin size={22} aria-hidden="true" />
                <span>
                  <b>فرع {selected.name}</b>
                  <small>{selected.city} · اضغط لعرض التفاصيل</small>
                </span>
                <ArrowLeft size={20} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
        <div className={styles.bottomline}>
          <p>اختار فرعك وشوف تفاصيله والطريق إله.</p>
          <Link href="/branches">
            دليل الفروع كامل <ArrowUpLeft size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className={`checker-border ${styles.checker}`} />
      <dialog
        ref={sheet}
        className={styles.sheet}
        aria-label={selected ? `تفاصيل فرع ${selected.name}` : "تفاصيل الفرع"}
        onClose={() => setSheetOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) sheet.current?.close();
        }}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = event.currentTarget.querySelectorAll<HTMLElement>(
            "button:not(:disabled), a[href]",
          );
          const first = controls[0],
            last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          }
          if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
      >
        <div className={styles.sheetContent}>
          <div className={styles.sheetTop}>
            <span />
            <button
              type="button"
              className="icon-button"
              aria-label="إغلاق تفاصيل الفرع"
              onClick={() => sheet.current?.close()}
              autoFocus
            >
              <X size={22} />
            </button>
          </div>
          {sheetOpen && selected && <BranchDetails branch={selected} />}
        </div>
      </dialog>
    </section>
  );
}
