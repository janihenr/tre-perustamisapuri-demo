"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

export function TampereLogo({ className = "" }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder during SSR
    return <div className={`h-8 w-auto ${className}`} />;
  }

  const isDark = resolvedTheme === 'dark';
  const logoSrc = isDark 
    ? "/images/tampere transparent.png" 
    : "/images/logo light.png";
  
  const altText = "Tampere logo";

  return (
    <div className={`relative h-8 w-auto ${className}`}>
      <Image
        src={logoSrc}
        alt={altText}
        height={32}
        width={120}
        className="object-contain"
        priority
      />
    </div>
  );
}
