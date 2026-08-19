import { useEffect, useState } from "react";
import { getBackendStatus } from "../services/backendService";

export function useBackendStatus() {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    let mounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    async function check() {
      try {
        await getBackendStatus();
        if (mounted) {
          setOnline(true);
        }
      } catch {
        if (mounted) {
          setOnline(false);
          timeoutId = setTimeout(check, 5000);
        }
      }
    }

    check();

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return online;
}

export default useBackendStatus;
