"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, LogIn, ShieldCheck } from "lucide-react";

export default function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");

    const response = await fetch("/api/dashadmin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setPending(false);
    if (!response.ok) {
      setMessage("Credenciais inválidas.");
      return;
    }

    router.replace("/dashadmin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md rounded-lg border border-emerald-950/15 bg-white p-5 shadow-[0_24px_80px_rgba(6,45,27,0.12)]">
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-700 text-white">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-emerald-700">StartPromos</p>
          <h1 className="font-display text-2xl font-black text-zinc-950">Dash Admin</h1>
        </div>
      </div>
      <label className="mb-4 block">
        <span className="mb-1 block text-sm font-semibold text-zinc-700">Usuário</span>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          className="min-h-12 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-zinc-950 outline-none focus:border-emerald-700"
          required
        />
      </label>
      <label className="mb-5 block">
        <span className="mb-1 block text-sm font-semibold text-zinc-700">Senha</span>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            autoComplete="current-password"
            className="min-h-12 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 pl-10 text-zinc-950 outline-none focus:border-emerald-700"
            required
          />
        </div>
      </label>
      {message && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{message}</p>}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-5 font-display text-sm font-extrabold text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-70"
      >
        <LogIn className="h-4 w-4" />
        {pending ? "Validando" : "Entrar com segurança"}
      </button>
    </form>
  );
}
