import React, { useState, useRef, useEffect } from 'react';
import useSWR from 'swr';
import { useSelector } from 'react-redux';
import { MenuTabs } from '@/components/custom';
import Seo from '@/components/Seo/Seo';
import AddStaffModal from '@/components/ui/Modal/add-staff-modal';
import { ConfirmModal } from '@/components/ui';
import fetcher from '@/utils/fetcher';
import { authAxios } from '@/utils/axios';
import { mutate } from 'swr';
import { User, Shield, ShieldAlert, Plus, Trash2, Mail, Calendar, ChevronDown, Check } from 'lucide-react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

function RoleSelectDropdown({ value, onChange, disabled, intl }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const roleConfigs = {
        staff: {
            label: intl.formatMessage({ id: 'スタッフ (Staff)' }),
            badgeClass: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60',
            dotClass: 'bg-emerald-500',
        },
        admin: {
            label: intl.formatMessage({ id: '管理者 (Admin)' }),
            badgeClass: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/60',
            dotClass: 'bg-amber-500',
        },
    };

    const currentConfig = roleConfigs[value] || roleConfigs.staff;

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all duration-200 shadow-sm ${currentConfig.badgeClass} ${
                    disabled ? 'opacity-80 cursor-default hover:bg-transparent' : 'cursor-pointer active:scale-[0.98]'
                }`}
            >
                <span className={`w-2 h-2 rounded-full ${currentConfig.dotClass}`} />
                <span>{currentConfig.label}</span>
                {!disabled && (
                    <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                )}
            </button>

            {isOpen && !disabled && (
                <div className="absolute left-0 mt-1.5 w-44 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/80 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
                    {Object.entries(roleConfigs).map(([roleKey, cfg]) => {
                        const isSelected = roleKey === value;
                        return (
                            <button
                                key={roleKey}
                                type="button"
                                onClick={() => {
                                    onChange(roleKey);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                                    isSelected
                                        ? 'bg-gray-100 dark:bg-gray-700/70 text-gray-900 dark:text-white font-bold'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/40'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${cfg.dotClass}`} />
                                    {cfg.label}
                                </span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-kanri-primary dark:text-white stroke-[2.5]" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function SettingsPage({ info }) {
    const intl = useIntl();
    const currentUser = useSelector((state) => state.auth.user);
    const isAdmin = currentUser?.role === 'admin';

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deletingStaff, setDeletingStaff] = useState(null);

    // Fetch users list (only if admin to avoid 403 errors on mounting for staff members)
    const { data, error, isLoading } = useSWR(
        isAdmin ? 'users' : null,
        (u) => fetcher(u, {}, {}, true)
    );

    const users = data?.data || [];

    const handleCreateStaff = async (staffData) => {
        try {
            await authAxios.post('users', staffData);
            setIsModalOpen(false);
            // Refresh users list
            mutate('users');
        } catch (error) {
            console.error("Xodim yaratishda xatolik:", error);
            if (error.response?.status === 403) {
                toast.error(intl.formatMessage({ id: 'actionNotAllowedStaff' }));
                return;
            }
            toast.error(error.response?.data?.detail?.message || error.response?.data?.detail || "Xodim qo'shishda xatolik yuz berdi.");
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await authAxios.put(`users/${userId}/role`, { role: newRole });
            mutate('users');
        } catch (error) {
            console.error("Rolni o'zgartirishda xatolik:", error);
            if (error.response?.status === 403) {
                toast.error(intl.formatMessage({ id: 'actionNotAllowedStaff' }));
                return;
            }
            toast.error(error.response?.data?.detail?.message || error.response?.data?.detail || "Rolni o'zgartirishda xatolik yuz berdi.");
        }
    };

    const handleDeleteStaffRequest = (userId, fullName) => {
        if (userId === currentUser?.id) {
            toast.warning(intl.formatMessage({ id: 'cannotDeleteSelf' }));
            return;
        }
        setDeletingStaff({ id: userId, fullName });
    };

    const handleConfirmDeleteStaff = async () => {
        if (!deletingStaff) return;
        try {
            await authAxios.delete(`users/${deletingStaff.id}`);
            mutate('users');
        } catch (error) {
            console.error("Xodimni o'chirishda xatolik:", error);
            if (error.response?.status === 403) {
                toast.error(intl.formatMessage({ id: 'actionNotAllowedStaff' }));
                return;
            }
            const msg = error.response?.data?.detail?.message || error.response?.data?.detail || "Xodimni o'chirishda xatolik yuz berdi.";
            toast.error(msg);
        } finally {
            setDeletingStaff(null);
        }
    };

    return (
        <>
            <Seo 
                title={intl.formatMessage({ id: '設定' })} 
                description={intl.formatMessage({ id: '設定' })} 
                keywords={intl.formatMessage({ id: '設定' })} 
            />

            <MenuTabs />

            <div className="container mx-auto px-4 py-6">
                {!isAdmin ? (
                    /* Non-admin access denied state */
                    <div className="max-w-xl mx-auto mt-12 bg-white dark:bg-gray-800 border border-[#E4E9EE] dark:border-gray-700 shadow-soft-sm dark:shadow-none rounded-[24px] p-8 text-center transition-colors duration-300">
                        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-2xl flex items-center justify-center mx-auto mb-5 text-red-600 dark:text-red-400">
                            <ShieldAlert className="w-10 h-10" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-[#122B31] dark:text-white mb-3">
                            {intl.formatMessage({ id: 'アクセス権限がありません' })}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                            {intl.formatMessage({ id: 'アクセス権限警告メッセージ' })}
                        </p>
                    </div>
                ) : (
                    /* Admin staff management console */
                    <div className="flex flex-col gap-6 w-full">
                        {/* Header card */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-gray-800 border border-[#E4E9EE] dark:border-gray-700/60 shadow-soft-sm dark:shadow-none rounded-[24px] transition-colors">
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-[#122B31] dark:text-white flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-kanri-primary dark:text-white" />
                                    {intl.formatMessage({ id: 'スタッフ管理' })}
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {intl.formatMessage({ id: 'settingsSubtitle' })}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#122B31] hover:bg-[#1B2A32] text-white font-bold rounded-xl text-xs sm:text-sm transition-colors shadow-sm self-start sm:self-center"
                            >
                                <Plus className="w-4 h-4" />
                                {intl.formatMessage({ id: 'スタッフを追加' })}
                            </button>
                        </div>

                        {/* List / Table area */}
                        <div className="bg-white dark:bg-gray-800 border border-[#E4E9EE] dark:border-gray-700/60 shadow-soft-sm dark:shadow-none rounded-[24px] overflow-hidden transition-colors">
                            {isLoading ? (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: '読み込み中...' })}</div>
                            ) : error ? (
                                <div className="p-8 text-center text-red-500">{intl.formatMessage({ id: 'エラーが発生しました' })}</div>
                            ) : users.length > 0 ? (
                                <div className="overflow-x-auto w-full">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-[#E4E9EE] dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 text-[#8897AD] dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
                                                <th className="px-6 py-4">{intl.formatMessage({ id: 'スタッフ氏名' })}</th>
                                                <th className="px-6 py-4">{intl.formatMessage({ id: 'メールアドレス' })}</th>
                                                <th className="px-6 py-4">{intl.formatMessage({ id: '権限 (ロール)' })}</th>
                                                <th className="px-6 py-4">{intl.formatMessage({ id: '作成日' })}</th>
                                                <th className="px-6 py-4 text-center">{intl.formatMessage({ id: '操作' })}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#E4E9EE] dark:divide-gray-700">
                                            {users.map((user) => {
                                                const formattedDate = new Date(user.created_at).toLocaleDateString("ja-JP");
                                                const isSelf = user.id === currentUser?.id;
                                                return (
                                                    <tr key={user.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-700/10 text-sm transition-colors text-gray-700 dark:text-gray-200">
                                                        <td className="px-6 py-4 font-semibold flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                                                                 <User className="w-4 h-4" />
                                                            </div>
                                                            <span>
                                                                {user.full_name}
                                                                {isSelf && <span className="ml-1.5 text-[10px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full font-bold">{intl.formatMessage({ id: '自分' })}</span>}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">
                                                            <span className="flex items-center gap-1.5">
                                                                <Mail className="w-3.5 h-3.5" />
                                                                {user.email}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <RoleSelectDropdown
                                                                value={user.role}
                                                                disabled={isSelf}
                                                                onChange={(newRole) => handleRoleChange(user.id, newRole)}
                                                                intl={intl}
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                                            <span className="flex items-center gap-1.5">
                                                                <Calendar className="w-3.5 h-3.5" />
                                                                {formattedDate}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <button
                                                                onClick={() => handleDeleteStaffRequest(user.id, user.full_name)}
                                                                disabled={isSelf}
                                                                className={`p-2 rounded-lg transition-colors ${
                                                                    isSelf
                                                                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                                                        : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30'
                                                                }`}
                                                                title={intl.formatMessage({ id: '削除' })}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    {intl.formatMessage({ id: 'staffListEmpty' })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <AddStaffModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateStaff}
            />

            <ConfirmModal
                isOpen={!!deletingStaff}
                onClose={() => setDeletingStaff(null)}
                onConfirm={handleConfirmDeleteStaff}
                title={intl.formatMessage({ id: 'confirmDeleteStaffTitle' })}
                message={deletingStaff ? intl.formatMessage({ id: 'confirmDeleteStaff' }, { fullName: deletingStaff.fullName }) : ""}
                confirmText={intl.formatMessage({ id: '削除' })}
                cancelText={intl.formatMessage({ id: 'キャンセル' })}
                variant="danger"
            />
        </>
    );
}

export async function getServerSideProps() {
    try {
        const pageData = {
            title: "設定",
            description: "設定",
            keywords: "設定"
        };
        return {
            props: {
                info: pageData,
            },
        };
    } catch (error) {
        return { notFound: true };
    }
}
