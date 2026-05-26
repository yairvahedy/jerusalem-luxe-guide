import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { getAllListingsAdmin, deleteListing, updateListing } from "@/lib/db";
import type { DbListing } from "@/lib/database.types";

export const Route = createFileRoute("/admin/listings/")({
  component: AdminListings,
});

function AdminListings() {
  const [listings, setListings] = useState<DbListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    getAllListingsAdmin()
      .then((l) => setListings(l as DbListing[]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (l: DbListing) => {
    if (!confirm(`Delete "${l.title}"? This cannot be undone.`)) return;
    setDeleting(l.id);
    await deleteListing(l.id);
    setDeleting(null);
    load();
  };

  const handleToggleFeatured = async (l: DbListing) => {
    await updateListing(l.id, { featured: !l.featured });
    load();
  };

  const handleToggleStatus = async (l: DbListing) => {
    const next = l.status === "available" ? "sold" : "available";
    await updateListing(l.id, { status: next });
    load();
  };

  return (
    <div className="p-5 sm:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Listings</h1>
          <p className="text-white/40 text-sm mt-1">{listings.length} total</p>
        </div>
        <Link
          to="/admin/listings/new"
          className="inline-flex items-center gap-2 h-10 px-5 bg-white text-black rounded-md text-sm font-medium hover:bg-white/90 transition-colors"
        >
          <Plus className="size-4" /> Add listing
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-white/30">Loading…</div>
      ) : listings.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-white/30 mb-4">No listings yet</p>
          <Link to="/admin/listings/new" className="text-sm text-white/60 hover:text-white">Add your first listing →</Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white/[0.03] border border-white/[0.07] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  {["Property", "Neighborhood", "Price", "Status", "Featured", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-[10px] uppercase tracking-widest text-white/30 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {listings.map((l) => (
                  <tr key={l.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-white/[0.06] shrink-0">
                          {l.images?.[0] ? (
                            <img src={l.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20 text-[9px]">—</div>
                          )}
                        </div>
                        <span className="text-white font-medium truncate max-w-[200px]">{l.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-white/50">{l.neighborhood}</td>
                    <td className="px-5 py-3.5 text-white/70">
                      {l.price ? `₪${new Intl.NumberFormat().format(l.price)}` : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => handleToggleStatus(l)} className="focus:outline-none">
                        <StatusBadge status={l.status} />
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => handleToggleFeatured(l)} className={`transition-colors ${l.featured ? "text-yellow-400" : "text-white/20 hover:text-white/40"}`}>
                        <Star className="size-4" fill={l.featured ? "currentColor" : "none"} />
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Link
                          to="/admin/listings/$id/edit"
                          params={{ id: l.id }}
                          className="text-white/40 hover:text-white transition-colors"
                        >
                          <Pencil className="size-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(l)}
                          disabled={deleting === l.id}
                          className="text-white/20 hover:text-red-400 transition-colors disabled:opacity-30"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {listings.map((l) => (
              <div key={l.id} className="bg-white/[0.04] border border-white/[0.07] rounded-lg p-4">
                <div className="flex gap-3 mb-3">
                  <div className="w-14 h-14 rounded-md overflow-hidden bg-white/[0.06] shrink-0">
                    {l.images?.[0] ? (
                      <img src={l.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm truncate">{l.title}</div>
                    <div className="text-white/40 text-xs mt-0.5">{l.neighborhood}</div>
                    <div className="text-white/60 text-xs mt-1">
                      {l.price ? `₪${new Intl.NumberFormat().format(l.price)}` : "Price on request"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={l.status} />
                    {l.featured && <span className="text-[10px] text-yellow-400">★ Featured</span>}
                  </div>
                  <div className="flex gap-3">
                    <Link to="/admin/listings/$id/edit" params={{ id: l.id }} className="text-xs text-white/40 hover:text-white">Edit</Link>
                    <button onClick={() => handleDelete(l)} className="text-xs text-white/30 hover:text-red-400">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
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
    <span className={`inline-flex text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-sm cursor-pointer ${map[status] ?? "bg-white/10 text-white/40"}`}>
      {status}
    </span>
  );
}
