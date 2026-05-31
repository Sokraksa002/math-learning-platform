import { AppLayout } from "./AppLayout";
import { isLoggedIn } from "../../utils/auth";
import Footer from "../Home/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const userLoggedIn = isLoggedIn();

  return (
    <AppLayout isLoggedIn={userLoggedIn}>
      {/* ✅ MAIN CONTENT */}
      <main className="flex-1 w-full overflow-y-auto">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-4">
          <Outlet />
        </div>
      </main>

      {/* ✅ FOOTER */}
      <Footer />

    </AppLayout>
  );
}