import { useCallback, useMemo, useState } from "react";
import { toast } from "@/lib/toast"
import { usePersistentState } from "@/hooks/use-persistent-state";
import {
  LocalStorageKeys,
  EXPORT_JSON_INDENT_SPACES,
  EXPORT_FILE_TYPE,
  EXPORT_FILE_NAME
} from "@/configs";
import {
  createEmptyPreset,
  getLastNewPresetNumber,
  getAdjacentPreset,
  isValidPresetArray,
  type Preset
} from "@/lib/presets";

export function usePresets() {
  const [presets, setPresets] = usePersistentState<Preset[]>(LocalStorageKeys.PRESETS, []);
  const [currentPresetId, setCurrentPresetId] = useState<string>("");

  const presetsById = useMemo(() => {
    return Object.fromEntries(
      presets.map(p => [p.id, p])
    )
  }, [presets]);

  const currentPreset = useMemo(() => {
    return presetsById[currentPresetId] ?? null
  }, [presetsById, currentPresetId]);

  const setCurrentPreset = useCallback((preset: Preset | null) => {
    if (!preset) return

    setCurrentPresetId(preset.id);
  }, [setCurrentPresetId]);

  const createPreset = useCallback(() => {
    const nextPresetNumber = getLastNewPresetNumber(presets) + 1;
    const emptyPreset = createEmptyPreset(nextPresetNumber);

    setPresets((prev) =>
      [...prev, emptyPreset]
    );
    setCurrentPreset(emptyPreset);
  }, [setPresets, presets]);

  const deletePreset = useCallback((preset: Preset) => {
    if (preset.id === currentPreset?.id) {
      const presetToSet = getAdjacentPreset(presets, preset)
      setCurrentPreset(presetToSet);
    }

    setPresets((prev) =>
      prev.filter(p => p.id !== preset.id)
    );
  }, [setPresets, presets, currentPreset]);

  const updatePreset = useCallback((id: string, updated: Partial<Preset>) => {
    setPresets((prev) =>
      prev.map(p => (p.id === id ? { ...p, ...updated } : p))
    );
  }, [setPresets]);

  const exportPresets = useCallback(() => {
    const data = JSON.stringify(presets, null, EXPORT_JSON_INDENT_SPACES);
    const blob = new Blob([data], { type: EXPORT_FILE_TYPE });
    const url = URL.createObjectURL(blob);

    try {
      const a = document.createElement("a");
      a.download = EXPORT_FILE_NAME;
      a.href = url;
      a.click();
      a.remove()
    } catch {
      toast.error("Erro ao exportar presets");
    } finally {
      URL.revokeObjectURL(url)
    }
  }, [presets]);

  const importPresets = useCallback((json: string) => {
    try {
      const imported: Preset[] = JSON.parse(json);

      if (!isValidPresetArray(imported)) {
        throw new Error("Invalid presets");
      }

      setPresets(prev => {
        const map = new Map(prev.map(p => [p.id, p]));

        for (const preset of imported) {
          map.set(preset.id, preset);
        }

        return [...map.values()];
      });
    } catch {
      toast.error("Erro ao importar presets");
    }
  }, [setPresets]);

  return {
    presets,
    currentPreset,
    setCurrentPreset,
    createPreset,
    updatePreset,
    deletePreset,
    exportPresets,
    importPresets,
  };
}