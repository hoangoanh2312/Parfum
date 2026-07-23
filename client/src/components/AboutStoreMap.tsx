import { useMemo, useState } from "react";
import { Clock, MapPin, Navigation, Phone, Store, X } from "lucide-react";

type StoreLocation = {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
};

type City = { name: string; lat: number; lng: number };

const STORES: StoreLocation[] = [
  { id: "hn", name: "L'Essence Noire Hà Nội", city: "Hà Nội", address: "Tràng Tiền Plaza, Hoàn Kiếm", phone: "024 3826 1000", hours: "09:00 – 22:00", lat: 21.0245, lng: 105.8412 },
  { id: "hp", name: "L'Essence Noire Hải Phòng", city: "Hải Phòng", address: "Lạch Tray, Ngô Quyền", phone: "0225 3736 555", hours: "09:00 – 21:30", lat: 20.8449, lng: 106.6881 },
  { id: "dn", name: "L'Essence Noire Đà Nẵng", city: "Đà Nẵng", address: "Bạch Đằng, Hải Châu", phone: "0236 3888 246", hours: "09:00 – 22:00", lat: 16.0678, lng: 108.2208 },
  { id: "hue", name: "L'Essence Noire Huế", city: "Huế", address: "Lê Lợi, Phú Hội", phone: "0234 3777 168", hours: "09:00 – 21:30", lat: 16.4637, lng: 107.5909 },
  { id: "nt", name: "L'Essence Noire Nha Trang", city: "Nha Trang", address: "Trần Phú, Lộc Thọ", phone: "0258 3524 888", hours: "09:00 – 22:00", lat: 12.2388, lng: 109.1967 },
  { id: "bmt", name: "L'Essence Noire Buôn Ma Thuột", city: "Buôn Ma Thuột", address: "Lê Duẩn, Tân Lập", phone: "0262 3555 279", hours: "08:30 – 21:30", lat: 12.6667, lng: 108.0500 },
  { id: "hcm", name: "L'Essence Noire Sài Gòn", city: "TP. Hồ Chí Minh", address: "Đồng Khởi, Quận 1", phone: "028 3822 9999", hours: "09:00 – 22:30", lat: 10.7769, lng: 106.7009 },
  { id: "ct", name: "L'Essence Noire Cần Thơ", city: "Cần Thơ", address: "Ninh Kiều, bến Ninh Kiều", phone: "0292 3765 432", hours: "09:00 – 21:30", lat: 10.0452, lng: 105.7469 },
];

const CITIES: City[] = [
  { name: "Hà Nội", lat: 21.0278, lng: 105.8342 },
  { name: "Hải Phòng", lat: 20.8449, lng: 106.6881 },
  { name: "Quảng Ninh", lat: 21.0064, lng: 107.2925 },
  { name: "Thanh Hóa", lat: 19.8067, lng: 105.7852 },
  { name: "Vinh", lat: 18.6733, lng: 105.6922 },
  { name: "Huế", lat: 16.4637, lng: 107.5909 },
  { name: "Đà Nẵng", lat: 16.0544, lng: 108.2022 },
  { name: "Quy Nhơn", lat: 13.7829, lng: 109.2196 },
  { name: "Nha Trang", lat: 12.2388, lng: 109.1967 },
  { name: "Đà Lạt", lat: 11.9404, lng: 108.4583 },
  { name: "Buôn Ma Thuột", lat: 12.6667, lng: 108.0500 },
  { name: "TP. Hồ Chí Minh", lat: 10.7769, lng: 106.7009 },
  { name: "Biên Hòa", lat: 10.9574, lng: 106.8426 },
  { name: "Vũng Tàu", lat: 10.4114, lng: 107.1362 },
  { name: "Cần Thơ", lat: 10.0452, lng: 105.7469 },
  { name: "Cà Mau", lat: 9.1769, lng: 105.1524 },
];

// Anh ban do Viet Nam that (Wikimedia - official location map cua Viet Nam),
// duoc rasterize sang PNG qua Special:FilePath?width= de tai nhanh & on dinh.
const MAP_IMAGE =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Vietnam_location_map.svg?width=900";

// Khung toa do dia ly cua chinh anh location map o tren (chuan Wikipedia),
// dung de chieu tuyen tinh lat/lng -> phan tram tren anh.
const LAT_TOP = 23.6;
const LAT_BOTTOM = 8.1;
const LNG_LEFT = 101.9;
const LNG_RIGHT = 110.1;
const MAP_ASPECT = (LNG_RIGHT - LNG_LEFT) / (LAT_TOP - LAT_BOTTOM);

