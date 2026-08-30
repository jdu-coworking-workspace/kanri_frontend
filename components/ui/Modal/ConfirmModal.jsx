import React, { useEffect } from "react";
import { AlertTriangle, Trash2, HelpCircle } from "lucide-react";
import { useIntl } from "react-intl";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant = "danger",
  isLoading = false,
}) => {
  const intl = useIntl();
  const finalConfirmText = confirmText || intl.formatMessage({ id: '削除' });
  const finalCancelText = cancelText || intl.formatMessage({ id: 'キャンセル' });
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const variantStyles = {
    danger: {
      iconBg: "bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400 border border-red-100 dark:border-red-900/50",
      icon: <Trash2 className="w-6 h-6" />,
      btn: "bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-600/20 active:scale-[0.98]",
    },
    warning: {
      iconBg: "bg-amber-50 text-amber-500 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50",
      icon: <AlertTriangle className="w-6 h-6" />,
      btn: "bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md shadow-amber-600/20 active:scale-[0.98]",
    },
    info: {
      iconBg: "bg-blue-50 text-blue-500 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50",
      icon: <HelpCircle className="w-6 h-6" />,
      btn: "bg-[#122B31] hover:bg-[#1B2A32] text-white font-bold shadow-md active:scale-[0.98]",
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.danger;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[28px] p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200 transition-all text-center flex flex-col items-center"
      >
        {/* Icon */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${currentVariant.iconBg}`}>
          {currentVariant.icon}
        </div>

        {/* Title */}
        {title && (
          <h3 className="text-lg sm:text-xl font-bold text-[#122B31] dark:text-white mb-2">
            {title}
          </h3>
        )}

        {/* Message */}
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 px-2">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3 w-full">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-[14px] bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-sm transition-colors duration-150"
          >
            {finalCancelText}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`flex-1 py-3 px-4 rounded-[14px] text-sm transition-all duration-150 ${currentVariant.btn}`}
          >
            {isLoading ? "..." : finalConfirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
