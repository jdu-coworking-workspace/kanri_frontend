'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTheme } from '@/context/useTheme'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser, logout } from '@/redux/slice/auth'
import { useIntl } from 'react-intl'
import { LogOut, Menu, User, Globe, Moon, Sun, X } from 'lucide-react'

const LANGUAGES = [
    { code: 'uz', label: 'Oʻzbek' },
    { code: 'ru', label: 'Русский' },
    { code: 'en', label: 'English' },
    { code: 'jp', label: '日本語' },
]

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    const router = useRouter()
    const dispatch = useDispatch()
    const intl = useIntl()
    const { locale, pathname, query, asPath } = router
    const { isDarkMode, toggleTheme } = useTheme();
    const { user } = useSelector((state) => state.auth);
    const username = user?.full_name || "User";

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
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
        <div className="relative lg:hidden ml-2" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-kanri-primary dark:hover:border-kanri-primary text-gray-700 dark:text-gray-200 transition-colors duration-300"
            >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700/80">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-kanri-primary/10 dark:bg-gray-700 flex items-center justify-center text-kanri-primary dark:text-gray-300 shrink-0">
                                <User className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-bold text-gray-900 dark:text-white truncate w-full">{username}</span>
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 capitalize">{user?.role || 'Staff'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-2 space-y-1">
                        <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                            {intl.formatMessage({ id: 'selectLanguage' }) || 'Language'}
                        </div>
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    router.push({ pathname, query }, asPath, { locale: lang.code })
                                    setIsOpen(false)
                                }}
                                className={`w-full text-left px-3 py-2 rounded-xl text-sm flex items-center justify-between transition-colors ${
                                    locale === lang.code
                                        ? 'bg-kanri-primary/10 text-kanri-primary dark:bg-gray-700/60 dark:text-kanri-primary font-bold'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 opacity-70" />
                                    {lang.label}
                                </span>
                                {locale === lang.code && <span className="w-1.5 h-1.5 rounded-full bg-kanri-primary" />}
                            </button>
                        ))}
                    </div>

                    <div className="p-2 border-t border-gray-100 dark:border-gray-700/80 space-y-1">
                        <button
                            onClick={() => {
                                toggleTheme();
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-sm flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            {isDarkMode ? <Sun className="w-4 h-4 opacity-70" /> : <Moon className="w-4 h-4 opacity-70" />}
                            <span>{intl.formatMessage({ id: isDarkMode ? 'lightMode' : 'darkMode' })}</span>
                        </button>
                        
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 rounded-xl text-sm flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <LogOut className="w-4 h-4 opacity-70" />
                            <span>{intl.formatMessage({ id: 'logout' }) || 'Logout'}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
