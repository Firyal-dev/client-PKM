"use client";

import { useState, useEffect, useRef } from "react";
import {
    Map,
    type MapRef,
    MapControls,
    MarkerPopup,
    MapMarker,
    MarkerContent,
    MarkerLabel,
    MapRoute,
} from "@/components/ui/map";
import { Navigation, Loader2, Clock, Route, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PuskesmasInfo } from "@/types/web-info";
import { getMediaUrl } from "@/lib/getMediaUrl";
import Image from "next/image";
import Link from "next/link";

const MAP_STYLES = {
    default: undefined,
    openstreetmap: "https://tiles.openfreemap.org/styles/bright",
    openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
};

type StyleKey = keyof typeof MAP_STYLES;

interface RouteData {
    coordinates: [number, number][];
    duration: number; // seconds
    distance: number; // meters
}

function formatDuration(seconds: number): string {
    const mins = Math.round(seconds / 60);
    if (mins < 60) return `${mins} menit`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours} jam ${remainingMins} menit`;
}

function formatDistance(meters: number): string {
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
}

interface FooterMapProps {
    puskesmasInfo: PuskesmasInfo;
    height?: string;
}

export function FooterMap({ puskesmasInfo, height = "100%" }: FooterMapProps) {
    const mapRef = useRef<MapRef>(null);
    const [style, setStyle] = useState<StyleKey>("default");
    const selectedStyle = MAP_STYLES[style];
    const is3D = style === "openstreetmap3d";

    // Routing state
    const [routes, setRoutes] = useState<RouteData[]>([]);
    const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
    const [userLocation, setUserLocation] = useState<{ lng: number; lat: number } | null>(null);
    const [routeStatus, setRouteStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [routeError, setRouteError] = useState<string | null>(null);

    const destLat = puskesmasInfo.lantitude || -6.605552;
    const destLng = puskesmasInfo.longtitude || 106.817222;

    useEffect(() => {
        mapRef.current?.easeTo({ pitch: is3D ? 60 : 0, duration: 500 });
    }, [is3D]);

    const handleGetRoute = () => {
        setRouteStatus("loading");
        setRouteError(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const userLng = position.coords.longitude;
                const userLat = position.coords.latitude;
                setUserLocation({ lng: userLng, lat: userLat });

                try {
                    const res = await fetch(
                        `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${destLng},${destLat}?overview=full&geometries=geojson&alternatives=true`
                    );
                    const data = await res.json();

                    if (data.routes?.length > 0) {
                        const routeData: RouteData[] = data.routes.map((r: {
                            geometry: { coordinates: [number, number][] };
                            duration: number;
                            distance: number;
                        }) => ({
                            coordinates: r.geometry.coordinates,
                            duration: r.duration,
                            distance: r.distance,
                        }));
                        setRoutes(routeData);
                        setSelectedRouteIndex(0);
                        setRouteStatus("success");

                        // Fit map supaya rute keliatan semua
                        const allCoords = routeData[0].coordinates;
                        const lngs = allCoords.map(c => c[0]);
                        const lats = allCoords.map(c => c[1]);
                        mapRef.current?.fitBounds(
                            [
                                [Math.min(...lngs), Math.min(...lats)],
                                [Math.max(...lngs), Math.max(...lats)],
                            ],
                            { padding: 60, duration: 800 }
                        );
                    } else {
                        throw new Error("Rute tidak ditemukan");
                    }
                } catch {
                    setRouteStatus("error");
                    setRouteError("Gagal mengambil rute. Coba lagi.");
                }
            },
            (err) => {
                setRouteStatus("error");
                if (err.code === err.PERMISSION_DENIED) {
                    setRouteError("Izin lokasi ditolak.");
                } else {
                    setRouteError("Gagal mendapatkan lokasi.");
                }
            },
            { timeout: 10000 }
        );
    };

    const handleClearRoute = () => {
        setRoutes([]);
        setUserLocation(null);
        setRouteStatus("idle");
        setRouteError(null);
        mapRef.current?.easeTo({ center: [destLng, destLat], zoom: 15, duration: 600 });
    };

    // Render non-selected route dulu, baru selected (supaya selected tampil di atas)
    const sortedRoutes = routes
        .map((route, index) => ({ route, index }))
        .sort((a, b) => {
            if (a.index === selectedRouteIndex) return 1;
            if (b.index === selectedRouteIndex) return -1;
            return 0;
        });

    return (
        <div className="relative w-full" style={{ height }}>
            <Map
                ref={mapRef}
                center={[destLng, destLat]}
                zoom={15}
                styles={selectedStyle ? { light: selectedStyle, dark: selectedStyle } : undefined}
            >
                <MapControls position="bottom-right" showZoom showCompass showLocate showFullscreen />

                {/* Route lines */}
                {sortedRoutes.map(({ route, index }) => {
                    const isSelected = index === selectedRouteIndex;
                    return (
                        <MapRoute
                            key={index}
                            coordinates={route.coordinates}
                            color={isSelected ? "#3b82f6" : "#94a3b8"}
                            width={isSelected ? 5 : 4}
                            opacity={isSelected ? 1 : 0.5}
                            onClick={() => setSelectedRouteIndex(index)}
                        />
                    );
                })}

                {/* Marker lokasi user */}
                {userLocation && (
                    <MapMarker longitude={userLocation.lng} latitude={userLocation.lat}>
                        <MarkerContent>
                            <div className="size-4 rounded-full bg-blue-500 border-2 border-white shadow-lg ring-4 ring-blue-500/30" />
                            <MarkerLabel position="top">Lokasi Anda</MarkerLabel>
                        </MarkerContent>
                    </MapMarker>
                )}

                {/* Marker tujuan (puskesmas) */}
                <MapMarker longitude={destLng} latitude={destLat}>
                    <MarkerContent>
                        <div className="size-5 rounded-full bg-rose-500 border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform" />
                        <MarkerLabel position="bottom">{puskesmasInfo.web_title}</MarkerLabel>
                    </MarkerContent>
                    <MarkerPopup className="p-0 w-60">
                        <div className="space-y-2.5 p-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-md overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center">
                                    <Image
                                        src={getMediaUrl(puskesmasInfo.logo) || "/puskesmasLogo.png"}
                                        alt="Logo Puskesmas"
                                        width={32}
                                        height={32}
                                        className="object-contain"
                                        unoptimized
                                    />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground leading-tight">
                                        {puskesmasInfo.web_title}
                                    </h3>
                                    {puskesmasInfo.contact && (
                                        <p className="text-xs text-muted-foreground">{puskesmasInfo.contact}</p>
                                    )}
                                </div>
                            </div>
                            <Button size="sm" className="w-full h-8" asChild>
                                <Link
                                    href={`https://www.google.com/maps/search/?api=1&query=${destLat},${destLng}`}
                                    target="_blank"
                                >
                                    <Navigation className="size-3.5 mr-1.5" />
                                    Lihat di Google Maps
                                </Link>
                            </Button>
                        </div>
                    </MarkerPopup>
                </MapMarker>
            </Map>

            {/* ── Pilihan rute (muncul setelah rute berhasil) ── */}
            {routeStatus === "success" && routes.length > 0 && (
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {routes.map((route, index) => {
                        const isActive = index === selectedRouteIndex;
                        return (
                            <button
                                key={index}
                                onClick={() => setSelectedRouteIndex(index)}
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm shadow-lg transition-all border backdrop-blur-sm ${isActive
                                    ? "bg-slate-900 border-blue-500/50 text-white"
                                    : "bg-slate-900/80 border-slate-700 text-slate-400 hover:text-slate-200"
                                    }`}
                            >
                                <div className="flex items-center gap-1.5">
                                    <Clock className="size-3.5" />
                                    <span className="font-semibold">{formatDuration(route.duration)}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs opacity-70">
                                    <Route className="size-3" />
                                    {formatDistance(route.distance)}
                                </div>
                                {index === 0 && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                                        Tercepat
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* ── Bottom controls ── */}
            <div className="absolute bottom-10 left-3 flex items-center gap-2 z-10">
                {routeStatus === "idle" && (
                    <Button
                        size="sm"
                        onClick={handleGetRoute}
                        className="h-8 gap-1.5 shadow-lg bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 backdrop-blur-sm"
                    >
                        <MapPin className="size-3.5" />
                        Rute ke sini
                    </Button>
                )}

                {routeStatus === "loading" && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-xs text-slate-300 backdrop-blur-sm shadow-lg">
                        <Loader2 className="size-3.5 animate-spin" />
                        Mencari rute...
                    </div>
                )}

                {routeStatus === "error" && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-900/80 border border-red-700 text-xs text-red-300 backdrop-blur-sm shadow-lg">
                        {routeError}
                        <button onClick={() => setRouteStatus("idle")} className="ml-1 hover:text-white transition-colors">
                            <X className="size-3" />
                        </button>
                    </div>
                )}

                {routeStatus === "success" && (
                    <button
                        onClick={handleClearRoute}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-xs text-slate-400 hover:text-white transition-colors backdrop-blur-sm shadow-lg"
                    >
                        <X className="size-3" />
                        Hapus rute
                    </button>
                )}
            </div>

            {/* ── Map style selector ── */}
            <div className="absolute top-3 right-3 z-10">
                <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value as StyleKey)}
                    className="bg-slate-900/80 backdrop-blur-sm text-slate-200 border border-slate-700 rounded-lg px-2 py-1 text-xs shadow cursor-pointer"
                >
                    <option value="default">Default</option>
                    <option value="openstreetmap">OpenStreetMap</option>
                    <option value="openstreetmap3d">3D</option>
                </select>
            </div>
        </div>
    );
}