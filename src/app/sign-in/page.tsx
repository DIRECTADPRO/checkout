/* FILE: src/app/sign-in/page.tsx */
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div 
      className="min-h-screen font-sans text-gray-900"
      style={{
        background: 'radial-gradient(circle at 50% 0%, #ffffff 0%, #f8fafc 80%, #e2e8f0 100%)'
      }}
    >
      {/* 1. THE CENTERED LOGO AREA */}
      <div style={{
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          paddingTop: '60px',
          marginBottom: '30px'
      }}>
         <Image 
            src="https://res.cloudinary.com/dse1cikja/image/upload/v1763817716/Logo2_on0p1k.png"
            alt="Ready Set Focus Logo"
            width={200}
            height={60}
            style={{ objectFit: 'contain' }}
            priority
         />
      </div>

      {/* 2. THE NEW "AMAZING" HEADLINE */}
      <div style={{ textAlign: 'center', marginBottom: '30px', padding: '0 20px' }}>
        <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '800', 
            color: '#111827', 
            letterSpacing: '-0.5px',
            marginBottom: '8px'
        }}>
            Welcome Back!
        </h1>
        <p style={{ fontSize: '16px', color: '#6B7280', fontWeight: '500' }}>
            Access Your Member Dashboard
        </p>
      </div>

      {/* 3. CENTERED CLERK CARD */}
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '60px'}}>
        <SignIn 
            path="/sign-in"
            appearance={{
                variables: {
                    colorPrimary: '#6A45FF',
                    colorText: '#111827',
                    colorBackground: '#ffffff',
                    borderRadius: '16px',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    spacingUnit: '1.1rem',
                },
                elements: {
                    // FIX: Moved these from 'layout' to 'elements'
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                    
                    card: { 
                        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,0,0,0.05)', 
                        padding: '40px',
                        width: '100%',
                        maxWidth: '480px'
                    },
                    formButtonPrimary: {
                        fontSize: '16px',
                        textTransform: 'none',
                        fontWeight: '700',
                        padding: '12px',
                        boxShadow: '0 4px 12px 0 rgba(106, 69, 255, 0.3)'
                    },
                    formFieldInput: {
                        padding: '12px',
                        fontSize: '16px',
                        backgroundColor: '#F9FAFB',
                        borderColor: '#E5E7EB'
                    },
                    footerActionLink: {
                         fontWeight: '600',
                         color: '#6A45FF'
                    }
                }
            }}
        />
      </div>
    </div>
  );
}