export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string;
          name: string;
          bio: string | null;
          portrait_url: string | null;
          whatsapp: string | null;
          phone: string | null;
          email: string | null;
          slug: string;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          bio?: string | null;
          portrait_url?: string | null;
          whatsapp?: string | null;
          phone?: string | null;
          email?: string | null;
          slug: string;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          bio?: string | null;
          portrait_url?: string | null;
          whatsapp?: string | null;
          phone?: string | null;
          email?: string | null;
          slug?: string;
          active?: boolean;
          created_at?: string;
        };
      };
      listings: {
        Row: {
          id: string;
          slug: string;
          title: string;
          price: number;
          type: "sale" | "rent";
          neighborhood: string;
          bedrooms: number;
          bathrooms: number;
          sqm: number;
          balcony: boolean;
          mamad: boolean;
          elevator: boolean;
          parking: boolean;
          description: string | null;
          images: string[];
          video_url: string | null;
          status: "available" | "sold" | "draft";
          featured: boolean;
          agent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          price?: number;
          type?: "sale" | "rent";
          neighborhood: string;
          bedrooms?: number;
          bathrooms?: number;
          sqm?: number;
          balcony?: boolean;
          mamad?: boolean;
          elevator?: boolean;
          parking?: boolean;
          description?: string | null;
          images?: string[];
          video_url?: string | null;
          status?: "available" | "sold" | "draft";
          featured?: boolean;
          agent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          price?: number;
          type?: "sale" | "rent";
          neighborhood?: string;
          bedrooms?: number;
          bathrooms?: number;
          sqm?: number;
          balcony?: boolean;
          mamad?: boolean;
          elevator?: boolean;
          parking?: boolean;
          description?: string | null;
          images?: string[];
          video_url?: string | null;
          status?: "available" | "sold" | "draft";
          featured?: boolean;
          agent_id?: string | null;
          updated_at?: string;
        };
      };
    };
  };
};

export type Agent = Database["public"]["Tables"]["agents"]["Row"];
export type AgentInsert = Database["public"]["Tables"]["agents"]["Insert"];
export type AgentUpdate = Database["public"]["Tables"]["agents"]["Update"];
export type DbListing = Database["public"]["Tables"]["listings"]["Row"];
export type DbListingInsert = Database["public"]["Tables"]["listings"]["Insert"];
export type DbListingUpdate = Database["public"]["Tables"]["listings"]["Update"];
