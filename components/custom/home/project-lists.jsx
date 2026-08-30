import React from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import fetcher from '@/utils/fetcher';
import { ProjectCard } from '@/components/ui';
import { useIntl } from 'react-intl';

export default function ProjectLists({ 
    onOpenEdit, 
    onDelete, 
    onAddStudent, 
    onRemoveStudent, 
    onToggleLeader, 
    onMoveStudent 
}) {
    const router = useRouter();
    
    const buildQueryString = () => {
        const params = new URLSearchParams();
        if (router.query.name) params.append('name', router.query.name);
        if (router.query.member) params.append('member', router.query.member);
        if (router.query.status) params.append('status', router.query.status);
        if (router.query.category) params.append('category', router.query.category);
        
        const queryString = params.toString();
        return queryString ? `projects?${queryString}` : 'projects';
    };

    const url = buildQueryString();
    const { data, error, isLoading } = useSWR(url, (u) => fetcher(u, {}, {}, true));

    const intl = useIntl();

    const categoryMap = {
        trial: "トライアル",
        it: "IT・開発",
        video: "動画制作",
        light_work: "軽作業"
    };

    const statusMap = {
        planned: "計画中",
        active: "稼働中",
        done: "完了"
    };

    if (isLoading) {
        return <div className="p-4 text-center text-gray-500 w-full">{intl.formatMessage({ id: '読み込み中...' })}</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500 w-full">{intl.formatMessage({ id: 'エラーが発生しました' })}</div>;
    }

    const projects = data?.data || [];

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-8">
            {projects.length > 0 ? (
                projects.map((project) => {
                    const mappedCategory = categoryMap[project.category] || "コワーク";
                    const mappedStatus = statusMap[project.status] || "計画中";
                    const tags = [
                        { label: intl.formatMessage({ id: mappedCategory }), variant: project.category || "trial" }, 
                        { label: intl.formatMessage({ id: mappedStatus }), variant: project.status || "active" }
                    ];
                    
                    const startDate = project.start_date?.replace(/-/g, '/') || '';
                    const endDate = project.end_date ? project.end_date.replace(/-/g, '/') : intl.formatMessage({ id: '現在' });
                    const dateRange = `${startDate} 〜 ${endDate}`;
                    
                    const studentsData = project.members
                        ?.filter(m => !m.left_at)
                        ?.map(m => ({
                            id: m.student.id, // Must pass DB uuid instead of student_code to map back to db membership operations
                            avatar: m.student.avatar_url || '/images/avatar-1.png',
                            name: m.student.full_name,
                            isLeader: m.is_leader,
                            katakana: m.student.kana_name,
                            studentCode: m.student.student_code,
                            status: m.student.skill_rank,
                            workStatus: m.student.work_status,
                            gradDate: m.student.grad_year_month,
                            groupCount: m.student.concurrent_projects_count
                        })) || [];

                    return (
                        <ProjectCard 
                            key={project.id} 
                            id={project.id}
                            title={project.name} 
                            tags={tags} 
                            dateRange={dateRange} 
                            coverImage="/images/project-img.png" 
                            students={studentsData} 
                            onEdit={() => onOpenEdit?.(project)}
                            onDelete={() => onDelete?.(project.id)}
                            onAddStudent={() => onAddStudent?.(project)}
                            onRemoveStudent={(studentId) => onRemoveStudent?.(project.id, studentId)}
                            onToggleLeader={(studentId, currentIsLeader) => onToggleLeader?.(project, studentId, currentIsLeader)}
                            onMoveStudent={onMoveStudent}
                        />
                    );
                })
            ) : (
                <div className="w-full text-center py-8 text-gray-500 col-span-full">
                    {intl.formatMessage({ id: 'プロジェクトが見つかりませんでした' })}
                </div>
            )}
        </div>
    );
}
