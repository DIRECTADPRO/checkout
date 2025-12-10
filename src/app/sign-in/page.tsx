/* FILE: src/app/sign-in/page.tsx */
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div 
      // 'font-sans' ensures we use your project's main font
      className="min-h-screen font-sans text-gray-900 flex flex-col justify-center items-center"
      style={{
        background: 'radial-gradient(circle at 50% 0%, #ffffff 0%, #f8fafc 80%, #e2e8f0 100%)'
      }}
    >
      {/* LOGO AREA */}
      <div className="mb-8">
         <Image 
            src="https://res.cloudinary.com/dse1cikja/image/upload/v1763817716/Logo2_on0p1k.png"
            alt="Ready Set Focus Logo"
            width={200}
            height={60}
            style={{ objectFit: 'contain' }}
            priority
         />
      </div>

      {/* HEADLINE */}
      <div className="text-center mb-8 px-4">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Welcome Back!
        </h1>
        <p className="text-gray-500 font-medium">
            Access Your Member Dashboard
        </p>
      </div>

      {/* CLERK CARD */}
      <SignIn 
        path="/sign-in"
        appearance={{
            variables: {
                colorPrimary: '#6A45FF', 
                colorText: '#111827',
                colorBackground: '#ffffff',
                // CRITICAL: This makes it match your website font exactly
                fontFamily: 'inherit',
                // CRITICAL: Matches the curve of your checkout
                borderRadius: '16px', 
            },
            elements: {
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                card: { 
                    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,0,0,0.05)', 
                    padding: '40px',
                    width: '100%',
                    maxWidth: '480px',
                    borderRadius: '20px' // Slightly softer outer curve
                },
                formButtonPrimary: {
                    fontSize: '15px',
                    textTransform: 'none',
                    fontWeight: '600',
                    padding: '12px',
                    borderRadius: '10px', // Matches input fields
                    boxShadow: '0 4px 12px 0 rgba(106, 69, 255, 0.3)'
                },
                formFieldInput: {
                    padding: '12px',
                    fontSize: '15px',
                    backgroundColor: '#F9FAFB',
                    borderColor: '#E5E7EB',
                    borderRadius: '10px', // Matches buttons
                    boxShadow: 'none'
                },
                footerActionLink: {
                     fontWeight: '600',
                     color: '#6A45FF'
                }
            }
        }}
      />
    </div>
  );
}