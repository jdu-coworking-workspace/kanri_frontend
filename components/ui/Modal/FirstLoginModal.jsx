import React, { useEffect } from "react";
import { Camera } from "lucide-react";
import { useIntl } from "react-intl";

/**
 * Dialog shown to students on their very first login,
 * prompting them to set a profile photo.
 *
 * Uses the same visual pattern as ConfirmModal (centered card,
 * backdrop-blur, icon badge, two-button footer).
 */
const FirstLoginModal = ({ isOpen, onClose, onGoToSettings }) => {
  const intl = useIntl();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[28px] p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200 transition-all text-center flex flex-col items-center">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-blue-50 text-blue-500 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
          <Camera className="w-6 h-6" />
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-[#122B31] dark:text-white mb-2">
          {intl.formatMessage({ id: "firstLoginTitle" })}
        </h3>

        {/* Message */}
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 px-2">
          {intl.formatMessage({ id: "firstLoginMessage" })}
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-[14px] bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-sm transition-colors duration-150"
          >
            {intl.formatMessage({ id: "firstLoginSkip" })}
          </button>
          <button
            type="button"
            onClick={onGoToSettings}
            className="flex-1 py-3 px-4 rounded-[14px] text-sm transition-all duration-150 bg-[#122B31] hover:bg-[#1B2A32] text-white font-bold shadow-md active:scale-[0.98]"
          >
            {intl.formatMessage({ id: "firstLoginUpload" })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirstLoginModal;
