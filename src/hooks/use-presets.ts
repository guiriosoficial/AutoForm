import { useCallback, useMemo } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state.ts";
import { LocalStorageKeys } from "@/configs";
import type { Preset } from "@/types/Presets";

export function usePresets() {
  const [presets, setPresets] = usePersistentState<Preset[]>(LocalStorageKeys.PRESETS, []);

  const setPresetsAndTrack = useCallback((
    updater: (prev: Preset[]) => Preset[]
  ) => {
    setPresets(prev =>  updater(prev));
  }, []);

  const addPreset = useCallback((preset: Preset) => {
    setPresetsAndTrack(
      prev => [...prev, preset]
    );
  }, [setPresetsAndTrack]);

  const updatePreset = useCallback((id: string, updated: Partial<Preset>) => {
    setPresetsAndTrack(
      prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p))
    );
  }, [setPresetsAndTrack]);

  const deletePreset = useCallback((id: string,) => {
    setPresetsAndTrack(
      prev => prev.filter(p => p.id !== id)
    );
  }, [setPresetsAndTrack]);

  const exportPresets = useCallback(() => {
    const blob = new Blob([JSON.stringify(presets, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "auto-form-presets.json";
    a.click();
    a.remove()
    URL.revokeObjectURL(url)
  }, [presets]);

  const importPresets = useCallback((json: string) => {
    try {
      const imported: Preset[] = JSON.parse(json);

      if (!Array.isArray(imported)) return false

      setPresetsAndTrack(prev => [...prev, ...imported]);
      return true;
    } catch {}
    return false;
  }, [setPresetsAndTrack]);

  const getPresetById = useCallback((id: string) => {
    return presets.find(p => p.id === id) ?? null;
  }, [presets]);

  return useMemo(() => ({
      presets,
      addPreset,
      updatePreset,
      deletePreset,
      exportPresets,
      importPresets,
      getPresetById
    }),
    [presets, addPreset, updatePreset, deletePreset, exportPresets, importPresets, getPresetById]
  );
}