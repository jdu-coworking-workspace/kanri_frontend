import { BaseInput } from '@/components/ui'
import React from 'react'
import { useIntl } from 'react-intl'

export default function StudentSearchBox() {
    const intl = useIntl();

    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-kanri-primary dark:text-white">{intl.formatMessage({ id: "学生フィルター" })}</h3>
            <div className="flex flex-row gap-2 w-full">
                <BaseInput placeholder={intl.formatMessage({ id: "氏名・フリガナ・学籍番号" })} containerClassName="w-full" />
                <button type="button" className="shrink-0 w-[42px] h-[42px] rounded-md bg-kanri-secondary flex items-center justify-center hover:bg-kanri-secondary/80 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5 17.5L12.5 12.5M14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
