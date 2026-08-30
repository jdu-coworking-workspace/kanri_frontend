import React, { useState } from "react";
import { X, Mail, User, Shield, Lock } from "lucide-react";
import { BaseInput, BaseSelect } from "..";
import { useIntl } from "react-intl";

export default function AddStaffModal({ isOpen, onClose, onSubmit }) {
    const intl = useIntl();
    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        password: "",
        role: "staff",
    });
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.email || !formData.fullName || !formData.password) {
            setError(intl.formatMessage({ id: 'allFieldsRequired' }));
            return;
        }

        if (formData.password.length < 6) {
            setError(intl.formatMessage({ id: 'passwordMinLength' }));
            return;
        }

        onSubmit?.({
            email: formData.email,
            password: formData.password,
            full_name: formData.fullName,
            role: formData.role
        });

        // Reset form
        setFormData({
            email: "",
            fullName: "",
            password: "",
            role: "staff",
        });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm p-4">
            <div className="flex min-h-full items-center justify-center py-5">
                <div className="w-full max-w-[550px] bg-white dark:bg-gray-900 rounded-[24px] p-6 sm:p-8 shadow-2xl transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#122B31] dark:text-white">
                            {intl.formatMessage({ id: '新規スタッフ追加' })}
                        </h2>
                        <button
                            onClick={onClose}
                            type="button"
                            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-xl border border-red-100 dark:border-red-900">
                            {error}
                        </div>
                    )}

                    {/* Form Body */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Full Name */}
                        <div className="relative">
                            <BaseInput
                                variant="modal"
                                label={intl.formatMessage({ id: '氏名' })}
                                placeholder={intl.formatMessage({ id: '山田 太郎' })}
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                            <User className="w-4 h-4 text-gray-400 absolute right-3.5 top-[38px]" />
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <BaseInput
                                type="email"
                                variant="modal"
                                label={intl.formatMessage({ id: 'メールアドレス' })}
                                placeholder="example@kanri.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <Mail className="w-4 h-4 text-gray-400 absolute right-3.5 top-[38px]" />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <BaseInput
                                type="password"
                                variant="modal"
                                label={intl.formatMessage({ id: 'パスワード (6文字以上)' })}
                                placeholder="******"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <Lock className="w-4 h-4 text-gray-400 absolute right-3.5 top-[38px]" />
                        </div>

                        {/* Role Selection */}
                        <div className="relative">
                            <BaseSelect
                                variant="modal"
                                label={intl.formatMessage({ id: '権限 (ロール)' })}
                                placeholder={intl.formatMessage({ id: 'ロールを選択' })}
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                options={[
                                    { value: "staff", label: intl.formatMessage({ id: 'スタッフ (Staff)' }) },
                                    { value: "admin", label: intl.formatMessage({ id: '管理者 (Admin)' }) },
                                ]}
                            />
                            <Shield className="w-4 h-4 text-gray-400 absolute right-3.5 top-[38px] pointer-events-none" />
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-4 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="py-3 px-4 bg-[#EFEFEF] hover:bg-gray-200 text-[#122B31] font-bold rounded-xl text-sm transition-colors flex-1"
                            >
                                {intl.formatMessage({ id: 'キャンセル' })}
                            </button>
                            <button
                                type="submit"
                                className="py-3 px-4 bg-[#122B31] hover:bg-[#1B2A32] text-white font-bold rounded-xl text-sm transition-colors shadow-sm flex-1"
                            >
                                {intl.formatMessage({ id: '追加する' })}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
