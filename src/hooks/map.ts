import { useCallback, useEffect, useState } from "react";
import { Viewport } from "react-leaflet";

import { isIos } from "../util/is-ios";

const STORAGE_VIEWPORT_KEY = "velocity/viewport";
const viewportStorage = isIos ? localStorage : sessionStorage;
const defaultViewport: Viewport = {
  center: [50.77403035497566, 6.084194183349609],
  zoom: 14,
};

const setLsViewport = (v: Viewport) =>
  viewportStorage.setItem(STORAGE_VIEWPORT_KEY, JSON.stringify(v));

export const useCachedViewport = () => {
  const [viewport, setViewport] = useState<Viewport | null>(null);

  useEffect(() => {
    try {
      const viewport = viewportStorage.getItem(STORAGE_VIEWPORT_KEY);
      if (viewport) {
        const parsedViewport = JSON.parse(viewport);
        if (parsedViewport) {
          setViewport(parsedViewport);
          return;
        }
      }
    } catch (err) {
      console.warn(
        "Failed to deserialize local storage viewport, removing incorrect entry.\n\n",
        err,
      );
      viewportStorage.removeItem(STORAGE_VIEWPORT_KEY);
    }

    setViewport(defaultViewport);
  }, []);

  const setVp = useCallback((v: Viewport) => {
    setViewport(v);
    setLsViewport(v);
  }, []);

  return [viewport, setVp] as [Viewport | null, (v: Viewport) => void];
};
