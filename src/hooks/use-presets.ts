import { useCallback, useMemo, useRef, useState } from "react";
import type { Preset } from "@/lib/faker-options";

const STORAGE_KEY = "formfiller-presets";

function loadPresets(): Preset[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function savePresets(presets: Preset[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

type UpdateOptions = {
    persist?: boolean;
};

export function usePresets() {
    const [presets, setPresets] = useState<Preset[]>(loadPresets);
    const latestPresetsRef = useRef<Preset[]>(presets);

    const setPresetsAndTrack = useCallback((updater: (prev: Preset[]) => Preset[], persist = false) => {
        setPresets(prev => {
            const next = updater(prev);
            latestPresetsRef.current = next;
            if (persist) savePresets(next);
            return next;
        });
    }, []);

    const persistNow = useCallback(() => {
        savePresets(latestPresetsRef.current);
    }, []);

    const addPreset = useCallback((preset: Preset, options: UpdateOptions = {}) => {
        setPresetsAndTrack(prev => [...prev, preset], options.persist ?? true);
    }, [setPresetsAndTrack]);

    const updatePreset = useCallback((id: string, updated: Partial<Preset>, options: UpdateOptions = {}) => {
        setPresetsAndTrack(
          prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)),
          options.persist ?? false
        );
    }, [setPresetsAndTrack]);

    const deletePreset = useCallback((id: string, options: UpdateOptions = {}) => {
        setPresetsAndTrack(prev => prev.filter(p => p.id !== id), options.persist ?? true);
    }, [setPresetsAndTrack]);

    const exportPresets = useCallback(() => {
        const blob = new Blob([JSON.stringify(presets, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "auto-form-presets.json";
        a.click();
        URL.revokeObjectURL(url);
    }, [presets]);

    const importPresets = useCallback((json: string) => {
        try {
            const imported: Preset[] = JSON.parse(json);

            if (!Array.isArray(imported)) return false

            setPresetsAndTrack(prev => [...prev, ...imported], true);
            return true;
        } catch {}
        return false;
    }, [setPresetsAndTrack]);

    const getPresetById = useCallback((id: string) => presets.find(p => p.id === id) ?? null, [presets]);

    return useMemo(() => ({
          presets,
          addPreset,
          updatePreset,
          deletePreset,
          exportPresets,
          importPresets,
          getPresetById,
          persistNow,
      }),
      [presets, addPreset, updatePreset, deletePreset, exportPresets, importPresets, getPresetById, persistNow]
    );
}