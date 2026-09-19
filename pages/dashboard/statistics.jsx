import React, { useState } from 'react';
import useSWR from 'swr';
import { MenuTabs } from '@/components/custom';
import Seo from '@/components/Seo/Seo';
import { authAxios } from '@/utils/axios';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { 
    Users, 
    FolderKanban, 
    Briefcase, 
    Award, 
    TrendingUp, 
    RefreshCw, 
    CheckCircle2, 
    Clock, 
    PlayCircle, 
    XCircle,
    Star,
    Layers,
    UserX,
    Filter,
    Calendar,
    ArrowUpRight,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

const fetcher = (url) => authAxios.get(url).then((res) => res.data);

export default function MasterStatisticsPage() {
    const intl = useIntl();
    
    // Filter States
    const [period, setPeriod] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Build SWR API URL with filters
    const apiUrl = `statistics/summary?period=${period}&status_filter=${statusFilter}&category_filter=${categoryFilter}`;

    const { data, error, isLoading, mutate } = useSWR(apiUrl, fetcher, {
        revalidateOnFocus: true,
        refreshInterval: 30000,
    });

    const kpi = data?.kpi;
    const projectStatuses = data?.project_statuses || [];
    const skillRanks = data?.skill_ranks || [];
    const topStudents = data?.top_students || [];
    const unassignedStudentsList = data?.unassigned_students_list || [];
    const staffWorkloads = data?.staff_workloads || [];
    const monthlyTrends = data?.monthly_trends || [];

    // Helper for Skill Rank Badge Colors
    const getSkillBadgeColor = (rank) => {
        switch (rank) {
            case 'S': return 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-400/20 dark:text-amber-300';
            case 'A': return 'bg-purple-500/10 text-purple-600 border-purple-500/30 dark:bg-purple-400/20 dark:text-purple-300';
            case 'B': return 'bg-blue-500/10 text-blue-600 border-blue-500/30 dark:bg-blue-400/20 dark:text-blue-300';
            case 'C': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-400/20 dark:text-emerald-300';
            case 'D': return 'bg-orange-500/10 text-orange-600 border-orange-500/30 dark:bg-orange-400/20 dark:text-orange-300';
            default: return 'bg-gray-500/10 text-gray-600 border-gray-500/30 dark:bg-gray-400/20 dark:text-gray-300';
        }
    };

    // Helper for Status Icon & Color
    const getStatusStyle = (status) => {
        switch (status) {
            case 'active':
                return { icon: PlayCircle, color: 'text-emerald-500 bg-emerald-500/10', bar: 'bg-emerald-500' };
            case 'done':
                return { icon: CheckCircle2, color: 'text-blue-500 bg-blue-500/10', bar: 'bg-blue-500' };
            case 'planned':
                return { icon: Clock, color: 'text-amber-500 bg-amber-500/10', bar: 'bg-amber-500' };
            case 'cancelled':
                return { icon: XCircle, color: 'text-rose-500 bg-rose-500/10', bar: 'bg-rose-500' };
            default:
                return { icon: Layers, color: 'text-gray-500 bg-gray-500/10', bar: 'bg-gray-500' };
        }
    };

    // Dynamic i18n label helpers
    const formatStatusLabel = (statusKey) => {
        switch (statusKey) {
            case 'active': return intl.formatMessage({ id: 'statusActive' });
            case 'done': return intl.formatMessage({ id: 'statusDone' });
            case 'planned': return intl.formatMessage({ id: 'statusPlanned' });
            case 'cancelled': return intl.formatMessage({ id: 'statusCancelled' });
            default: return statusKey;
        }
    };

    const formatCategoryLabel = (catKey) => {
        switch (catKey) {
            case 'it': return intl.formatMessage({ id: 'categoryIT' });
            case 'video': return intl.formatMessage({ id: 'categoryVideo' });
            case 'light_work': return intl.formatMessage({ id: 'categoryLightWork' });
            case 'trial': return intl.formatMessage({ id: 'categoryTrial' });
            default: return catKey;
        }
    };

    const formatSemesterLabel = (semKey) => {
        if (!semKey) return '-';
        const numMatch = semKey.match(/\d+/);
        if (numMatch && numMatch[0]) {
            const semId = `semester${numMatch[0]}`;
            try {
                return intl.formatMessage({ id: semId });
            } catch (e) {
                return semKey;
            }
        }
        return semKey;
    };

    const maxSkillCount = Math.max(...skillRanks.map(s => s.count), 1);
    const maxTrendStudents = Math.max(...monthlyTrends.map(t => t.new_students), 1);
    const maxStaffProjects = Math.max(...staffWorkloads.map(s => s.projects_count), 1);

    return (
        <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Seo title={`${intl.formatMessage({ id: 'statsHeaderMainTitle' })} — Kanri Management`} />

            {/* Navigation Bar */}
            <MenuTabs />

            <main className="container py-6 sm:py-8 space-y-6">
                {/* Header Title Section & Filters */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 space-y-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-kanri-primary dark:text-blue-400 font-semibold text-xs tracking-wider uppercase mb-1">
                                <TrendingUp className="w-4 h-4" />
                                <span>{intl.formatMessage({ id: 'statsAnalyticsHeaderTitle' })}</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                {intl.formatMessage({ id: 'statsHeaderMainTitle' })}
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {intl.formatMessage({ id: 'statsHeaderSubTitle' })}
                            </p>
                        </div>

                        <button
                            onClick={() => mutate()}
                            disabled={isLoading}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-kanri-primary/10 text-kanri-primary hover:bg-kanri-primary hover:text-white dark:bg-blue-500/20 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-200 font-medium text-xs sm:text-sm self-start lg:self-auto shadow-sm"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            <span>{intl.formatMessage({ id: 'statsRefreshBtn' })}</span>
                        </button>
                    </div>

                    {/* Filters Controls */}
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            <Filter className="w-4 h-4 text-kanri-primary dark:text-blue-400" />
                            <span>{intl.formatMessage({ id: 'statsFilterControl' })}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                            {/* Period Filter */}
                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-600 text-xs">
                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                <select
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                    className="bg-transparent font-semibold text-gray-700 dark:text-gray-200 outline-none cursor-pointer"
                                >
                                    <option value="all" className="dark:bg-gray-800">{intl.formatMessage({ id: 'statsFilterAllTime' })}</option>
                                    <option value="month" className="dark:bg-gray-800">{intl.formatMessage({ id: 'statsFilterThisMonth' })}</option>
                                    <option value="year" className="dark:bg-gray-800">{intl.formatMessage({ id: 'statsFilterThisYear' })}</option>
                                </select>
                            </div>

                            {/* Status Filter */}
                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-600 text-xs">
                                <FolderKanban className="w-3.5 h-3.5 text-gray-400" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="bg-transparent font-semibold text-gray-700 dark:text-gray-200 outline-none cursor-pointer"
                                >
                                    <option value="all" className="dark:bg-gray-800">{intl.formatMessage({ id: 'statsAllStatuses' })}</option>
                                    <option value="active" className="dark:bg-gray-800">{intl.formatMessage({ id: 'statusActive' })}</option>
                                    <option value="done" className="dark:bg-gray-800">{intl.formatMessage({ id: 'statusDone' })}</option>
                                    <option value="planned" className="dark:bg-gray-800">{intl.formatMessage({ id: 'statusPlanned' })}</option>
                                    <option value="cancelled" className="dark:bg-gray-800">{intl.formatMessage({ id: 'statusCancelled' })}</option>
                                </select>
                            </div>

                            {/* Category Filter */}
                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-600 text-xs">
                                <Layers className="w-3.5 h-3.5 text-gray-400" />
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="bg-transparent font-semibold text-gray-700 dark:text-gray-200 outline-none cursor-pointer"
                                >
                                    <option value="all" className="dark:bg-gray-800">{intl.formatMessage({ id: 'statsAllCategories' })}</option>
                                    <option value="it" className="dark:bg-gray-800">{intl.formatMessage({ id: 'categoryIT' })}</option>
                                    <option value="video" className="dark:bg-gray-800">{intl.formatMessage({ id: 'categoryVideo' })}</option>
                                    <option value="light_work" className="dark:bg-gray-800">{intl.formatMessage({ id: 'categoryLightWork' })}</option>
                                    <option value="trial" className="dark:bg-gray-800">{intl.formatMessage({ id: 'categoryTrial' })}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading State Skeleton */}
                {isLoading && !data && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-28 bg-white dark:bg-gray-800 rounded-2xl animate-pulse p-4 border border-gray-100 dark:border-gray-700" />
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-center font-semibold text-sm">
                        {intl.formatMessage({ id: 'statsErrorOccurred' })}
                    </div>
                )}

                {data && (
                    <>
                        {/* Summary KPI Cards Grid (5 Cards) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

                            {/* Card 1: Total Students */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/60 shadow-sm flex flex-col justify-between group hover:border-blue-500/30 transition-colors">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                        {intl.formatMessage({ id: 'statsTotalStudentsCard' })}
                                    </span>
                                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                        <Users className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
                                        {kpi?.total_students}
                                    </div>
                                    <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                                        {kpi?.graduated_students_count > 0 
                                            ? intl.formatMessage({ id: 'statsGraduatedCount' }, { count: kpi.graduated_students_count })
                                            : intl.formatMessage({ id: 'statsTotalStudentsSub' })}
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Active Projects */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/60 shadow-sm flex flex-col justify-between group hover:border-emerald-500/30 transition-colors">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                        {intl.formatMessage({ id: 'statsActiveProjectsCard' })}
                                    </span>
                                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                        <FolderKanban className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-baseline gap-1">
                                        {kpi?.active_projects} <span className="text-xs font-normal text-gray-400">/ {kpi?.total_projects}</span>
                                    </div>
                                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                                        {intl.formatMessage({ id: 'statsActiveProjectsDoneSub' }, { count: kpi?.done_projects || 0 })}
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Completion Rate */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/60 shadow-sm flex flex-col justify-between group hover:border-indigo-500/30 transition-colors">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                        {intl.formatMessage({ id: 'statsCompletionRateCard' })}
                                    </span>
                                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                                        {kpi?.completion_rate_percent}%
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                                        <div style={{ width: `${kpi?.completion_rate_percent}%` }} className="h-full bg-indigo-500 rounded-full transition-all duration-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Card 4: Working Rate */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/60 shadow-sm flex flex-col justify-between group hover:border-purple-500/30 transition-colors">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                        {intl.formatMessage({ id: 'statsWorkingRateCard' })}
                                    </span>
                                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                        <Briefcase className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
                                        {kpi?.working_rate_percent}%
                                    </div>
                                    <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                                        {intl.formatMessage({ id: 'statsWorkingRateSubFormat' }, { count: kpi?.working_students || 0 })}
                                    </div>
                                </div>
                            </div>

                            {/* Card 5: Unassigned Students (Warning or Clear) */}
                            <div className={`rounded-2xl p-5 border shadow-sm flex flex-col justify-between transition-colors ${
                                kpi?.unassigned_students_count > 0 
                                    ? 'bg-rose-500/5 border-rose-500/30 dark:bg-rose-500/10 dark:border-rose-500/40' 
                                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700/60'
                            }`}>
                                <div className="flex items-center justify-between">
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${kpi?.unassigned_students_count > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-400'}`}>
                                        {intl.formatMessage({ id: 'statsUnassignedStudentsCard' })}
                                    </span>
                                    <div className={`p-2 rounded-xl ${kpi?.unassigned_students_count > 0 ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
                                        {kpi?.unassigned_students_count > 0 ? <UserX className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className={`text-2xl font-extrabold ${kpi?.unassigned_students_count > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-900 dark:text-white'}`}>
                                        {kpi?.unassigned_students_count} <span className="text-xs font-normal text-gray-400">({intl.formatMessage({ id: 'statsUnassignedBadgeText' })})</span>
                                    </div>
                                    <div className="text-[11px] font-medium mt-1 text-gray-500 dark:text-gray-400">
                                        {kpi?.unassigned_students_count > 0 
                                            ? intl.formatMessage({ id: 'statsUnassignedStudentsSubWarning' }) 
                                            : intl.formatMessage({ id: 'statsUnassignedStudentsSubOk' })}
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Section 1: Monthly Growth & Activity Trends (Full Width) */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/60 shadow-sm space-y-6">
                            <div>
                                <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-kanri-primary dark:text-blue-400" />
                                    <span>{intl.formatMessage({ id: 'statsMonthlyGrowthTitle' })}</span>
                                </h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {intl.formatMessage({ id: 'statsMonthlyGrowthSub' })}
                                </p>
                            </div>

                            {/* Trend Chart Bars */}
                            <div className="h-52 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-gray-100 dark:border-gray-700/80">
                                {monthlyTrends.map((t) => {
                                    const studentHeight = Math.max(Math.round((t.new_students / maxTrendStudents) * 100), 10);
                                    const projectHeight = Math.max(Math.min(t.created_projects * 20, 100), 10);
                                    return (
                                        <div key={t.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white dark:bg-gray-700 px-2 py-0.5 rounded-md shadow-lg">
                                                <span className="text-blue-400">{t.new_students}</span>
                                                <span>/</span>
                                                <span className="text-emerald-400">{t.created_projects}</span>
                                            </div>
                                            <div className="w-full flex items-end justify-center gap-1.5 h-full">
                                                {/* New Students Bar */}
                                                <div
                                                    style={{ height: `${studentHeight}%` }}
                                                    className="w-1/2 bg-blue-500 hover:bg-blue-600 rounded-t-md transition-all duration-300"
                                                    title={`${intl.formatMessage({ id: 'statsNewStudentsLabel' })}: ${t.new_students}`}
                                                />
                                                {/* Created Projects Bar */}
                                                <div
                                                    style={{ height: `${projectHeight}%` }}
                                                    className="w-1/2 bg-emerald-500 hover:bg-emerald-600 rounded-t-md transition-all duration-300"
                                                    title={`${intl.formatMessage({ id: 'statsCreatedProjectsLabel' })}: ${t.created_projects}`}
                                                />
                                            </div>
                                            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                                                {t.month_label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Chart Legend */}
                            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-sm" />
                                    <span>{intl.formatMessage({ id: 'statsNewStudentsLabel' })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
                                    <span>{intl.formatMessage({ id: 'statsCreatedProjectsLabel' })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Unassigned Students Spotlight Alert Banner (If present) */}
                        {unassignedStudentsList.length > 0 && (
                            <div className="bg-rose-500/5 dark:bg-rose-500/10 rounded-2xl p-5 border border-rose-500/20 space-y-4 shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <h2 className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{intl.formatMessage({ id: 'statsUnassignedSpotlightTitle' })}</span>
                                        </h2>
                                        <p className="text-xs text-rose-500/80 mt-0.5">
                                            {intl.formatMessage({ id: 'statsUnassignedSpotlightSub' })}
                                        </p>
                                    </div>
                                    <Link
                                        href="/dashboard/students"
                                        className="py-2 px-4 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors inline-flex items-center gap-2 shadow-sm self-start sm:self-auto"
                                    >
                                        <span>{intl.formatMessage({ id: 'statsGoToStudentsBtn' })}</span>
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {unassignedStudentsList.map((st) => (
                                        <div key={st.id} className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 flex items-center justify-between shadow-xs">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-600 font-bold flex items-center justify-center text-xs">
                                                    {st.full_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-xs text-gray-900 dark:text-white">
                                                        {st.full_name}
                                                    </div>
                                                    <div className="text-[10px] text-gray-400 font-mono">
                                                        {st.student_code}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${getSkillBadgeColor(st.skill_rank)}`}>
                                                {st.skill_rank || 'N/A'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Section 3: 3-Column Symmetrical Grid (Project Status, Skill Rank, Staff Workload) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {/* Card 1: Project Status Breakdown */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/60 shadow-sm space-y-4 flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div>
                                        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <FolderKanban className="w-4 h-4 text-kanri-primary dark:text-blue-400" />
                                            <span>{intl.formatMessage({ id: 'statsProjectStatusChartTitle' })}</span>
                                        </h2>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            {intl.formatMessage({ id: 'statsProjectStatusChartSub' })}
                                        </p>
                                    </div>

                                    <div className="h-3.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex">
                                        {projectStatuses.map((ps) => {
                                            const style = getStatusStyle(ps.status);
                                            return (
                                                <div
                                                    key={ps.status}
                                                    style={{ width: `${ps.percentage}%` }}
                                                    className={`h-full ${style.bar} transition-all duration-500`}
                                                    title={`${formatStatusLabel(ps.status)}: ${ps.count} (${ps.percentage}%)`}
                                                />
                                            );
                                        })}
                                    </div>

                                    <div className="space-y-2 pt-1">
                                        {projectStatuses.map((ps) => {
                                            const style = getStatusStyle(ps.status);
                                            const IconComp = style.icon;
                                            return (
                                                <div key={ps.status} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700/60">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={`p-1.5 rounded-lg ${style.color}`}>
                                                            <IconComp className="w-3.5 h-3.5" />
                                                        </div>
                                                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                                            {formatStatusLabel(ps.status)}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-xs font-extrabold text-gray-900 dark:text-white">
                                                            {ps.count}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 ml-1">
                                                            ({ps.percentage}%)
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Skill Ranks Breakdown */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/60 shadow-sm space-y-4 flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div>
                                        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <Award className="w-4 h-4 text-amber-500" />
                                            <span>{intl.formatMessage({ id: 'statsSkillRankChartTitle' })}</span>
                                        </h2>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            {intl.formatMessage({ id: 'statsSkillRankChartSub' })}
                                        </p>
                                    </div>

                                    <div className="space-y-3 pt-1">
                                        {skillRanks.map((item) => {
                                            const percent = Math.round((item.count / maxSkillCount) * 100);
                                            return (
                                                <div key={item.rank} className="space-y-1">
                                                    <div className="flex justify-between items-center text-xs font-medium">
                                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${getSkillBadgeColor(item.rank)}`}>
                                                            Rank {item.rank}
                                                        </span>
                                                        <span className="text-gray-900 dark:text-white font-bold">
                                                            {item.count} <span className="text-[11px] font-normal text-gray-400">{intl.formatMessage({ id: 'statsTaTalaba' })}</span>
                                                        </span>
                                                    </div>
                                                    <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            style={{ width: `${percent}%` }}
                                                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Staff Workload & Performance */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/60 shadow-sm space-y-4 flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div>
                                        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <Users className="w-4 h-4 text-indigo-500" />
                                            <span>{intl.formatMessage({ id: 'statsStaffWorkloadTitle' })}</span>
                                        </h2>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            {intl.formatMessage({ id: 'statsStaffWorkloadSub' })}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        {staffWorkloads.map((st) => {
                                            const percent = Math.round((st.projects_count / maxStaffProjects) * 100);
                                            return (
                                                <div key={st.staff_id} className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700/60 space-y-2.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs border border-indigo-500/20">
                                                            {st.staff_name.charAt(0)}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="font-bold text-xs text-gray-900 dark:text-white truncate">
                                                                {st.staff_name}
                                                            </div>
                                                            <div className="text-[10px] text-gray-400 truncate">
                                                                {st.staff_email}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-[11px] font-semibold">
                                                            <span className="text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: 'statsActiveProjectsCard' })}:</span>
                                                            <span className="text-gray-900 dark:text-white">
                                                                {intl.formatMessage({ id: 'statsProjectsCountFormat' }, { count: st.projects_count, active: st.active_projects_count })}
                                                            </span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                                            <div style={{ width: `${percent}%` }} className="h-full bg-indigo-500 rounded-full transition-all duration-300" />
                                                        </div>
                                                    </div>

                                                    <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                                                        <span>👥</span>
                                                        <span>{intl.formatMessage({ id: 'statsManagedStudentsFormat' }, { count: st.managed_students_count })}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Top Active Students Leaderboard Table */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/60 shadow-sm space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                        <span>{intl.formatMessage({ id: 'statsLeaderboardTitle' })}</span>
                                    </h2>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {intl.formatMessage({ id: 'statsLeaderboardSub' })}
                                    </p>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-700 text-[11px] text-gray-400 uppercase font-semibold">
                                            <th className="py-3 px-4">#</th>
                                            <th className="py-3 px-4">{intl.formatMessage({ id: 'statsTableColStudent' })}</th>
                                            <th className="py-3 px-4">{intl.formatMessage({ id: 'statsTableColCode' })}</th>
                                            <th className="py-3 px-4">{intl.formatMessage({ id: 'statsTableColRank' })}</th>
                                            <th className="py-3 px-4">{intl.formatMessage({ id: 'statsTableColSemester' })}</th>
                                            <th className="py-3 px-4 text-center">{intl.formatMessage({ id: 'statsTableColActiveProjects' })}</th>
                                            <th className="py-3 px-4 text-right">{intl.formatMessage({ id: 'statsTableColPoints' })}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                                        {topStudents.map((student, idx) => (
                                            <tr key={student.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
                                                <td className="py-3.5 px-4 font-bold text-gray-500">
                                                    {idx === 0 && <span className="text-base">🥇</span>}
                                                    {idx === 1 && <span className="text-base">🥈</span>}
                                                    {idx === 2 && <span className="text-base">🥉</span>}
                                                    {idx > 2 && <span>#{idx + 1}</span>}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-kanri-primary/10 text-kanri-primary font-bold flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
                                                            {student.avatar_url ? (
                                                                <img src={student.avatar_url} alt={student.full_name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                student.full_name.charAt(0)
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-xs text-gray-900 dark:text-white">
                                                                {student.full_name}
                                                            </div>
                                                            <div className="text-[10px] text-gray-400">
                                                                {student.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                                                    {student.student_code}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${getSkillBadgeColor(student.skill_rank)}`}>
                                                        Rank {student.skill_rank || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-xs font-medium text-gray-600 dark:text-gray-300">
                                                    {formatSemesterLabel(student.semester)}
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                                                        {student.active_projects_count}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-right font-extrabold text-kanri-primary dark:text-blue-400 text-xs">
                                                    {student.points} pt
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
