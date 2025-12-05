import React, { useEffect, useRef } from 'react';
import { Volume2, VolumeX, CloudRain } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export default function AmbientPlayer() {
    const { isAmbientPlaying, setIsAmbientPlaying, volume, setVolume } = useStudy();
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            if (isAmbientPlaying) {
                audioRef.current.play().catch(e => console.log("Audio play failed:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isAmbientPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    return (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <CloudRain className="w-5 h-5 text-blue-500" />
                    Ambient Sound
                </h3>
                <button
                    onClick={() => setIsAmbientPlaying(!isAmbientPlaying)}
                    className={`p-2 rounded-full transition-colors ${isAmbientPlaying ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                        }`}
                >
                    {isAmbientPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
            </div>

            <div className="flex items-center gap-3">
                <VolumeX className="w-4 h-4 text-gray-400" />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <Volume2 className="w-4 h-4 text-gray-400" />
            </div>

            <audio ref={audioRef} src="/sounds/rain.mp3" loop />
        </div>
    );
}
