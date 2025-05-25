import { redirect } from 'next/navigation';

export default function AdminRoot() {
    // Use permanent redirect instead of temporary
    redirect('/admin/dashboard');
}