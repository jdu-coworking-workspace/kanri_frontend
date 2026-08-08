import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  className = "",
}) => {
  const modalRef = useRef(null);

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

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[95vw] h-[95vh]",
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`bg-kanri-surface w-full rounded-2xl shadow-xl flex flex-col max-h-[90vh] ${
          sizes[size] || sizes.md
        } ${className}`}
        style={{ animation: "fade-in 0.2s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-kanri-border">
          <h2 className="text-xl font-bold text-brand-primary">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-brand-secondary hover:bg-kanri-bg hover:text-brand-primary rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

// Modal Footer Component
const ModalFooter = ({ children, className = "" }) => {
  return (
    <div
      className={`flex items-center justify-end gap-3 pt-6 border-t border-kanri-border mt-auto ${className}`}
    >
      {children}
    </div>
  );
};

Modal.Footer = ModalFooter;

export default Modal;
