import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Clock } from 'lucide-react';
import { useIntl } from 'react-intl';
import { clockDraftInvalid, clockMeridiem, parseClockInput } from '@/utils/reports';

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const MINUTES = Array.from({ length: 60 }, (_, minute) => minute);

function maskClock(raw) {
    const cleaned = String(raw ?? '').replace(/[^\dapm:.\s]/gi, '');
    if (/[apm]/i.test(cleaned)) return cleaned.slice(0, 8);
    const withColon = cleaned.replace(/\./g, ':');
    if (withColon.includes(':')) {
        const [hour = '', minute = ''] = withColon.split(':');
        return `${hour.replace(/\D/g, '').slice(0, 2)}:${minute.replace(/\D/g, '').slice(0, 2)}`;
    }
    const digits = withColon.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

function pad(value) {
    return String(value).padStart(2, '0');
}

export default function TimeField({
    value,
    onChange,
    disabled = false,
    reportDate,
    reportField,
}) {
    const intl = useIntl();
    const inputRef = useRef(null);
    const panelRef = useRef(null);
    const listId = useId();
    const [text, setText] = useState(value || '');
    const [invalid, setInvalid] = useState(false);
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState(null);

    useEffect(() => {
        if (disabled) {
            setText(value || '');
            setInvalid(false);
            setOpen(false);
            return;
        }
        if (inputRef.current && document.activeElement === inputRef.current) return;
        if (invalid) return;
        setText(value || '');
    }, [value, disabled, invalid]);

    useEffect(() => {
        if (!open) return undefined;
        const frame = requestAnimationFrame(() => {
            panelRef.current?.querySelectorAll('[data-selected="true"]').forEach((node) => {
                const parent = node.parentElement;
                if (!parent) return;
                parent.scrollTop = node.offsetTop - parent.clientHeight / 2 + node.clientHeight / 2;
            });
        });
        return () => cancelAnimationFrame(frame);
    }, [open]);

    useEffect(() => {
        if (!open) return undefined;
        const close = (event) => {
            if (event.key === 'Escape') setOpen(false);
        };
        const handlePointer = (event) => {
            const target = event.target;
            if (inputRef.current?.parentElement?.contains(target)) return;
            if (panelRef.current?.contains(target)) return;
            setOpen(false);
        };
        document.addEventListener('keydown', close);
        document.addEventListener('mousedown', handlePointer);
        return () => {
            document.removeEventListener('keydown', close);
            document.removeEventListener('mousedown', handlePointer);
        };
    }, [open]);

    const meridiem = invalid ? '' : clockMeridiem(text);
    const parsed = parseClockInput(text);
    const selectedHour = parsed.ok && parsed.value ? Number(parsed.value.slice(0, 2)) : null;
    const selectedMinute = parsed.ok && parsed.value && text.includes(':') ? Number(parsed.value.slice(3, 5)) : null;

    const commit = (nextText, { rewrite = false } = {}) => {
        if (!nextText.trim()) {
            setText('');
            setInvalid(false);
            onChange('');
            return;
        }
        const next = parseClockInput(nextText);
        if (rewrite) {
            if (!next.ok) {
                setText(nextText);
                setInvalid(true);
                onChange('');
                return;
            }
            setText(next.value);
            setInvalid(false);
            onChange(next.value);
            return;
        }
        if (clockDraftInvalid(nextText)) {
            setText(nextText);
            setInvalid(true);
            onChange('');
            return;
        }
        const minute = nextText.includes(':') ? nextText.split(':')[1] : '';
        const typedMeridiem = /[ap]m$/i.test(nextText.replace(/\s+/g, ''));
        setText(nextText);
        setInvalid(false);
        if (next.ok && (typedMeridiem || minute.length === 2)) onChange(next.value);
    };

    const openPanel = () => {
        if (disabled) return;
        const rect = inputRef.current?.parentElement?.getBoundingClientRect();
        if (!rect) return;
        const panelHeight = 220;
        const top = rect.bottom + panelHeight > window.innerHeight && rect.top > panelHeight
            ? rect.top - panelHeight - 6
            : rect.bottom + 6;
        setPosition({ top, left: Math.max(8, Math.min(rect.left, window.innerWidth - 196)) });
        setOpen(true);
    };

    const choose = (hour, minute) => {
        const next = `${pad(hour)}:${pad(minute)}`;
        setText(next);
        setInvalid(false);
        onChange(next);
    };

    return (
        <div className="relative">
            <div className={`inline-flex w-fit items-center rounded-lg border bg-white dark:bg-gray-900 ${
                invalid
                    ? 'border-red-500'
                    : 'border-[#E4E9EE] dark:border-gray-700'
            } ${disabled ? 'opacity-60' : ''}`}>
                <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="00:00"
                    value={text}
                    disabled={disabled}
                    data-report-date={reportDate}
                    data-report-field={reportField}
                    aria-invalid={invalid}
                    aria-describedby={invalid ? `${listId}-error` : undefined}
                    onChange={(event) => commit(maskClock(event.target.value))}
                    onBlur={() => commit(text, { rewrite: true })}
                    className="w-14 bg-transparent px-2 py-1.5 text-sm text-black dark:text-white outline-none placeholder:text-[#8897AD] disabled:cursor-not-allowed"
                />
                <span className="w-6 text-[10px] font-bold tracking-wide text-[#122B31] dark:text-gray-200">
                    {meridiem}
                </span>
                <button
                    type="button"
                    disabled={disabled}
                    aria-label={intl.formatMessage({ id: 'reportPickTime' })}
                    aria-expanded={open}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => (open ? setOpen(false) : openPanel())}
                    className="mr-1 flex h-7 w-7 items-center justify-center rounded-md text-[#8897AD] hover:bg-gray-100 hover:text-[#122B31] disabled:cursor-not-allowed dark:hover:bg-gray-800 dark:hover:text-white"
                >
                    <Clock className="h-3.5 w-3.5" />
                </button>
            </div>
            {invalid && (
                <span id={`${listId}-error`} className="mt-1 block max-w-[9.5rem] text-[11px] leading-4 text-red-600">
                    {intl.formatMessage({ id: 'reportTimeInvalid' })}
                </span>
            )}
            {open && position && createPortal(
                <div
                    ref={panelRef}
                    style={{ top: position.top, left: position.left }}
                    className="fixed z-50 flex w-[11.5rem] overflow-hidden rounded-2xl border border-[#E4E9EE] bg-white shadow-soft-sm dark:border-gray-700 dark:bg-gray-800"
                >
                    <div className="max-h-52 flex-1 overflow-y-auto py-1">
                        {HOURS.map((hour) => (
                            <button
                                key={hour}
                                type="button"
                                data-selected={hour === selectedHour ? 'true' : 'false'}
                                onClick={() => choose(hour, selectedMinute ?? 0)}
                                className={`block w-full px-3 py-1.5 text-left text-sm ${
                                    hour === selectedHour
                                        ? 'bg-[#122B31] font-semibold text-white dark:bg-white dark:text-[#122B31]'
                                        : 'text-[#122B31] hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                                }`}
                            >
                                {pad(hour)}
                            </button>
                        ))}
                    </div>
                    <div className="max-h-52 flex-1 overflow-y-auto border-l border-[#E4E9EE] py-1 dark:border-gray-700">
                        {MINUTES.map((minute) => (
                            <button
                                key={minute}
                                type="button"
                                data-selected={minute === selectedMinute ? 'true' : 'false'}
                                onClick={() => {
                                    choose(selectedHour ?? 0, minute);
                                    setOpen(false);
                                }}
                                className={`block w-full px-3 py-1.5 text-left text-sm ${
                                    minute === selectedMinute
                                        ? 'bg-[#122B31] font-semibold text-white dark:bg-white dark:text-[#122B31]'
                                        : 'text-[#122B31] hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                                }`}
                            >
                                {pad(minute)}
                            </button>
                        ))}
                    </div>
                </div>,
                document.body,
            )}
        </div>
    );
}
