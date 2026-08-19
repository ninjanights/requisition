import { useEffect, useState } from "react";
import { getBackendStatus } from "../services/backendService";

export type BackendStatus = "checking" | "awake" | "sleeping";

export function useBackendStatus() {
  const [status, setStatus] =
    useState<BackendStatus>("checking");

  useEffect(() => {
    let mounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const check = async () => {
      try {
        await getBackendStatus();

        if (!mounted) return;

        setStatus("awake");
      } catch {
        if (!mounted) return;

        setStatus("sleeping");

        timeoutId = setTimeout(check, 5000);
      }
    };

    check();

    return () => {
      mounted = false;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return {
    status,
    isAwake: status === "awake",
    isChecking: status === "checking",
  };
}

export default useBackendStatus;