function pct(lat: number, lng: number) {
  const x = ((lng - LNG_LEFT) / (LNG_RIGHT - LNG_LEFT)) * 100;
  const y = ((LAT_TOP - lat) / (LAT_TOP - LAT_BOTTOM)) * 100;
  return { x, y };
}

function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

function directionsUrl(store: StoreLocation) {
  return "https://www.google.com/maps/search/?api=1&query=" + store.lat + "," + store.lng;
}

export default function AboutStoreMap() {
  const [origin, setOrigin] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [locating, setLocating] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [activeStore, setActiveStore] = useState<StoreLocation | null>(null);

  const nearest = useMemo(() => {
    if (!origin) return null;
    let best = STORES[0];
    let bestDist = Infinity;
    for (const store of STORES) {
      const dist = haversine(origin, store);
      if (dist < bestDist) {
        bestDist = dist;
        best = store;
      }
    }
    return { store: best, distance: bestDist };
  }, [origin]);

  const highlight = activeStore || nearest?.store || null;

  const focus = useMemo(() => {
    if (highlight) {
      const p = pct(highlight.lat, highlight.lng);
      return { x: p.x, y: p.y, scale: 2.1 };
    }
    return { x: 50, y: 50, scale: 1 };
  }, [highlight]);

  const originPoint = origin ? pct(origin.lat, origin.lng) : null;
  const nearestPoint = nearest ? pct(nearest.store.lat, nearest.store.lng) : null;

  function handleCity(name: string) {
    setSelectedCity(name);
    setActiveStore(null);
    const city = CITIES.find((c) => c.name === name);
    if (city) setOrigin({ lat: city.lat, lng: city.lng, label: city.name });
  }

  function handleGeolocate() {
    if (!navigator.geolocation) return;
    setLocating(true);
    setActiveStore(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSelectedCity("");
        setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude, label: "Vị trí của bạn" });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  return (
    <section className="bg-[#F5F2ED] px-6 py-20 sm:px-10 lg:px-16 lg:py-28" style={{ fontFamily: "'Spectral', serif" }}>
      <style>{`
        @keyframes storePulse{0%{transform:translate(-50%,-50%) scale(1);opacity:.55}70%,100%{transform:translate(-50%,-50%) scale(2.6);opacity:0}}
        @keyframes routeDash{to{stroke-dashoffset:-8}}
      `}</style>

      <div className="mx-auto max-w-[1180px]">
        <p className="text-[11px] uppercase tracking-[0.32em] text-[#927A20]">Hệ thống cửa hàng</p>
        <h2 className="mt-4 text-[34px] leading-tight text-[#242018] sm:text-[44px]">Cửa hàng trên toàn quốc</h2>
        <p className="mt-4 max-w-xl text-[15px] leading-[1.9] text-[#5c564b]">
          Nhập thành phố của bạn hoặc chia sẻ vị trí để chúng tôi điều hướng bạn đến boutique gần nhất. Nhấp vào từng điểm trên bản đồ để xem chi tiết.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="relative flex justify-center overflow-hidden rounded-[10px] border border-[#d8d1c0] bg-[radial-gradient(circle_at_30%_20%,#e9f1f3,#cbdde3_55%,#b6ccd4)] py-6 shadow-[0_20px_60px_-30px_rgba(60,50,25,0.55)]">
            <div className="pointer-events-none absolute right-4 bottom-4 z-20 hidden h-14 w-14 items-center justify-center rounded-full border border-[#927A20]/40 bg-white/70 text-[#927A20] backdrop-blur sm:flex">
              <span className="absolute top-1 text-[9px] font-semibold">B</span>
              <span className="absolute bottom-1 text-[8px] opacity-60">N</span>
              <Navigation size={18} />
            </div>

            <div className="relative h-[540px] max-w-full" style={{ aspectRatio: String(MAP_ASPECT) }}>
              <div
                className="absolute inset-0"
                style={{
                  transform: "scale(" + focus.scale + ")",
                  transformOrigin: focus.x + "% " + focus.y + "%",
                  transition: "transform 1.3s cubic-bezier(0.65, 0, 0.35, 1)",
                }}
              >
                {!mapError && (
                  <img
                    src={MAP_IMAGE}
                    alt="Bản đồ Việt Nam"
                    referrerPolicy="no-referrer"
                    onLoad={() => setMapReady(true)}
                    onError={() => setMapError(true)}
                    className="h-full w-full select-none object-fill"
                    style={{ filter: "drop-shadow(0 6px 10px rgba(40,32,16,0.25)) saturate(1.05)" }}
                    draggable={false}
                  />
                )}
                {mapError && (
                  <div className="flex h-full w-full items-center justify-center bg-[#e7ddc5] text-center text-[12px] text-[#8a7d5a]">
                    Không tải được ảnh bản đồ
                  </div>
                )}

                {originPoint && nearestPoint && (
                  <svg
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <line
                      x1={originPoint.x}
                      y1={originPoint.y}
                      x2={nearestPoint.x}
                      y2={nearestPoint.y}
                      stroke="#927A20"
                      strokeWidth={0.6}
                      strokeDasharray="2 2"
                      strokeLinecap="round"
                      opacity={0.95}
                      style={{ animation: "routeDash 0.9s linear infinite" }}
                    />
                  </svg>
                )}

                {STORES.map((store) => {
                  const p = pct(store.lat, store.lng);
                  const isHighlight = highlight?.id === store.id;
                  return (
                    <button
                      type="button"
                      key={store.id}
                      onClick={() => setActiveStore(store)}
                      className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                      style={{ left: p.x + "%", top: p.y + "%" }}
                      aria-label={store.name}
                    >
                      {isHighlight && (
                        <span
                          className="absolute left-1/2 top-1/2 h-4 w-4 rounded-full bg-[#927A20]"
                          style={{ animation: "storePulse 1.8s ease-out infinite" }}
                        />
                      )}
                      <span
                        className="relative block rounded-full border-2 border-white shadow-[0_1px_4px_rgba(0,0,0,0.4)] transition-transform duration-200 group-hover:scale-125"
                        style={{
                          width: isHighlight ? 15 : 10,
                          height: isHighlight ? 15 : 10,
                          background: isHighlight ? "#927A20" : "#7c6f4d",
                        }}
                      />
                      <span
                        className={"pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#242018] px-2 py-0.5 text-[9px] font-medium tracking-wide text-white shadow transition-opacity duration-200 " + (isHighlight ? "opacity-100" : "opacity-0 group-hover:opacity-100")}
                      >
                        {store.city}
                      </span>
                    </button>
                  );
                })}

                {originPoint && (
                  <div
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: originPoint.x + "%", top: originPoint.y + "%" }}
                  >
                    <span
                      className="absolute left-1/2 top-1/2 h-5 w-5 rounded-full border border-[#242018]"
                      style={{ animation: "storePulse 2s ease-out infinite" }}
                    />
                    <span className="relative block h-3 w-3 rounded-full border-2 border-white bg-[#242018] shadow" />
                  </div>
                )}
              </div>
            </div>

            <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-full bg-white/85 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#927A20] shadow backdrop-blur">
              {STORES.length} boutique · toàn quốc
            </div>

            <div className="pointer-events-none absolute bottom-4 left-4 z-20 flex flex-col gap-1 rounded-md bg-white/80 px-3 py-2 text-[10px] text-[#5c564b] shadow backdrop-blur">
              <span className="flex items-center gap-2"><span className="inline-block h-2.5 w-2.5 rounded-full bg-[#927A20]" /> Cửa hàng nổi bật</span>
              <span className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-[#7c6f4d]" /> Boutique khác</span>
              <span className="flex items-center gap-2"><span className="inline-block h-2.5 w-2.5 rounded-full bg-[#242018]" /> Vị trí của bạn</span>
            </div>

            {activeStore && (
              <div className="absolute inset-x-4 top-14 z-30 rounded-[8px] border border-[#927A20]/40 bg-white/95 p-4 shadow-xl backdrop-blur sm:left-auto sm:right-4 sm:w-[280px]">
                <button
                  type="button"
                  onClick={() => setActiveStore(null)}
                  className="absolute right-2 top-2 text-[#8a8373] transition hover:text-[#242018]"
                  aria-label="Đóng"
                >
                  <X size={16} />
                </button>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#927A20]">Boutique</p>
                <h3 className="mt-1 pr-5 text-[19px] leading-snug text-[#242018]">{activeStore.name}</h3>
                <p className="mt-2 flex items-start gap-2 text-[13px] text-[#5c564b]"><MapPin size={13} className="mt-0.5 shrink-0 text-[#927A20]" />{activeStore.address}, {activeStore.city}</p>
                <p className="mt-1 flex items-center gap-2 text-[13px] text-[#5c564b]"><Phone size={13} className="shrink-0 text-[#927A20]" />{activeStore.phone}</p>
                <p className="mt-1 flex items-center gap-2 text-[13px] text-[#5c564b]"><Clock size={13} className="shrink-0 text-[#927A20]" />{activeStore.hours}</p>
                <a
                  href={directionsUrl(activeStore)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 bg-[#927A20] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#7c6717]"
                >
                  <Navigation size={13} /> Chỉ đường
                </a>
              </div>
            )}

            {!mapReady && !mapError && (
              <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center text-[12px] text-[#7d7460]">
                Đang tải bản đồ...
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-[6px] border border-[#e2dccf] bg-white/70 p-6">
              <label className="text-[11px] uppercase tracking-[0.2em] text-[#927A20]">Chọn thành phố</label>
              <select
                value={selectedCity}
                onChange={(e) => handleCity(e.target.value)}
                className="mt-3 w-full border border-[#d9d2c3] bg-[#faf8f2] px-4 py-3 text-[14px] text-[#3a352b] outline-none focus:border-[#927A20]"
              >
                <option value="">— Thành phố của bạn —</option>
                {CITIES.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleGeolocate}
                className="mt-3 flex w-full items-center justify-center gap-2 border border-[#927A20] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#927A20] transition hover:bg-[#927A20] hover:text-white"
              >
                <Navigation size={14} />
                {locating ? "Đang định vị..." : "Dùng vị trí của tôi"}
              </button>
            </div>

            {nearest ? (
              <div className="rounded-[6px] border border-[#927A20]/40 bg-[#fbf7ec] p-6">
                <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#927A20]">
                  <MapPin size={14} /> Cửa hàng gần bạn nhất
                </p>
                <h3 className="mt-3 text-[22px] text-[#242018]">{nearest.store.name}</h3>
                <p className="mt-1 text-[14px] text-[#5c564b]">{nearest.store.address}, {nearest.store.city}</p>
                <div className="mt-3 space-y-1 text-[13px] text-[#5c564b]">
                  <p className="flex items-center gap-2"><Phone size={13} className="text-[#927A20]" />{nearest.store.phone}</p>
                  <p className="flex items-center gap-2"><Clock size={13} className="text-[#927A20]" />{nearest.store.hours}</p>
                </div>
                <p className="mt-3 text-[13px] text-[#927A20]">
                  Cách {origin?.label} khoảng <span className="font-semibold">{Math.round(nearest.distance)} km</span>
                </p>
                <a
                  href={directionsUrl(nearest.store)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 bg-[#927A20] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#7c6717]"
                >
                  <Navigation size={13} /> Chỉ đường đến cửa hàng
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-[6px] border border-[#e2dccf] bg-white/60 p-6 text-[14px] text-[#6b6558]">
                <Store size={20} className="text-[#927A20]" />
                Chọn vị trí hoặc bấm một điểm trên bản đồ để xem chi tiết cửa hàng.
              </div>
            )}

            <div className="max-h-[210px] space-y-2 overflow-y-auto pr-1">
              {STORES.map((store) => (
                <button
                  type="button"
                  key={store.id}
                  onClick={() => setActiveStore(store)}
                  className={"flex w-full items-start gap-3 rounded-[4px] border px-4 py-3 text-left text-[13px] transition hover:border-[#927A20] " + (highlight?.id === store.id ? "border-[#927A20] bg-[#fbf7ec]" : "border-[#e6e0d3] bg-white/40")}
                >
                  <MapPin size={14} className="mt-0.5 shrink-0 text-[#927A20]" />
                  <span className="min-w-0">
                    <span className="text-[#3a352b]">{store.city}</span>
                    <span className="block text-[12px] text-[#8a8373]">{store.address}</span>
                    <span className="mt-0.5 flex items-center gap-2 text-[11px] text-[#a79f8b]">
                      <Clock size={11} /> {store.hours}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-[12px] italic text-[#8a8373]">
          Quần đảo Hoàng Sa và Trường Sa thuộc chủ quyền Việt Nam.
        </p>
      </div>
    </section>
  );
}
