import type { Metadata } from "next";
import AdminLoginForm from "@/components/AdminLoginForm";

export const metadata: Metadata = {
  title: "Dash Admin",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#eef3ec] px-4 py-10">
      <AdminLoginForm />
    </main>
  );
}
