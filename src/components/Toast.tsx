"use client";

import { useEffect, useState } from "react";
import type { ToastMessage } from "@/lib/types";

interface ToastProps {
  messages: ToastMessage[];
  onDismiss: (id: number) => void;
}

function ToastItem({
  message,
  onDismiss,
}: {
  message: ToastMessage;
  onDismiss: (id: number) => void;
}) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), 1200);
    const removeTimer = setTimeout(() => onDismiss(message.id), 1500);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [message.id, onDismiss]);

  return (
    <div
      className={`
        bg-sumi-900 text-washi-100
        px-4 py-2.5 rounded-lg
        font-sans font-medium text-sm
        shadow-lg
        ${exiting ? "toast-exit" : "toast-enter"}
      `}
    >
      {message.text}
    </div>
  );
}

export default function Toast({ messages, onDismiss }: ToastProps) {
  if (messages.length === 0) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
      {messages.map((msg) => (
        <ToastItem key={msg.id} message={msg} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
