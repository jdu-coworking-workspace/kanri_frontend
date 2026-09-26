import React, { useRef, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Camera } from 'lucide-react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { MenuTabs } from '@/components/custom';
import PasswordUpdateCard from '@/components/custom/settings/password-update-card';
import Seo from '@/components/Seo/Seo';
import fetcher from '@/utils/fetcher';
import { authAxios } from '@/utils/axios';

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

export default function StudentSettingsPage() {
    const intl = useIntl();
    const fileRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const { data, error, isLoading } = useSWR('students/me', (url) => fetcher(url, {}, {}, true));
    const profile = data?.data;
    const missingProfile = error?.status === 404;

    const handleAvatarChange = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            toast.error(intl.formatMessage({ id: 'avatarInvalidType' }));
            return;
        }
        if (file.size > MAX_AVATAR_BYTES) {
            toast.error(intl.formatMessage({ id: 'avatarTooLarge' }));
            return;
        }

        const uploadData = new FormData();
        uploadData.append('file', file);
        setUploading(true);
        try {
            await authAxios.post('uploads/me/avatar', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            mutate('students/me');
            mutate((key) => typeof key === 'string' && (key.startsWith('projects') || key.startsWith('students')));
            toast.success(intl.formatMessage({ id: 'avatarUpdated' }));
        } catch (uploadError) {
            const detail = uploadError.response?.data?.detail;
            const message = typeof detail === 'string' ? detail : detail?.message;
            toast.error(message || intl.formatMessage({ id: 'エラーが発生しました' }));
        } finally {
            setUploading(false);
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
            <div className="container mx-auto px-4 py-6 max-w-3xl flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-6 bg-white dark:bg-gray-800 border border-[#E4E9EE] dark:border-gray-700/60 shadow-soft-sm dark:shadow-none rounded-[24px]">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
                        {profile?.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt={profile.full_name || ''}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Camera className="w-8 h-8" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="text-lg font-bold text-[#122B31] dark:text-white">
                            {intl.formatMessage({ id: 'avatarUpdateTitle' })}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {missingProfile
                                ? intl.formatMessage({ id: 'avatarNoProfile' })
                                : intl.formatMessage({ id: 'avatarUpdateHint' })}
                        </p>
                        {!missingProfile && !isLoading && (
                            <>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                                <button
                                    type="button"
                                    disabled={uploading}
                                    onClick={() => fileRef.current?.click()}
                                    className="self-start py-2.5 px-4 bg-[#122B31] hover:bg-[#1B2A32] disabled:opacity-60 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors"
                                >
                                    {intl.formatMessage({ id: 'chooseAvatar' })}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <PasswordUpdateCard />
            </div>
        </>
    );
}

export async function getServerSideProps() {
    return {
        props: {
            info: {
                title: '設定',
                description: '設定',
                keywords: '設定',
            },
        },
    };
}
