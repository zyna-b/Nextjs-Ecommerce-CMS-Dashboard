import React from "react";

export const useOrigin = () => {
  const [mounted, setMounted] = React.useState(false);

  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return "";
  }

  return origin;
};
// This hook returns the origin of the current window location, ensuring it is only accessed after the component has mounted to avoid server-side rendering issues.
// It uses a state variable to track whether the component has mounted, and returns an empty string if it hasn't. Once mounted, it retrieves the origin from the window location and returns it.
// This is useful for constructing URLs or making API requests that require the origin of the current page.