import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export default function Stats() {
    const { dailyStats } = useStudy();

    // Generate last 7 days data
    const data = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dateKey = d.toLocaleDateString('en-CA');
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

        // Get seconds, convert to hours (stats stored in seconds)
        // If undefined, 0
        const seconds = dailyStats[dateKey] || 0;
        const hours = parseFloat((seconds / 3600).toFixed(2));

        return {
            name: dayName,
            fullDate: dateKey,
            hours: hours
        };
    });

    return (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 h-full flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="bg-pink-100 p-2 rounded-lg text-pink-600">
                    <Activity className="w-5 h-5" />
                </span>
                Activity (Hours)
            </h3>

            <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            dy={10}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(99, 102, 241, 0.1)', radius: 8 }}
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(8px)'
                            }}
                            formatter={(value) => [`${value} hrs`, 'Study Time']}
                        />
                        <Bar dataKey="hours" radius={[6, 6, 6, 6]}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={index === 6 ? '#8b5cf6' : '#c4b5fd'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
