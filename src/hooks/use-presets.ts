import { useState, useEffect, useCallback } from "react";
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

export function usePresets() {
    const [presets, setPresets] = useState<Preset[]>(loadPresets);

    useEffect(() => {
        savePresets(presets);
    }, [presets]);

    const addPreset = useCallback((preset: Preset) => {
        setPresets(prev => [...prev, preset]);
    }, []);

    const updatePreset = useCallback((id: string, updated: Partial<Preset>) => {
        setPresets(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    }, []);

    const deletePreset = useCallback((id: string) => {
        setPresets(prev => prev.filter(p => p.id !== id));
    }, []);

    const exportAll = useCallback(() => {
        const blob = new Blob([JSON.stringify(presets, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "formfiller-presets.json";
        a.click();
        URL.revokeObjectURL(url);
    }, [presets]);

    const importPresets = useCallback((json: string) => {
        try {
            const imported: Preset[] = JSON.parse(json);
            if (Array.isArray(imported)) {
                setPresets(prev => [...prev, ...imported]);
                return true;
            }
        } catch {}
        return false;
    }, []);

    return { presets, addPreset, updatePreset, deletePreset, exportAll, importPresets };
}
