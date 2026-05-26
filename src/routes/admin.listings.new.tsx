import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ListingForm } from "@/components/admin/ListingForm";
import { createListing } from "@/lib/db";
import type { DbListingInsert } from "@/lib/database.types";

export const Route = createFileRoute("/admin/listings/new")({
  component: NewListing,
});

function NewListing() {
  const navigate = useNavigate();

  const handleSave = async (data: DbListingInsert) => {
    await createListing(data);
    navigate({ to: "/admin/listings" });
  };

  return (
    <div className="p-5 sm:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Add listing</h1>
        <p className="text-white/40 text-sm mt-1">Fill in the details below to create a new property listing.</p>
      </div>
      <ListingForm onSave={handleSave} />
    </div>
  );
}
