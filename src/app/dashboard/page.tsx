/* FILE: src/app/dashboard/page.tsx */
import { auth, currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import '@/styles/checkout-design.css'; 

export default async function DashboardPage() {
  const { userId } = await auth();
  
  // Guard: Redirect if not logged in
  if (!userId) redirect("/sign-in");
  
  const user = await currentUser();

  return (
    <div 
      className="min-h-screen font-sans text-gray-900"
      style={{
        background: 'radial-gradient(circle at 50% 0%, #ffffff 0%, #f3f4f6 80%, #e5e7eb 100%)'
      }}
    >
      {/* HEADER */}
      <nav style={{borderBottom: '1px solid #E5E7EB', backgroundColor: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
         <div style={{fontWeight: '800', fontSize: '20px', color: '#111827'}}>
            Ready Set Focus<span style={{color: '#6A45FF'}}>.com</span>
         </div>
         <UserButton afterSignOutUrl="/"/>
      </nav>

      <main style={{maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px'}}>
         
         {/* MAIN CONTENT AREA */}
         <section>
            <div style={{marginBottom: '30px'}}>
               <h1 style={{fontSize: '32px', fontWeight: '800', color: '#111827', marginBottom: '10px'}}>
                  Welcome, {user?.firstName || "Member"}!
               </h1>
               <p style={{color: '#6B7280', fontSize: '16px'}}>
                  Here is the content you ordered.
               </p>
            </div>

            {/* CARD 1: The Core Offer (Book) */}
            <div className="card" style={{
                padding: '25px', 
                marginBottom: '25px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', 
                border: '1px solid #E5E7EB'
            }}>
                <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
                    <div style={{fontSize: '30px', background: '#F3F4F6', width: '60px', height: '60px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>📚</div>
                    <div>
                        <h3 style={{fontWeight: '800', fontSize: '18px', color: '#111827'}}>The Next Best Message</h3>
                        <p style={{fontSize: '14px', color: '#6B7280'}}>PDF Guide & Audio Files</p>
                    </div>
                </div>
                {/* Placeholder Link - You will update this with your real PDF link later */}
                <a href="#" className="cta-button" style={{fontSize: '14px', padding: '12px 24px', width: 'auto', backgroundColor: '#4F46E5', textDecoration: 'none'}}>
                    Download PDF
                </a>
            </div>

            {/* CARD 2: The Audit (Service) */}
            <div className="card" style={{padding: '25px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E5E7EB'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px'}}>
                    <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
                        <div style={{fontSize: '30px', background: '#ECFDF5', width: '60px', height: '60px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>🛡️</div>
                        <div>
                            <h3 style={{fontWeight: '800', fontSize: '18px', color: '#111827'}}>Inbox Defense Audit</h3>
                            <p style={{fontSize: '14px', color: '#6B7280'}}>VIP Service</p>
                        </div>
                    </div>
                    {/* Status Pill */}
                    <span style={{backgroundColor: '#FEF3C7', color: '#92400E', fontSize: '11px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                        Status: Pending
                    </span>
                </div>
                
                <div style={{padding: '15px', backgroundColor: '#F9FAFB', borderRadius: '8px', fontSize: '14px', color: '#4B5563', lineHeight: '1.5'}}>
                    <p><strong>Next Steps:</strong> I am currently reviewing your domain settings. You will receive a personalized Loom video via email within 48 hours.</p>
                </div>
            </div>
         </section>

         {/* SIDEBAR: Final Upsell / Call to Action */}
         <aside>
            <div style={{backgroundColor: '#1F2937', color: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)'}}>
                <h3 style={{fontWeight: '800', fontSize: '18px', marginBottom: '10px', color: 'white'}}>Need it done faster?</h3>
                <p style={{fontSize: '14px', color: '#9CA3AF', marginBottom: '20px', lineHeight: '1.5'}}>
                    I can personally write your entire 10-email welcome sequence for you.
                </p>
                <button style={{width: '100%', backgroundColor: 'white', color: '#111827', fontWeight: 'bold', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px'}}>
                    Book a Strategy Call
                </button>
            </div>
         </aside>

      </main>
    </div>
  );
}