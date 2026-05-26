import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ListingForm } from "@/components/admin/ListingForm";
import { getAllListingsAdmin, updateListing } from "@/lib/db";
import type { DbListing, DbListingUpdate } from "@/lib/database.types";

export const Route = createFileRoute("/admin/listings/$id/edit")({
  component: EditListing,
});

function EditListing() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState<DbListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllListingsAdmin().then((all) => {
      const found = (all as DbListing[]).find((l) => l.id === id) ?? null;
      setListing(found);
      setLoading(false);
    });
  }, [id]);

  const handleSave = async (data: DbListingUpdate) => {
    await updateListing(id, data);
    navigate({ to: "/admin/listings" });
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="p-8 text-center text-white/40">
        Listing not found.
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Edit listing</h1>
        <p className="text-white/40 text-sm mt-1 truncate">{listing.title}</p>
      </div>
      <ListingForm initialData={listing} onSave={handleSave} />
    </div>
  );
}
