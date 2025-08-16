'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after a short delay
    const redirectTimer = setTimeout(() => {
      router.push('/dashboard');
    }, 1500);

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <div className="bg-white/20 p-4 rounded-full inline-block mb-6">
          <Image
            src="/curexo-logo.svg"
            alt="CUREXO logo"
            width={80}
            height={80}
            className="dark:invert"
            priority
          />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">CUREXO</h1>
        <p className="text-xl text-white/80 mb-8">Your AI-Powered Health Companion</p>
        <div className="animate-pulse text-white">Redirecting to dashboard...</div>
       </div>
     </div>
  );
}
