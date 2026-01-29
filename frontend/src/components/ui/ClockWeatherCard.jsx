import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, Moon, MapPin, Loader2, CloudRain, CloudSnow, Wind } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ClockWeatherCard = ({ locationString }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [time, setTime] = useState(new Date());
    const [weather, setWeather] = useState(null);
    const [coords, setCoords] = useState(null);
    const [loading, setLoading] = useState(true);

    // Default Configuration (Sivasagar, Assam)
    const DEFAULT_LOCATION = {
        lat: 26.9856,
        lon: 94.6314,
        name: "Sivasagar, Assam, India",
        timezone: "Asia/Kolkata" // GMT+5:30 (Indian Standard Time - correct for Assam)
    };

    // 1. Clock Logic (Updates every second)
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // 2. Geocoding: Convert Backend Location String -> Lat/Lon
    useEffect(() => {
        const fetchCoords = async () => {
            // Use prop if available, otherwise default to Sivasagar
            const query = locationString ? locationString.split(',')[0].trim() : "Sivasagar";

            try {
                const res = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1&language=en&format=json`
                );
                const data = await res.json();

                if (data.results && data.results.length > 0) {
                    const { latitude, longitude, name, timezone } = data.results[0];
                    setCoords({ lat: latitude, lon: longitude, name, timezone });
                } else {
                    // Fallback to Sivasagar if search fails
                    setCoords(DEFAULT_LOCATION);
                }
            } catch (error) {
                console.error("Geocoding failed:", error);
                setCoords(DEFAULT_LOCATION);
                setLoading(false);
            }
        };

        fetchCoords();
    }, [locationString]);

    // 3. Weather Fetching
    useEffect(() => {
        if (!coords) return;

        const fetchWeather = async () => {
            try {
                const res = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,is_day,weather_code,wind_speed_10m&timezone=auto`
                );
                const data = await res.json();
                setWeather(data.current);
                setLoading(false);
            } catch (error) {
                console.error("Weather fetch failed:", error);
                setLoading(false);
            }
        };

        fetchWeather();
        const interval = setInterval(fetchWeather, 900000); // Update every 15 mins
        return () => clearInterval(interval);
    }, [coords]);

    // Analog Clock Calculations
    // Adjust time to the target timezone (India Standard Time)
    const localTime = new Date(time.toLocaleString("en-US", { timeZone: coords?.timezone || "Asia/Kolkata" }));

    const seconds = localTime.getSeconds();
    const minutes = localTime.getMinutes();
    const hours = localTime.getHours();

    const secondDegrees = (seconds / 60) * 360;
    const minuteDegrees = ((minutes / 60) * 360) + ((seconds / 60) * 6);
    const hourDegrees = ((hours / 12) * 360) + ((minutes / 60) * 30);

    // Weather Icon Logic
    const getWeatherIcon = () => {
        if (!weather) return <Sun className="w-5 h-5 text-gray-400" />;
        const code = weather.weather_code;
        const isDay = weather.is_day === 1;

        if (code >= 95) return <CloudRain className="w-5 h-5 text-purple-400" />;
        if (code >= 71) return <CloudSnow className="w-5 h-5 text-white" />;
        if (code >= 51) return <CloudRain className="w-5 h-5 text-blue-400" />;
        if (code >= 1 && code <= 3) return <Cloud className="w-5 h-5 text-gray-400" />;

        return isDay ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-300" />;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
                relative w-full overflow-hidden rounded-2xl p-4 sm:p-6 flex items-center justify-between gap-4 sm:gap-6 transition-all duration-300
                
                /* --- LIGHT MODE (Matches Card.jsx) --- */
                ${!isDark ? `
                    bg-slate-100
                    shadow-[12px_12px_24px_#cbd5e1,-12px_-12px_24px_#ffffff]
                    border border-white/40
                ` : ''}

                /* --- DARK MODE (Matches Card.jsx) --- */
                ${isDark ? `
                    bg-[#0f172a]
                    shadow-[10px_10px_20px_#05080f,-10px_-10px_20px_rgba(255,255,255,0.03)]
                    border border-slate-800/30
                ` : ''}
            `}
        >
            {/* LEFT: Weather Info */}
            <div className="flex flex-col justify-between h-full z-10 w-1/2">
                <div>
                    <div className={`flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase mb-1 ${isDark ? 'text-[rgb(var(--accent))]' : 'text-blue-600'}`}>
                        <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span className="truncate max-w-[80px] sm:max-w-[100px]">{coords?.name || "Locating..."}</span>
                    </div>
                    <div className={`text-2xl sm:text-3xl font-light tracking-tighter ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>
                        {weather ? Math.round(weather.temperature_2m) : '--'}°
                    </div>
                </div>

                <div className="mt-3 sm:mt-4 flex flex-col gap-1.5 sm:gap-2">
                    <div className={`flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {getWeatherIcon()}
                        <span>{weather?.is_day === 1 ? 'Day' : 'Night'}</span>
                    </div>
                    {weather?.wind_speed_10m && (
                        <div className={`flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            <Wind className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            <span>{weather.wind_speed_10m} km/h</span>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: Analog Clock (Neumorphic Inset) */}
            <div className={`
                relative w-24 h-24 sm:w-32 sm:h-32 rounded-full flex-shrink-0 flex items-center justify-center
                /* Inner Shadow to create the "Dent" effect matching the theme */
                ${isDark
                    ? 'bg-[#0f172a] shadow-[inset_5px_5px_10px_#05080f,inset_-5px_-5px_10px_rgba(255,255,255,0.03)]'
                    : 'bg-slate-100 shadow-[inset_6px_6px_12px_#cbd5e1,inset_-6px_-6px_12px_#ffffff]'
                }
            `}>
                {/* Clock Face Markers */}
                {[0, 90, 180, 270].map((deg) => (
                    <div
                        key={deg}
                        className={`absolute w-0.5 sm:w-1 h-1.5 sm:h-2 ${isDark ? 'bg-slate-600' : 'bg-slate-400'}`}
                        style={{ transform: `rotate(${deg}deg) translateY(-${deg === 0 || deg === 180 ? '32' : '32'}px)`, transformOrigin: 'center' }}
                    />
                ))}

                {/* Hour Hand */}
                <div
                    className={`absolute w-1 sm:w-1.5 h-6 sm:h-8 rounded-full origin-bottom z-10 ${isDark ? 'bg-slate-200' : 'bg-slate-700'}`}
                    style={{
                        transform: `rotate(${hourDegrees}deg) translateY(-50%)`,
                        bottom: '50%'
                    }}
                />

                {/* Minute Hand */}
                <div
                    className={`absolute w-0.5 sm:w-1 h-8 sm:h-11 rounded-full origin-bottom z-20 ${isDark ? 'bg-slate-400' : 'bg-slate-500'}`}
                    style={{
                        transform: `rotate(${minuteDegrees}deg) translateY(-50%)`,
                        bottom: '50%'
                    }}
                />

                {/* Second Hand */}
                <div
                    className="absolute w-[2px] sm:w-0.5 h-9 sm:h-12 rounded-full origin-bottom z-30 bg-[rgb(var(--accent))]"
                    style={{
                        transform: `rotate(${secondDegrees}deg) translateY(-30%)`,
                        bottom: '50%'
                    }}
                />

                {/* Center Dot */}
                <div className={`absolute w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full z-40 border-2 ${isDark ? 'bg-[#0f172a] border-[rgb(var(--accent))]' : 'bg-slate-100 border-[rgb(var(--accent))]'}`} />
            </div>

        </motion.div>
    );
};

export default ClockWeatherCard;