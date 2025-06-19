// src/app/page.tsx  (server component)
import { redirect } from 'next/navigation';

export default function Root() {
  // Immediately send every visitor to /dashboard.
  // The dashboard itself will decide whether to push back to /login.
  redirect('/dashboard');
}
