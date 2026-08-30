import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'

const links = [
    {
        id: 1,
        name: "プロジェクト",
        icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.33333 2.66675H6L8 4.66675H12.6667C13.0203 4.66675 13.3594 4.80722 13.6095 5.05727C13.8595 5.30732 14 5.64646 14 6.00008V11.3334C14 11.687 13.8595 12.0262 13.6095 12.2762C13.3594 12.5263 13.0203 12.6667 12.6667 12.6667H3.33333C2.97971 12.6667 2.64057 12.5263 2.39052 12.2762C2.14048 12.0262 2 11.687 2 11.3334V4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        url: "/dashboard"
    },
    {
        id: 2,
        name: "学生",
        icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 14V12.6667C2 11.9594 2.28095 11.2811 2.78105 10.781C3.28115 10.281 3.95942 10 4.66667 10H7.33333C8.04058 10 8.71885 10.281 9.21895 10.781C9.71905 11.2811 10 11.9594 10 12.6667V14M10.6667 2.08667C11.2403 2.23354 11.7487 2.56714 12.1118 3.03488C12.4748 3.50262 12.6719 4.07789 12.6719 4.67C12.6719 5.26212 12.4748 5.83739 12.1118 6.30513C11.7487 6.77287 11.2403 7.10647 10.6667 7.25334M14 14V12.6667C13.9966 12.0781 13.7986 11.5072 13.4368 11.043C13.0751 10.5787 12.5699 10.2471 12 10.1M8.66667 4.66667C8.66667 6.13943 7.47276 7.33333 6 7.33333C4.52724 7.33333 3.33333 6.13943 3.33333 4.66667C3.33333 3.19391 4.52724 2 6 2C7.47276 2 8.66667 3.19391 8.66667 4.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        url: "/dashboard/students"
    },
    {
        id: 3,
        name: "設定",
        icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.88333 2.878C7.16733 1.70733 8.83267 1.70733 9.11667 2.878C9.15928 3.05387 9.24281 3.21719 9.36047 3.35467C9.47813 3.49215 9.62659 3.5999 9.79377 3.66916C9.96094 3.73843 10.1421 3.76723 10.3225 3.75325C10.5029 3.73926 10.6775 3.68287 10.832 3.58867C11.8607 2.962 13.0387 4.13933 12.412 5.16867C12.3179 5.3231 12.2616 5.49756 12.2477 5.67785C12.2337 5.85814 12.2625 6.03918 12.3317 6.20625C12.4009 6.37333 12.5085 6.52172 12.6458 6.63937C12.7831 6.75702 12.9463 6.8406 13.122 6.88333C14.2927 7.16733 14.2927 8.83267 13.122 9.11667C12.9461 9.15928 12.7828 9.24281 12.6453 9.36047C12.5079 9.47813 12.4001 9.62659 12.3308 9.79377C12.2616 9.96094 12.2328 10.1421 12.2468 10.3225C12.2607 10.5029 12.3171 10.6775 12.4113 10.832C13.038 11.8607 11.8607 13.0387 10.8313 12.412C10.6769 12.3179 10.5024 12.2616 10.3222 12.2477C10.1419 12.2337 9.96082 12.2625 9.79375 12.3317C9.62667 12.4009 9.47828 12.5085 9.36063 12.6458C9.24298 12.7831 9.1594 12.9463 9.11667 13.122C8.83267 14.2927 7.16733 14.2927 6.88333 13.122C6.84072 12.9461 6.75719 12.7828 6.63953 12.6453C6.52187 12.5079 6.37341 12.4001 6.20623 12.3308C6.03906 12.2616 5.85789 12.2328 5.67748 12.2468C5.49706 12.2607 5.3225 12.3171 5.168 12.4113C4.13933 13.038 2.96133 11.8607 3.588 10.8313C3.68207 10.6769 3.73837 10.5024 3.75232 10.3222C3.76628 10.1419 3.7375 9.96082 3.66831 9.79375C3.59913 9.62667 3.49151 9.47828 3.35418 9.36063C3.21686 9.24298 3.05371 9.1594 2.878 9.11667C1.70733 8.83267 1.70733 7.16733 2.878 6.88333C3.05387 6.84072 3.21719 6.75719 3.35467 6.63953C3.49215 6.52187 3.5999 6.37341 3.66916 6.20623C3.73843 6.03906 3.76723 5.85789 3.75325 5.67748C3.73926 5.49706 3.68287 5.3225 3.58867 5.168C2.962 4.13933 4.13933 2.96133 5.16867 3.588C5.83533 3.99333 6.69933 3.63467 6.88333 2.878Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        url: "/dashboard/settings"
    }
]

export default function MenuTabs() {
    const router = useRouter()
    const intl = useIntl()

    return (
        <div className="container">
            <div className="flex items-center py-3 sm:py-5 overflow-x-auto no-scrollbar">
                {links.map((link) => {
                    // URL mosligini aniqlash (Exact match yoki sub-path bo'yicha)
                    const isActive = router.pathname === link.url

                    return (
                        <Link
                            key={link.id}
                            href={link.url}
                            className={`
                flex items-center gap-2 
                px-3 sm:px-5 py-2 
                whitespace-nowrap 
                text-sm sm:text-base font-medium 
                border-b-2 transition-all duration-300
                ${isActive
                                    ? "border-kanri-primary text-kanri-primary dark:border-white dark:text-white"
                                    : "border-[#D4D7E3] text-kanri-third dark:text-gray-500 dark:border-gray-500 hover:text-kanri-primary dark:hover:text-white"
                                }
              `}
                        >
                            <span className="flex items-center justify-center">
                                {link.icon}
                            </span>
                            <span>{intl.formatMessage({ id: link.name })}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}