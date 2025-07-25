'use client';

import { useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Nav from '@/components/admin/nav';
import Header from '@/components/admin/header';
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';

// A helper function to get the page title from the URL path
const getTitleFromPath = (path: string): string => {
  // Check if we are on the main products page
  if (path === '/hatsadmin/products') {
    return ''; // Return an empty string to hide the title
  }
  
  const parts = path.split('/').filter(Boolean);
  
  if (parts.length < 2) {
    return 'Dashboard';
  }

  const title = parts[parts.length - 1];

  // This check ensures 'title' is always a string before we use it
  if (!title) {
    return 'Dashboard';
  }
  
  // Capitalize the first letter and make it readable
  return title.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};


export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const pathname = usePathname();
  const pageTitle = getTitleFromPath(pathname);
  
  // Completely exclude login pages from admin layout
  if (pathname === '/hatsadmin/login' || pathname.includes('(login)')) {
    return <>{children}</>;
  }

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen w-full bg-gray-50 text-gray-900">
        <Nav isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />

        <div className="flex flex-1 flex-col md:ml-64 z-10 relative">
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}