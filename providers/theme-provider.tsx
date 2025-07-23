"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = useState(false);
  // This effect ensures that the theme is only applied after the component mounts
  useEffect(() => {
    setMounted(true);
  }, []);
  // If the component is not mounted, return null to avoid hydration issues
  if (!mounted) {
    return null;
  }
  
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
