import React from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import fetcher from '@/utils/fetcher';
import { StudentCard } from '@/components/ui';
import { useIntl } from 'react-intl';

export default function StudentLists({ onOpenEdit }) {
    const router = useRouter();
    const intl = useIntl();
    // Get search query from URL (?sq=xxx for dashboard home page student filter)
    const searchQuery = router.query.sq || '';

    const url = searchQuery ? `students?q=${encodeURIComponent(searchQuery)}` : 'students';
    const { data, error, isLoading } = useSWR(url, (u) => fetcher(u, {}, {}, true));

    if (isLoading) {
        return <div className="p-4 text-center text-gray-500">{intl.formatMessage({ id: '読み込み中...' })}</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">{intl.formatMessage({ id: 'エラーが発生しました' })}</div>;
    }

    const students = data?.data || [];

    return (
        <div className="flex flex-col gap-2 h-[480px] overflow-y-auto no-scrollbar">
            {students.length > 0 ? (
                students.map((student) => (
                    <StudentCard 
                        key={student.id} 
                        id={student.id}
                        avatar={student.avatar_url || '/images/avatar-1.png'} 
                        name={student.full_name} 
                        status={student.skill_rank || 'A'} 
                        workStatus={student.work_status}
                        gradDate={student.grad_year_month}
                        katakana={student.kana_name} 
                        studentId={student.student_code} 
                        isLeader={false}
                        groupCount={student.concurrent_projects_count || 0}
                        onClick={() => onOpenEdit?.(student)}
                    />
                ))
            ) : (
                <div className="w-full text-center py-8 text-gray-500">
                    {intl.formatMessage({ id: '学生が見つかりませんでした' })}
                </div>
            )}
        </div>
    );
}
