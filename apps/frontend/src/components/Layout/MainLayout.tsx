import { AppLayout } from "./AppLayout";
import { isLoggedIn } from "../../utils/auth";
import Footer from "../Home/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}
export default function MainLayout({ children }: MainLayoutProps) {
  const userLoggedIn = isLoggedIn();

  return (
    <AppLayout isLoggedIn={userLoggedIn}>
      <div className="flex min-h-screen flex-col bg-white">
        
        {/* MAIN CONTENT */}
        <main className="flex-1 w-full overflow-y-auto">
          <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-4">
            {children}
          </div>
        </main>

        {/* FOOTER ALWAYS AT BOTTOM */}
        <Footer />
      </div>
    </AppLayout>
  );
}
