import { redirect } from 'next/navigation';

// Billing lives on the dashboard now (Stripe-backed). Keep this legacy route
// working by redirecting to it.
export default function SettingsBillingPage() {
  redirect('/dashboard/billing');
}
