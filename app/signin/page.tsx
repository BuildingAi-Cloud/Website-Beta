"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Button, Card, Field, Wordmark } from "@/components/ui";

export default function SignInPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      const code = (error as { code?: string }).code;
      if (code === "email_not_confirmed") {
        setError("Check your inbox to confirm this email before signing in.");
      } else {
        setError(error.message);
      }
      return;
    }
    router.push("/?go=1");
    router.refresh();
  }

  return (
    <main className="min-h-dvh flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-6">
        <Link href="/" className="block text-center">
          <Wordmark className="text-2xl" />
        </Link>

        <Card className="p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Welcome back.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="block text-sm font-medium mb-1.5">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border bg-input/30 outline-none focus:ring-2 focus:ring-ring focus:border-ring transition"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium mb-1.5">Password</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border bg-input/30 outline-none focus:ring-2 focus:ring-ring focus:border-ring transition"
              />
            </label>
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2">
                {error}
              </p>
            )}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-4 text-sm text-muted-foreground text-center">
            New here? <Link href="/signup" className="underline underline-offset-4 hover:text-foreground">Create an account</Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
