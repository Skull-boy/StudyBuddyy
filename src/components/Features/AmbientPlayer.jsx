import React, { useEffect, useRef } from 'react';
import { Volume2, VolumeX, CloudRain, Music, Sliders } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

const TRACKS = [
    { id: 'rain', name: 'Heavy Rain', path: '/sounds/rain.mp3', icon: CloudRain },
    { id: 'ambient', name: 'Deep Focus', path: '/sounds/ambient.mp3', icon: Music }
];

export default function AmbientPlayer() {
    const { isAmbientPlaying, setIsAmbientPlaying, soundVolumes, updateTrackVolume } = useStudy();
    const audioRefs = useRef({});

    // Initialize/Update Audio Volumes
    useEffect(() => {
        TRACKS.forEach(track => {
            const audio = audioRefs.current[track.id];
            if (audio) {
                audio.volume = soundVolumes[track.id] || 0;
            }
        });
    }, [soundVolumes]);

    // Handle Play/Pause Global Toggle
    useEffect(() => {
        TRACKS.forEach(track => {
            const audio = audioRefs.current[track.id];
            if (audio) {
                if (isAmbientPlaying) {
                    // Only play if it has volume, otherwise it's just silent playing which is fine
                    // But to prevent noise, let's just play all and let volume control output
                    audio.play().catch(e => console.log(`Play error ${track.id}:`, e));
                } else {
                    audio.pause();
                }
            }
        });
    }, [isAmbientPlaying]);

    // Loop Fix: Ensure they loop
    useEffect(() => {
        TRACKS.forEach(track => {
            if (audioRefs.current[track.id]) {
                audioRefs.current[track.id].loop = true;
            }
        });
    }, []);

    return (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-indigo-500" />
                    Sound Mixer
                </h3>
                <button
                    onClick={() => setIsAmbientPlaying(!isAmbientPlaying)}
                    className={`p-3 rounded-xl transition-all shadow-sm ${isAmbientPlaying
                        ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-500/20'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                >
                    {isAmbientPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                {TRACKS.map((track) => {
                    const Icon = track.icon;
                    const vol = soundVolumes[track.id] || 0;

                    return (
                        <div key={track.id} className="bg-white/50 p-4 rounded-2xl border border-white/40">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${vol > 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold text-gray-700 text-sm">{track.name}</span>
                                </div>
                                <span className="text-xs font-mono text-gray-400">{Math.round(vol * 100)}%</span>
                            </div>

                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={vol}
                                onChange={(e) => updateTrackVolume(track.id, parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-600 transition-all"
                            />

                            {/* Hidden Audio Element */}
                            <audio
                                ref={el => audioRefs.current[track.id] = el}
                                src={track.path}
                                loop
                            />
                        </div>
                    );
                })}
            </div>

            {!isAmbientPlaying && (
                <div className="mt-4 text-center text-xs text-gray-400 font-medium bg-gray-50 py-2 rounded-lg">
                    Mixer Paused
                </div>
            )}
        </div>
    );
}
