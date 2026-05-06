// Shared UI primitives, kept tiny so /team and /platform pages don't repeat
// the same Tailwind incantations on every form.
import Link from "next/link";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card text-card-foreground border border-border rounded-md ${className}`}>
      {children}
    </div>
  );
}

type ButtonVariant = "primary" | "outline" | "ghost";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: { variant?: ButtonVariant } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`${buttonClass(variant)} ${className}`} {...props} />;
}

export function LinkButton({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}) {
  return <Link href={href} className={`${buttonClass(variant)} ${className}`}>{children}</Link>;
}

function buttonClass(variant: ButtonVariant) {
  const base = "inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";
  if (variant === "primary") return `${base} bg-primary text-primary-foreground hover:bg-primary/90`;
  if (variant === "outline") return `${base} border border-border bg-transparent hover:bg-muted`;
  return `${base} bg-transparent hover:bg-muted`;
}

export function Field({
  name,
  label,
  type = "text",
  required,
  placeholder,
  defaultValue,
  autoComplete,
  minLength,
  maxLength,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        minLength={minLength}
        maxLength={maxLength}
        className="w-full px-3 py-2 rounded-md border border-border bg-input/30 outline-none focus:ring-2 focus:ring-ring focus:border-ring transition"
      />
    </label>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return <span className={`wordmark text-lg ${className}`}>BuildingSync</span>;
}

export function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm border border-border bg-muted/30 ${className}`}>
      {children}
    </span>
  );
}
