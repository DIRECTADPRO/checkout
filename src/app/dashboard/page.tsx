/* FILE: src/app/dashboard/page.tsx */
import { auth, currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  // FIX: Added 'await' because auth() is now asynchronous
  const { userId } = await auth();
  
  // If not logged in, send to sign-in
  if (!userId) redirect("/sign-in");
  
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* HEADER */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
         <div className="font-bold text-xl text-gray-900">EmailFixed<span className="text-indigo-600">.com</span></div>
         <UserButton afterSignOutUrl="/"/>
      </nav>

      <main className="max-w-5xl mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
         
         {/* MAIN CONTENT */}
         <section className="md:col-span-2 space-y-8">
            <div>
               <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.firstName}!</h1>
               <p className="text-gray-500">Here are your deliverables.</p>
            </div>

            {/* LIBRARY GRID */}
            <div className="grid gap-4">
                {/* 1. The Book (Everyone gets this) */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-lg">The Next Best Message</h3>
                        <p className="text-sm text-gray-500">PDF Guide & Audio</p>
                    </div>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Download</button>
                </div>

                {/* 2. The Audit (Dynamic based on purchase) */}
                {/* Ideally, we check Strapi here to see if they bought it. For now, we show the placeholder. */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-bold text-lg">Inbox Defense Audit</h3>
                            <p className="text-sm text-gray-500">VIP Service</p>
                        </div>
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full uppercase">Pending Review</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">I am currently reviewing your domain settings. Expect an email within 48 hours.</p>
                </div>
            </div>
         </section>

         {/* SIDEBAR (Upsell for those who missed it) */}
         <aside>
            <div className="bg-[#2E1065] text-white p-6 rounded-xl shadow-lg">
                <h3 className="font-bold text-lg mb-2">Need More Help?</h3>
                <p className="text-indigo-200 text-sm mb-4">I can personally write your entire 10-email sequence for you.</p>
                <button className="w-full bg-white text-indigo-900 font-bold py-2 rounded-lg text-sm hover:bg-gray-100 transition">
                    Book a Call
                </button>
            </div>
         </aside>

      </main>
    </div>
  );
}