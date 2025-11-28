/* FILE: src/app/page.tsx */
import { redirect } from 'next/navigation';

// Redirects the base URL (your-site.com/) to the default funnel (/email-bundle)
export default function Home() {
  redirect('/email-bundle');
}