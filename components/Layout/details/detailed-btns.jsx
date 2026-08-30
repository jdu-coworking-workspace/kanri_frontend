'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from '@/context/useTheme'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser, logout } from '@/redux/slice/auth'
import { useIntl } from 'react-intl'
import { LogOut } from 'lucide-react'

// Tillar ro'yxati
const LANGUAGES = [
    { code: 'uz', label: 'Oʻzbek' },
    { code: 'ru', label: 'Русский' },
    { code: 'en', label: 'English' },
    { code: 'jp', label: '日本語' },
]

export default function DetailedBtns() {
    const router = useRouter()
    const dispatch = useDispatch()
    const intl = useIntl()
    const { locale, pathname, query, asPath } = router
    const { isDarkMode, toggleTheme } = useTheme();
    const { user } = useSelector((state) => state.auth);
    const username = user?.full_name || "ムハッマ-ドソリフ";

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

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser());
        } catch (e) {
            console.error("Logout error:", e);
        } finally {
            dispatch(logout());
            router.push('/auth/login');
        }
    };

    return (
        <div className="flex items-center gap-2">
            {/* 1. Foydalanuvchi profili tugmasi */}
            <div
                className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 rounded-xl text-gray-700 dark:text-gray-200 text-sm font-medium"
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
            </div>

            {/* 2. Language Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-kanri-primary dark:hover:border-kanri-primary text-gray-700 dark:text-gray-200 transition-colors duration-300"
                    title={intl.formatMessage({ id: 'selectLanguage' })}
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
                title={intl.formatMessage({ id: isDarkMode ? 'lightMode' : 'darkMode' })}
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

            {/* 4. Logout Button */}
            <button
                onClick={handleLogout}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-red-500 hover:text-red-500 dark:hover:border-red-500 text-gray-700 dark:text-gray-200 transition-colors duration-300"
                title={intl.formatMessage({ id: 'logout' }) || 'Logout'}
            >
                <LogOut className="w-4.5 h-4.5" />
            </button>
        </div>
    )
}