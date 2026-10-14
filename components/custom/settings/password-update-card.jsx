import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { PasswordInput } from '@/components/ui';
import { authAxios } from '@/utils/axios';

const MIN_PASSWORD_LENGTH = 6;

export default function PasswordUpdateCard() {
    const intl = useIntl();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (newPassword.length < MIN_PASSWORD_LENGTH) {
            toast.error(intl.formatMessage({ id: 'passwordTooShort' }));
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error(intl.formatMessage({ id: 'passwordMismatch' }));
            return;
        }

        setSaving(true);
        try {
            await authAxios.post('auth/change-password', {
                current_password: currentPassword,
                new_password: newPassword,
            });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            toast.success(intl.formatMessage({ id: 'passwordUpdated' }));
        } catch (error) {
            const detail = error.response?.data?.detail;
            const code = typeof detail === 'object' ? detail.code : null;
            if (code === 'WRONG_CURRENT_PASSWORD') {
                toast.error(intl.formatMessage({ id: 'passwordWrongCurrent' }));
                return;
            }
            if (code === 'PASSWORD_UNCHANGED') {
                toast.error(intl.formatMessage({ id: 'passwordUnchanged' }));
                return;
            }
            const message = typeof detail === 'string' ? detail : detail?.message;
            toast.error(message || intl.formatMessage({ id: 'エラーが発生しました' }));
        } finally {
            setSaving(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 p-6 bg-white dark:bg-gray-800 border border-[#E4E9EE] dark:border-gray-700/60 shadow-soft-sm dark:shadow-none rounded-[24px]"
        >
            <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#122B31] dark:text-white flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-kanri-primary dark:text-white" />
                    {intl.formatMessage({ id: 'passwordUpdateTitle' })}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {intl.formatMessage({ id: 'passwordUpdateHint' })}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <PasswordInput
                    label={intl.formatMessage({ id: 'currentPassword' })}
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                />
                <PasswordInput
                    label={intl.formatMessage({ id: 'newPassword' })}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    autoComplete="new-password"
                    required
                />
                <PasswordInput
                    label={intl.formatMessage({ id: 'confirmPassword' })}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    required
                />
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={saving}
                    className="py-2.5 px-4 bg-[#122B31] hover:bg-[#1B2A32] disabled:opacity-60 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors"
                >
                    {intl.formatMessage({ id: 'savePassword' })}
                </button>
            </div>
        </form>
    );
}
