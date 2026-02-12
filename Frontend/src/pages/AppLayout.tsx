import { Outlet } from "react-router";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 to-teal-50 px-4 py-12">
      <main>
        <Outlet />
      </main>
    </div>
  );
}
