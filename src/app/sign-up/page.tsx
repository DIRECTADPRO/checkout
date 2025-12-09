/* FILE: src/app/sign-up/page.tsx */
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div 
      className="min-h-screen font-sans text-gray-900"
      style={{
        background: 'radial-gradient(circle at 50% 0%, #ffffff 0%, #f3f4f6 80%, #e5e7eb 100%)'
      }}
    >
      {/* BRAND HEADER */}
      <nav style={{
          borderBottom: '1px solid #E5E7EB', 
          backgroundColor: 'white', 
          padding: '15px 30px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center'
      }}>
         <Link href="/" style={{fontWeight: '800', fontSize: '20px', color: '#111827', textDecoration: 'none'}}>
            Ready Set Focus<span style={{color: '#6A45FF'}}>.com</span>
         </Link>
      </nav>

      {/* CENTERED CARD */}
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 20px'}}>
        <SignUp 
            path="/sign-up"
            appearance={{
                variables: {
                    colorPrimary: '#6A45FF',
                    colorText: '#111827',
                    borderRadius: '12px',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                },
                elements: {
                    card: { 
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', 
                        border: '1px solid #E5E7EB' 
                    },
                    formButtonPrimary: {
                        fontSize: '14px',
                        textTransform: 'none',
                        fontWeight: '700'
                    }
                }
            }}
        />
      </div>
    </div>
  );
}