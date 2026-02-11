'use client';

import { useEffect, useState } from 'react';

type ClockState = {
    dateLabel: string;
    timeLabel: string;
    zoneLabel: string;
};

function getZoneLabel(): string {
    return 'BODRUM';
}

export default function LiveClock() {
    const [clock, setClock] = useState<ClockState>(() => {
        const now = new Date();
        return {
            dateLabel: new Intl.DateTimeFormat('tr-TR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }).format(now),
            timeLabel: new Intl.DateTimeFormat('tr-TR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            }).format(now),
            zoneLabel: getZoneLabel(),
        };
    });

    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setClock({
                dateLabel: new Intl.DateTimeFormat('tr-TR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }).format(now),
                timeLabel: new Intl.DateTimeFormat('tr-TR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                }).format(now),
                zoneLabel: getZoneLabel(),
            });
        };

        const interval = window.setInterval(tick, 1000);
        return () => window.clearInterval(interval);
    }, []);

    return (
        <span>
            {clock.dateLabel} {clock.timeLabel} {clock.zoneLabel}
        </span>
    );
}
