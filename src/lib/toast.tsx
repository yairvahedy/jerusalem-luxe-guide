import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { Check, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastCtx {
  toast: (message: string, type?: ToastType) => void;
}

const Ctx = createContext<ToastCtx>({ toast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-4), { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-[min(calc(100vw-2rem),360px)] pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-3 pl-4 pr-3 py-3.5 rounded-xl shadow-2xl text-sm font-medium pointer-events-auto border backdrop-blur-sm transition-all ${
              t.type === "success"
                ? "bg-emerald-950/95 border-emerald-500/25 text-emerald-200"
                : t.type === "error"
                ? "bg-red-950/95 border-red-500/25 text-red-200"
                : "bg-[#1c1c1c]/95 border-white/10 text-white/90"
            }`}
          >
            <span className="mt-0.5 shrink-0">
              {t.type === "success" && <Check className="size-4 text-emerald-400" />}
              {t.type === "error" && <AlertCircle className="size-4 text-red-400" />}
              {t.type === "info" && <Info className="size-4 text-white/60" />}
            </span>
            <span className="flex-1 leading-snug">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 mt-0.5 opacity-40 hover:opacity-80 transition-opacity"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
