import { APP_NAME } from "@/configs";

export default {
  globals: {
    field: "Field",
    fields: "Fields",
    fields_zero: "No fields",
    fields_one: "{{ count }} Field",
    fields_other: "{{ count }} Fields",

    preset: "Preset",
    presets: "Presets",
    presets_zero: "No presets",
    presets_one: "{{ count }} Preset",
    presets_other: "{{ count }} Presets",

    import: "Import",
    export: "Export",
    confirm: "Confirm",
    cancel: "Cancel",
    copiedToClipboard: "Copied to clipboard!",
    failedToCopy: "Failed to copy {{ item }}",
  },
  configs: {
    // TODO: Add config modal translations
    importStrategy: {
      append: {
        title: "Append",
        description: "Append new presets to existing ones without replacing duplicates",
      },
      overwrite: {
        title: "Overwrite",
        description: "Overwrite the existing preset with the imported one",
      },
      replaceAll: {
        title: "Replace all",
        description: "Delete all current presets and import new ones",
      }
    }
  },
  defaults: {
    alert: {
      title: "Warning",
      description: "Are you sure you want to continue?",
      confirmButton: "$t(globals.confirm)",
      cancelButton: "$t(globals.cancel)",
    }
  },
  header: {
    title: APP_NAME,
    description: "Fill forms automatically with random data",
  },
  presetsManager: {
    title: "$t(globals.presets)",
    buttons: {
      import: "$t(globals.import)",
      export: "$t(globals.export)",
      new: "New"
    },
    alerts: {
      deletePreset: {
        description: "Are you sure you want to delete preset \"{{ presetToDelete.name }}\"?"
      }
    },
    dialogs: {
      importPreset: {
        title: "$t(globals.import)",
        description_zero: "$t(globals.presets, { count: total }) to import",
        description_one: "{{ count }} conflict among $t(globals.presets, { count: total })",
        description_other: "{{ count }} conflicts among $t(globals.presets, { count: total })",
        confirmButton: "$t(globals.import)",
        cancelButton: "$t(globals.cancel)",
        form: {
          strategyToggle: {
            label: "Strategy",
          }
        }
      }
    },
    form: {
      presetSelect: {
        placeholder: "Select a preset",
        empty: "No preset found"
      }
    },
    messages: {
      importPreset: {
        invalid: "Invalid preset JSON",
        failed: "Failed to import presets",
      },
      exportPreset: {
        failed: "Failed to export presets",
      }
    }
  },
  fieldsManager: {
    description: "$t(globals.fields)",
    buttons: {
      add: "Add field",
    },
    popovers: {
      fieldSettings: {
        title: "Settings",
        formatButton: "Format",
        caption: "Use JSON5 to configure the generator.",
        docUrl: "Docs",
      }
    },
    form: {
      generatorSelect: {
        placeholder: "Select a generator",
        empty: "No generator found"
      },
      selectorInput: {
        placeholder: ".class / #id / [data-test]",
      },
      presetNameInput: {
        placeholder: "Preset name",
      }
    },
    messages: {
      copyValue: {
        failed: "$t(globals.failedToCopy, { item: 'value' })",
        success: "$t(globals.copiedToClipboard)",
      }
    }
  },
  footer: {
    buttons: {
      generateData: "Generate data",
      copyAsJson: "Copy as JSON",
    },
    messages: {
      copyJson: {
        success: "$t(globals.copiedToClipboard)",
        failed: "$t(globals.failedToCopy, { item: 'JSON' })",
      },
    }
  }
}