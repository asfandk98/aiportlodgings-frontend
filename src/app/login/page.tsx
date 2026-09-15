"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { loginUser, registerUser } from "@/lib/auth";

type Tab = "login" | "register";

export default function LoginRegisterPage({ defaultTab = "login" }: { defaultTab?: Tab }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "", terminal: "" });

  const afterAuthSuccess = (token: string, user: { name: string; role?: string }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", user.role ?? "");
    window.dispatchEvent(new Event("auth-change"));

    if (user.role === "admin") {
      router.push("/admin/dashboard");
      return;
    }
    const redirectTo = sessionStorage.getItem("redirect_after_login");
    sessionStorage.removeItem("redirect_after_login");
    router.push(redirectTo ?? "/");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(loginForm);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      afterAuthSuccess(res.data.token, res.data.user);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Invalid credentials";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerForm.name.trim() || !registerForm.email.trim()) {
      toast.error("Please fill in your name and email");
      return;
    }
    if (registerForm.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      // Note: terminal preference is UI-only for now — there's no column
      // on `users` to store it yet, so it isn't sent to the backend.
      const res = await registerUser({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
      });
      toast.success("Account created successfully!");
      afterAuthSuccess(res.data.token, res.data.user);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const socialComingSoon = (provider: string) => toast(`${provider} sign-in is coming soon`);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-container-margin relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 20%, rgb(182, 199, 236) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgb(254, 174, 44) 0%, transparent 40%)",
        }}
      />

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-xl relative z-10 bg-white/95 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden" style={{ boxShadow: "0px 4px 12px rgba(26,43,66,0.08)" }}>
        {/* Branding side */}
        <div className="hidden md:flex flex-col justify-center items-center p-xl bg-surface-container relative">
          <div
            className="absolute inset-0 z-0 opacity-50 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDAZPe2JFYrq2PZjHAvuSFi4HX6UWVEoDPKVFLqbQh-Si8ZZEQ9ClBxxc32hfHAHtw4T4lwWpJ2WL7CyR_wE6X1TPFWvn3aWa3Qv1PIINNwtVfl8yiAvENHBgg9t9IK-Y-ZnHmhpdaIev-fNulsZBE26j5G84qm9pEnFp2rKdZf3Y6c9lIsbwTlTaIs_Qk2VymvW0NpI4HPzabeCWIwcRXwaw8AhUz9DA1J2zcSFsU-7f-e1MS4oP_G')",
            }}
          />
          <div className="relative z-10 text-center">
            <div className="w-32 h-32 mx-auto mb-lg rounded-full bg-white flex items-center justify-center text-4xl" style={{ boxShadow: "0px 4px 12px rgba(26,43,66,0.08)" }}>
              ✈️
            </div>
            <h2 className="font-headline-lg text-headline-lg text-primary-container mb-sm">The Smart Traveler&apos;s Choice</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xs mx-auto">
              Frictionless booking and rest for your transit through DXB.
            </p>
          </div>
        </div>

        {/* Form side */}
        <div className="p-lg md:p-xl flex flex-col justify-center bg-surface-container-lowest">
          <div className="md:hidden flex justify-center mb-lg">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-3xl" style={{ boxShadow: "0px 4px 12px rgba(26,43,66,0.08)" }}>
              ✈️
            </div>
          </div>

          <div className="flex gap-md mb-xl border-b border-outline-variant pb-xs">
            <button
              onClick={() => setTab("login")}
              className={`font-headline-md text-headline-md pb-sm border-b-2 transition-colors ${
                tab === "login" ? "text-primary-container border-primary-container" : "text-on-surface-variant border-transparent hover:text-primary-container"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setTab("register")}
              className={`font-headline-md text-headline-md pb-sm border-b-2 transition-colors ${
                tab === "register" ? "text-primary-container border-primary-container" : "text-on-surface-variant border-transparent hover:text-primary-container"
              }`}
            >
              Register
            </button>
          </div>

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-md">
              <div className="space-y-xs">
                <label className="font-label-bold text-label-bold text-on-surface block">Email Address</label>
                <input
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full h-[48px] px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 font-body-md text-body-md transition-all"
                  placeholder="name@example.com"
                  type="email"
                  required
                />
              </div>
              <div className="space-y-xs">
                <label className="font-label-bold text-label-bold text-on-surface block">Password</label>
                <div className="relative">
                  <input
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                    className="w-full h-[48px] px-md pr-[48px] rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 font-body-md text-body-md transition-all"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-0 top-0 h-[48px] w-[48px] flex items-center justify-center text-on-surface-variant hover:text-primary-container"
                  >
                    <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
                <div className="flex justify-end pt-xs">
                  <a className="font-label-sm text-label-sm text-secondary hover:underline" href="/forgot-password">
                    Forgot Password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[48px] mt-md bg-secondary-container text-on-secondary-container font-label-bold text-label-bold rounded-lg flex items-center justify-center gap-sm active:scale-95 transition-transform duration-150 disabled:opacity-50"
                style={{ boxShadow: "0px 4px 12px rgba(26,43,66,0.08)" }}
              >
                {loading ? "Signing In…" : "Sign In"}
                {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
              </button>

              <div className="relative flex items-center py-lg">
                <div className="flex-grow border-t border-outline-variant" />
                <span className="flex-shrink-0 mx-md text-on-surface-variant font-label-sm text-label-sm">Or continue with</span>
                <div className="flex-grow border-t border-outline-variant" />
              </div>

              <div className="grid grid-cols-2 gap-md">
                <button
                  type="button"
                  onClick={() => socialComingSoon("Google")}
                  className="h-[44px] border border-outline-variant rounded-lg flex items-center justify-center gap-sm bg-surface hover:bg-surface-container transition-colors font-label-bold text-label-bold"
                >
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => socialComingSoon("Apple")}
                  className="h-[44px] border border-outline-variant rounded-lg flex items-center justify-center gap-sm bg-surface hover:bg-surface-container transition-colors font-label-bold text-label-bold"
                >
                  Apple
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-md">
              <div className="space-y-xs">
                <label className="font-label-bold text-label-bold text-on-surface block">Full Name</label>
                <input
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full h-[48px] px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 font-body-md text-body-md transition-all"
                  placeholder="John Doe"
                  type="text"
                  required
                />
              </div>
              <div className="space-y-xs">
                <label className="font-label-bold text-label-bold text-on-surface block">Email Address</label>
                <input
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full h-[48px] px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 font-body-md text-body-md transition-all"
                  placeholder="name@example.com"
                  type="email"
                  required
                />
              </div>
              <div className="space-y-xs">
                <label className="font-label-bold text-label-bold text-on-surface block">Password</label>
                <input
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full h-[48px] px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 font-body-md text-body-md transition-all"
                  placeholder="Create a strong password"
                  type="password"
                  required
                />
              </div>

              <div className="space-y-xs pt-sm border-t border-outline-variant mt-md">
                <label className="font-label-bold text-label-bold text-on-surface block">
                  DXB Terminal Preference <span className="font-label-sm text-on-surface-variant font-normal">(Optional, not saved yet)</span>
                </label>
                <div className="relative">
                  <select
                    value={registerForm.terminal}
                    onChange={(e) => setRegisterForm((f) => ({ ...f, terminal: e.target.value }))}
                    className="w-full h-[48px] px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 font-body-md text-body-md transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Terminal</option>
                    <option value="t1">Terminal 1</option>
                    <option value="t2">Terminal 2</option>
                    <option value="t3">Terminal 3 (Emirates)</option>
                  </select>
                  <div className="absolute inset-y-0 right-md flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[48px] mt-lg bg-secondary-container text-on-secondary-container font-label-bold text-label-bold rounded-lg flex items-center justify-center gap-sm active:scale-95 transition-transform duration-150 disabled:opacity-50"
                style={{ boxShadow: "0px 4px 12px rgba(26,43,66,0.08)" }}
              >
                {loading ? "Creating Account…" : "Create Account"}
              </button>
              <p className="text-center font-label-sm text-label-sm text-on-surface-variant mt-sm">
                By registering, you agree to our{" "}
                <a className="text-secondary hover:underline" href="/terms-of-service">
                  Terms of Service
                </a>
                .
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}