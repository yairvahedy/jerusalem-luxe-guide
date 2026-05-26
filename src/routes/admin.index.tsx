import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { List, Users, TrendingUp, Plus, ArrowRight, AlertTriangle, CheckCircle2, RefreshCw, Database, ChevronDown, ChevronUp } from "lucide-react";
import { getAllListingsAdmin, getAllAgentsAdmin, checkDbHealth, type DbHealthStatus } from "@/lib/db";
import type { DbListing, Agent } from "@/lib/database.types";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [listings, setListings] = useState<DbListing[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<DbHealthStatus>("ok");
  const [dbMessage, setDbMessage] = useState("");
  const [showSetup, setShowSetup] = useState(false);

  const load = () => {
    setLoading(true);
    checkDbHealth().then(({ status, message }) => {
      setDbStatus(status);
      setDbMessage(message);
    });
    Promise.all([getAllListingsAdmin(), getAllAgentsAdmin()])
      .then(([l, a]) => { setListings(l as DbListing[]); setAgents(a); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const available = listings.filter((l) => l.status === "available").length;
  const rented = listings.filter((l) => l.status === "rented").length;
  const sold = listings.filter((l) => l.status === "sold").length;
  const drafts = listings.filter((l) => l.status === "draft").length;
  const featured = listings.filter((l) => l.featured && l.status === "available").length;

  const stats = [
    { label: "Available", value: loading ? "—" : available, icon: List, color: "text-emerald-400" },
    { label: "Rented / Sold", value: loading ? "—" : rented + sold, icon: TrendingUp, color: "text-blue-400" },
    { label: "Drafts", value: loading ? "—" : drafts, icon: List, color: "text-yellow-400" },
    { label: "Agents", value: loading ? "—" : agents.length, icon: Users, color: "text-purple-400" },
  ];

  const needsSetup = dbStatus === "no_table" || dbStatus === "error";

  return (
    <div className="p-5 sm:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">JF Realty admin panel</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          <RefreshCw className="size-3.5" /> Refresh
        </button>
      </div>

      {/* DB health banner */}
      {(needsSetup || dbStatus === "no_data") && (
        <div className={`mb-8 rounded-xl border p-5 ${needsSetup ? "bg-red-950/40 border-red-500/20" : "bg-amber-950/40 border-amber-500/20"}`}>
          <div className="flex items-start gap-3">
            <AlertTriangle className={`size-5 mt-0.5 shrink-0 ${needsSetup ? "text-red-400" : "text-amber-400"}`} />
            <div className="flex-1">
              <div className={`font-medium text-sm ${needsSetup ? "text-red-300" : "text-amber-300"}`}>
                {needsSetup ? "Database not set up" : "Database connected — no listings yet"}
              </div>
              <p className={`text-xs mt-1 ${needsSetup ? "text-red-400/70" : "text-amber-400/70"}`}>
                {needsSetup
                  ? "Tables are missing. Run the schema SQL to set up your database, then refresh."
                  : "Schema is applied. Add your first listing or re-run the SQL to seed sample data."}
              </p>
              <button
                onClick={() => setShowSetup((v) => !v)}
                className={`flex items-center gap-1.5 mt-3 text-xs font-medium transition-colors ${needsSetup ? "text-red-300 hover:text-red-100" : "text-amber-300 hover:text-amber-100"}`}
              >
                <Database className="size-3.5" />
                {showSetup ? "Hide" : "Show"} setup instructions
                {showSetup ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
              </button>
            </div>
          </div>

          {showSetup && (
            <div className="mt-4 ml-8 space-y-2.5">
              <SetupStep n={1} title="Open Supabase SQL Editor" desc="Log in at supabase.com → your project → SQL Editor" />
              <SetupStep n={2} title="Run supabase-schema.sql" desc="Copy the full contents of supabase-schema.sql from your project and paste + run it. This creates all tables, RLS policies, storage buckets, and seeds 5 agents and sample listings." />
              <SetupStep n={3} title="Create your admin user" desc="Supabase → Authentication → Users → Add user (set email + password). Use these credentials to log in here." />
              <SetupStep n={4} title="Refresh this page" desc="Click the Refresh button above — you should see your listings and agents appear." />
            </div>
          )}
        </div>
      )}

      {/* DB OK indicator */}
      {dbStatus === "ok" && (
        <div className="flex items-center gap-2 mb-6 text-xs text-emerald-500/70">
          <CheckCircle2 className="size-3.5" />
          Database connected
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-5">
            <s.icon className={`size-5 ${s.color} mb-3`} />
            <div className="text-3xl font-semibold text-white">{s.value}</div>
            <div className="text-[11px] uppercase tracking-widest text-white/40 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Featured note */}
      {featured > 0 && (
        <div className="mb-6 text-xs text-yellow-400/70 flex items-center gap-2">
          <span className="text-yellow-400">★</span> {featured} listing{featured > 1 ? "s" : ""} marked as featured on the homepage
        </div>
      )}

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <Link
          to="/admin/listings/new"
          className="flex items-center gap-4 bg-white text-black rounded-lg p-5 hover:bg-white/90 transition-colors group"
        >
          <div className="w-10 h-10 bg-black/10 rounded-md flex items-center justify-center">
            <Plus className="size-5" />
          </div>
          <div>
            <div className="font-medium">Add listing</div>
            <div className="text-sm text-black/50">Create a new property listing</div>
          </div>
          <ArrowRight className="size-4 ml-auto opacity-30 group-hover:opacity-60 transition-opacity" />
        </Link>
        <Link
          to="/admin/agents"
          className="flex items-center gap-4 bg-white/[0.04] border border-white/[0.07] rounded-lg p-5 hover:bg-white/[0.07] transition-colors group"
        >
          <div className="w-10 h-10 bg-white/10 rounded-md flex items-center justify-center">
            <Users className="size-5" />
          </div>
          <div>
            <div className="font-medium text-white">Manage agents</div>
            <div className="text-sm text-white/40">
              {loading ? "Loading…" : agents.length === 0 ? "No agents yet — add one" : `${agents.length} agent${agents.length > 1 ? "s" : ""} active`}
            </div>
          </div>
          <ArrowRight className="size-4 ml-auto text-white/20 group-hover:text-white/40 transition-colors" />
        </Link>
      </div>

      {/* Recent listings */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h2 className="text-sm font-medium text-white">Recent listings</h2>
          <Link to="/admin/listings" className="text-xs text-white/40 hover:text-white transition-colors">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="py-12 text-center text-white/30 text-sm">Loading…</div>
        ) : listings.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-white/30 text-sm mb-3">No listings yet</p>
            <Link to="/admin/listings/new" className="text-xs text-white/50 hover:text-white transition-colors border border-white/10 px-4 py-2 rounded-md">
              Add your first listing →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {listings.slice(0, 8).map((l) => (
              <div key={l.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                <div className="w-10 h-10 rounded-md bg-white/[0.06] overflow-hidden shrink-0">
                  {l.images?.[0] ? (
                    <img src={l.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/15 text-[9px]">—</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{l.title}</div>
                  <div className="text-[11px] text-white/40">
                    {l.neighborhood} · {l.type === "rent" ? `₪${new Intl.NumberFormat().format(l.price)}/mo` : `₪${new Intl.NumberFormat().format(l.price)}`}
                  </div>
                </div>
                <StatusBadge status={l.status} />
                <Link
                  to="/admin/listings/$id/edit"
                  params={{ id: l.id }}
                  className="text-[11px] text-white/30 hover:text-white transition-colors shrink-0"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SetupStep({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-5 h-5 rounded-full bg-white/10 text-white/50 text-[10px] flex items-center justify-center shrink-0 mt-0.5">{n}</div>
      <div>
        <div className="text-xs font-medium text-white/70">{title}</div>
        <div className="text-xs text-white/40 mt-0.5">{desc}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    available: "bg-emerald-500/15 text-emerald-400",
    rented: "bg-blue-500/15 text-blue-400",
    sold: "bg-purple-500/15 text-purple-400",
    draft: "bg-yellow-500/15 text-yellow-400",
  };
  return (
    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm ${map[status] ?? "bg-white/10 text-white/40"}`}>
      {status}
    </span>
  );
}
