import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { List, Users, TrendingUp, Plus, ArrowRight } from "lucide-react";
import { getAllListingsAdmin, getAllAgentsAdmin } from "@/lib/db";
import type { DbListing, Agent } from "@/lib/database.types";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [listings, setListings] = useState<DbListing[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllListingsAdmin(), getAllAgentsAdmin()])
      .then(([l, a]) => { setListings(l as DbListing[]); setAgents(a); })
      .finally(() => setLoading(false));
  }, []);

  const available = listings.filter((l) => l.status === "available").length;
  const sold = listings.filter((l) => l.status === "sold").length;
  const drafts = listings.filter((l) => l.status === "draft").length;
  const featured = listings.filter((l) => l.featured && l.status === "available").length;

  const stats = [
    { label: "Active Listings", value: loading ? "—" : available, icon: List, color: "text-emerald-400" },
    { label: "Sold", value: loading ? "—" : sold, icon: TrendingUp, color: "text-blue-400" },
    { label: "Drafts", value: loading ? "—" : drafts, icon: List, color: "text-yellow-400" },
    { label: "Agents", value: loading ? "—" : agents.length, icon: Users, color: "text-purple-400" },
  ];

  return (
    <div className="p-5 sm:p-8 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Welcome back to JF Realty admin.</p>
      </div>

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
            <div className="text-sm text-white/40">Add or edit agent profiles</div>
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
          <div className="py-12 text-center text-white/30 text-sm">No listings yet</div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {listings.slice(0, 6).map((l) => (
              <div key={l.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-10 h-10 rounded-md bg-white/[0.06] overflow-hidden shrink-0">
                  {l.images?.[0] ? (
                    <img src={l.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 text-[10px]">No img</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{l.title}</div>
                  <div className="text-[11px] text-white/40">{l.neighborhood}</div>
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

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    available: "bg-emerald-500/15 text-emerald-400",
    sold: "bg-blue-500/15 text-blue-400",
    draft: "bg-yellow-500/15 text-yellow-400",
  };
  return (
    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm ${map[status] ?? "bg-white/10 text-white/40"}`}>
      {status}
    </span>
  );
}
