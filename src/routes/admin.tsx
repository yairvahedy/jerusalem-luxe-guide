import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, List, Users, LogOut, Menu, X, Home, FileText, MapPin } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import logo from "@/assets/jf-logo.jpeg";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { user, loading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouterState();
  const path = router.location.pathname;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  const nav = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/listings", label: "Listings", icon: List },
    { to: "/admin/agents", label: "Agents", icon: Users },
    { to: "/admin/content", label: "Content", icon: FileText },
    { to: "/admin/neighborhoods", label: "Neighborhoods", icon: MapPin },
  ];

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return path === to;
    return path.startsWith(to);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#141414] border-r border-white/[0.06] flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <img src={logo} alt="JF Realty" className="h-8 w-8 rounded-sm object-cover opacity-90" />
            <div>
              <div className="text-sm font-medium">JF Realty</div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest">Admin</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/40 hover:text-white">
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${isActive(n.to, n.exact) ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"}`}
            >
              <n.icon className="size-4 shrink-0" />
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-white/[0.06] space-y-0.5">
          <a href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/40 hover:text-white hover:bg-white/5 transition-colors">
            <Home className="size-4" /> View site
          </a>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/40 hover:text-destructive hover:bg-white/5 transition-colors">
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 lg:overflow-auto">
        <header className="lg:hidden flex items-center gap-4 h-16 px-5 border-b border-white/[0.06] bg-[#141414] shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="text-white/60 hover:text-white">
            <Menu className="size-5" />
          </button>
          <span className="text-sm font-medium">
            {nav.find((n) => isActive(n.to, n.exact))?.label ?? "Admin"}
          </span>
        </header>

        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function AdminLogin() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) setError(error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <img src={logo} alt="JF Realty" className="h-12 w-12 rounded-sm object-cover mx-auto mb-5 opacity-90" />
          <h1 className="font-display text-2xl text-white">Admin Portal</h1>
          <p className="text-sm text-white/40 mt-1">JF Realty Jerusalem</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full h-13 px-4 bg-white/[0.06] border border-white/[0.1] rounded-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 text-sm" placeholder="admin@example.com" />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full h-13 px-4 bg-white/[0.06] border border-white/[0.1] rounded-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 text-sm" placeholder="••••••••" />
          </div>
          {error && <div className="text-sm text-red-400 bg-red-900/20 border border-red-900/30 rounded-sm px-4 py-3">{error}</div>}
          <button type="submit" disabled={loading} className="w-full h-13 bg-white text-black rounded-sm text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="text-center text-[11px] text-white/25 mt-8">Use your Supabase Auth credentials to access the admin portal.</p>
      </div>
    </div>
  );
}
