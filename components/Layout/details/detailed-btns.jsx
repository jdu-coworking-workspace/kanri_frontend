'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from '@/context/useTheme'

// Tillar ro'yxati
const LANGUAGES = [
    { code: 'uz', label: 'Oʻzbek' },
    { code: 'ru', label: 'Русский' },
    { code: 'en', label: 'English' },
    { code: 'jp', label: '日本語' },
]

export default function DetailedBtns({ username = "ムハッマ-ドソリフ" }) {
    const router = useRouter()
    const { locale, pathname, query, asPath } = router
    const { isDarkMode, toggleTheme } = useTheme();

    const [isLangOpen, setIsLangOpen] = useState(false)
    const dropdownRef = useRef(null)

    // Dropdown tashqarisiga bosilganda yopish
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsLangOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])


    return (
        <div className="flex items-center gap-2">
            {/* 1. Foydalanuvchi profili tugmasi */}
            <Link
                href={`/${locale}/settings`}
                className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 rounded-xl text-gray-700 dark:text-gray-200 text-sm font-medium hover:border-kanri-primary dark:hover:border-kanri-primary transition-colors duration-300"
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M2.5 16.6667C4.44649 14.6021 7.08918 13.3333 10 13.3333C12.9108 13.3333 15.5535 14.6021 17.5 16.6667M13.75 6.25C13.75 8.32107 12.0711 10 10 10C7.92893 10 6.25 8.32107 6.25 6.25C6.25 4.17893 7.92893 2.5 10 2.5C12.0711 2.5 13.75 4.17893 13.75 6.25Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <span>{username}</span>
            </Link>

            {/* 2. Language Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-kanri-primary dark:hover:border-kanri-primary text-gray-700 dark:text-gray-200 transition-colors duration-300"
                    title="Tilni tanlash"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M3.00001 7.5H17M3.00001 12.5H17M9.58331 2.5C8.17943 4.74968 7.43515 7.34822 7.43515 10C7.43515 12.6518 8.17943 15.2503 9.58331 17.5M10.4167 2.5C11.8205 4.74968 12.5648 7.34822 12.5648 10C12.5648 12.6518 11.8205 15.2503 10.4167 17.5M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                {isLangOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 z-50 overflow-hidden transition-all">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    router.push({ pathname, query }, asPath, { locale: lang.code })
                                    setIsLangOpen(false)
                                }}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${locale === lang.code
                                    ? 'font-bold text-kanri-primary dark:text-kanri-primary bg-gray-50 dark:bg-gray-700/50'
                                    : 'text-gray-600 dark:text-gray-300'
                                    }`}
                            >
                                <span>{lang.label}</span>
                                <span className="uppercase text-xs opacity-60">{lang.code}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 3. Dark/Light Mode Toggle */}
            <button
                onClick={toggleTheme}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-kanri-primary dark:hover:border-kanri-primary text-gray-700 dark:text-gray-200 transition-colors duration-300"
                title={isDarkMode ? 'Light mode' : 'Dark mode'}
            >
                {isDarkMode ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
                        <path
                            d="M10 2V3.5M10 16.5V18M18 10H16.5M3.5 10H2M15.657 4.343L14.596 5.404M5.404 14.596L4.343 15.657M15.657 15.657L14.596 14.596M5.404 5.404L4.343 4.343"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </svg>
                ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10 2.50007C10.11 2.50007 10.2192 2.50007 10.3275 2.50007C9.25697 3.49483 8.56885 4.83328 8.38276 6.28276C8.19668 7.73224 8.5244 9.2011 9.30897 10.434C10.0935 11.6669 11.2853 12.5859 12.6772 13.0313C14.0691 13.4767 15.573 13.4202 16.9275 12.8717C16.4065 14.1255 15.5548 15.2143 14.4635 16.022C13.3722 16.8296 12.0821 17.3259 10.7308 17.4579C9.3795 17.5899 8.01774 17.3525 6.79076 16.7712C5.56379 16.1899 4.51762 15.2865 3.76385 14.1572C3.01008 13.028 2.57698 11.7153 2.51076 10.3592C2.44454 9.00312 2.74767 7.65449 3.38783 6.45717C4.02799 5.25985 4.98116 4.25876 6.14566 3.56069C7.31016 2.86261 8.64231 2.49374 10 2.49341V2.50007Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
            </button>

            {/* 4. Sozlamalar tugmasi */}
            <Link
                href={`/${locale}/settings`}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-kanri-primary dark:hover:border-kanri-primary text-gray-700 dark:text-gray-200 transition-colors duration-300"
                title="Sozlamalar"
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M8.60417 3.5975C8.95917 2.13417 11.0408 2.13417 11.3958 3.5975C11.4491 3.81733 11.5535 4.02148 11.7006 4.19333C11.8477 4.36518 12.0332 4.49988 12.2422 4.58645C12.4512 4.67303 12.6776 4.70904 12.9032 4.69156C13.1287 4.67407 13.3469 4.60359 13.54 4.48583C14.8258 3.7025 16.2983 5.17417 15.515 6.46083C15.3974 6.65388 15.327 6.87195 15.3096 7.09731C15.2922 7.32267 15.3281 7.54897 15.4146 7.75782C15.5011 7.96666 15.6356 8.15215 15.8073 8.29921C15.9789 8.44627 16.1829 8.55075 16.4025 8.60417C17.8658 8.95917 17.8658 11.0408 16.4025 11.3958C16.1827 11.4491 15.9785 11.5535 15.8067 11.7006C15.6348 11.8477 15.5001 12.0332 15.4135 12.2422C15.327 12.4512 15.291 12.6776 15.3084 12.9032C15.3259 13.1287 15.3964 13.3469 15.5142 13.54C16.2975 14.8258 14.8258 16.2983 13.5392 15.515C13.3461 15.3974 13.1281 15.327 12.9027 15.3096C12.6773 15.2922 12.451 15.3281 12.2422 15.4146C12.0333 15.5011 11.8479 15.6356 11.7008 15.8073C11.5537 15.9789 11.4492 16.1829 11.3958 16.4025C11.0408 17.8658 8.95917 17.8658 8.60417 16.4025C8.5509 16.1827 8.44648 15.9785 8.29941 15.8067C8.15233 15.6348 7.96676 15.5001 7.75779 15.4135C7.54882 15.327 7.32236 15.291 7.09685 15.3084C6.87133 15.3259 6.65313 15.3964 6.46 15.5142C5.17417 16.2975 3.70167 14.8258 4.485 13.5392C4.60258 13.3461 4.67296 13.1281 4.6904 12.9027C4.70785 12.6773 4.67187 12.451 4.58539 12.2422C4.49892 12.0333 4.36438 11.8479 4.19273 11.7008C4.02107 11.5537 3.81714 11.4492 3.5975 11.3958C2.13417 11.0408 2.13417 8.95917 3.5975 8.60417C3.81733 8.5509 4.02148 8.44648 4.19333 8.29941C4.36518 8.15233 4.49988 7.96676 4.58645 7.75779C4.67303 7.54882 4.70904 7.32236 4.69156 7.09685C4.67407 6.87133 4.60359 6.65313 4.48583 6.46C3.7025 5.17417 5.17417 3.70167 6.46083 4.485C7.29417 4.99167 8.37417 4.54333 8.60417 3.5975Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </Link>
        </div>
    )
}