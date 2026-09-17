import { APP_NAME, APP_AUTHOR_USER } from "@/configs";

export const enTranslations = {
  globals: {
    appTitle: APP_NAME,
    appDescription: "Fill forms automatically with random data",
    credits: `Made with ♥ by\u00A0<author>${APP_AUTHOR_USER}</author>`,

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
    loadedPresets_zero: "No presets loaded",
    loadedPresets_one: "{{ count }} preset loaded",
    loadedPresets_other: "{{ count }} presets loaded",

    import: "Import",
    export: "Export",
    confirm: "Confirm",
    cancel: "Cancel",
    copiedToClipboard: "Copied to clipboard!",
    failedToCopy: "Failed to copy {{ item }}",
  },
  configs: {
    catalog: {
      method: {
        defaultName: "newMethod",
      },
    },
    preset: {
      defaultName: "New preset",
    },
    theme: {
      dark: "Dark",
      light: "Light",
      system: "System",
    },
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
      },
      alwaysAsk: {
        title: "Always ask",
        description: "Always ask when importing presets",
      },
    },
  },
  defaults: {
    alert: {
      title: "Warning",
      description: "Are you sure you want to continue?",
      confirmButton: "$t(globals.confirm)",
      cancelButton: "$t(globals.cancel)",
    },
  },
  preferencesManager: {
    title: "Preferences",
    confirmButton: "Concluded",
    form: {
      themeToggle: {
        label: "Theme",
      },
      importStrategyToggle: {
        label: "Import strategy",
      },
      localeSelect: {
        label: "Locale",
        placeholder: "Select a locale",
        empty: "No locale found",
      },
      languageSelect: {
        label: "Language",
        placeholder: "Select a language",
        empty: "No language found",
      },
    },
  },
  presetsManager: {
    title: "$t(globals.presets)",
    buttons: {
      import: "$t(globals.import)",
      export: "$t(globals.export)",
      new: "New",
    },
    alerts: {
      deletePreset: {
        description: 'Are you sure you want to delete preset "{{ presetToDelete.name }}"?',
      },
    },
    dialogs: {
      importPreset: {
        title: "$t(globals.import)",
        description_zero: "$t(globals.presets, { 'count': {{ total }} }) to import",
        description_one: "{{ count }} conflict among $t(globals.presets, { 'count': {{ total }} })",
        description_other: "{{ count }} conflicts among $t(globals.presets, { 'count': {{ total }} })",
        confirmButton: "$t(globals.import)",
        cancelButton: "$t(globals.cancel)",
        form: {
          strategyToggle: {
            label: "Strategy",
          },
        },
      },
    },
    form: {
      presetSelect: {
        placeholder: "Select a preset",
        empty: "No preset found",
      },
    },
    messages: {
      importPreset: {
        invalid: "Invalid preset JSON",
        failed: "Failed to import presets",
      },
      exportPreset: {
        failed: "Failed to export presets",
      },
    },
  },
  fieldsManager: {
    description: "$t(globals.fields)",
    buttons: {
      add: "Add field",
    },
    popovers: {
      fieldSettings: {
        tabs: {
          options: "Settings",
          method: "Generator",
        },
        formatButton: "Format",
        caption: "Use JSON5 to configure the generator.",
        docUrl: "Docs",
      },
    },
    alerts: {
      deleteCustomMethod: {
        description: "Are you sure you want to delete custom method \"{{ name }}\"?",
        usesCounter: "This method is currently used in $t(globals.fields, { 'count': {{ fieldsUseCount }} }) across $t(globals.presets, { 'count': {{ presetsUseCount }} }) and will be removed from all of them."
      },
    },
    form: {
      generatorSelect: {
        placeholder: "Select a generator",
        empty: "No generator found",
        addOption: "New generator",
      },
      selectorInput: {
        placeholder: ".class / #id / [data-test]",
      },
      presetNameInput: {
        placeholder: "Preset name",
      },
    },
    messages: {
      copyValue: {
        failed: "$t(globals.failedToCopy, { 'item': 'value' })",
        success: "$t(globals.copiedToClipboard)",
      },
    },
  },
  footer: {
    buttons: {
      generateData: "Generate data",
      copyAsJson: "Copy as JSON",
    },
    messages: {
      copyJson: {
        success: "$t(globals.copiedToClipboard)",
        failed: "$t(globals.failedToCopy, { 'item': 'JSON' })",
      },
    },
  },
};
