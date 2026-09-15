import { useEffect, useState } from "react";

export function useHash(): [string, (hash: string) => void] {
  const [hash, setHashState] = useState(() => window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHashState(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function setHash(next: string) {
    window.location.hash = next;
    setHashState(next.startsWith("#") ? next : `#${next}`);
  }

  return [hash, setHash];
}
