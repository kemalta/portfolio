"use client";

import { useEffect, useState } from "react";

export type DeviceProfile = {
  isMobile: boolean;
  isTablet: boolean;
  reducedMotion: boolean;
  dpr: number;
  width: number;
  ready: boolean;
};

const INITIAL: DeviceProfile = {
  isMobile: false,
  isTablet: false,
  reducedMotion: false,
  dpr: 1.5,
  width: 1440,
  ready: false,
};

export function useDeviceProfile(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>(INITIAL);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseQuery = window.matchMedia("(pointer: coarse)");

    const measure = () => {
      const width = window.innerWidth;
      setProfile({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1180,
        reducedMotion: motionQuery.matches,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        width,
        ready: true,
      });
    };

    measure();
    window.addEventListener("resize", measure, { passive: true });
    motionQuery.addEventListener("change", measure);
    coarseQuery.addEventListener("change", measure);

    return () => {
      window.removeEventListener("resize", measure);
      motionQuery.removeEventListener("change", measure);
      coarseQuery.removeEventListener("change", measure);
    };
  }, []);

  return profile;
}
