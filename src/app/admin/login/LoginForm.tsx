"use client";

import { useActionState } from "react";
import { loginAction, type FormState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    loginAction,
    undefined
  );

  return (
    <form action={action} className="admin-card admin-login">
      <h1>CoolMaster Admin</h1>
      <p className="muted">Sign in to manage heat pump specials.</p>

      <label className="admin-field">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          autoFocus
        />
      </label>

      <label className="admin-field">
        Password
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </label>

      {state?.error ? <p className="admin-error">{state.error}</p> : null}

      <button className="admin-btn" type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
