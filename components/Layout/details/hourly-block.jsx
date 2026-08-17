'use client'

import React, { useState, useEffect } from 'react'

const TIME_ZONES = [
    {
        code: 'UZT',
        zone: 'Asia/Tashkent',
        flag: '/images/uzb-flag.svg',
        alt: 'uzb-flag'
    },
    {
        code: 'JST',
        zone: 'Asia/Tokyo',
        flag: '/images/jp-flag.svg',
        alt: 'jp-flag'
    }
]

export default function HourlyBlock() {
    const [time, setTime] = useState(null)

    useEffect(() => {
        setTime(new Date())

        const timer = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const formatTime = (timeZone) => {
        if (!time) return '--:--:--'

        return time.toLocaleTimeString('en-GB', {
            timeZone,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })
    }

    return (
        <>
            {TIME_ZONES.map((item) => (
                <div
                    key={item.code}
                    className="p-2 sm:p-3 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center gap-2 border border-transparent dark:border-gray-700 transition-colors duration-300"
                >
                    <img
                        src={item.flag}
                        alt={item.alt}
                        title={item.alt}
                        loading="lazy"
                        className="sm:block hidden"
                    />
                    <div className="flex flex-col items-start">
                        <p className="text-kanri-secondary dark:text-gray-400 font-bold text-[6px] sm:text-[8px] leading-2">
                            {item.code}
                        </p>
                        <h5 className="text-kanri-primary dark:text-gray-100 font-bold text-xs sm:text-[14px] leading-3 sm:leading-[14px]">
                            {formatTime(item.zone)}
                        </h5>
                    </div>
                </div>
            ))}
        </>
    )
}