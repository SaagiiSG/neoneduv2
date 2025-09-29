import type { Metadata } from "next";
import { SupabaseProvider } from "@/contexts/SupabaseContext";
import { AdminDataProvider } from "@/contexts/AdminDataContext";

export const metadata: Metadata = {
  title: "Admin Panel - Neon Edu",
  description: "Neon Edu Admin Panel for managing courses, team members, and study abroad programs",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SupabaseProvider>
      <AdminDataProvider>
        {children}
      </AdminDataProvider>
    </SupabaseProvider>
  );
}
