import { APP_NAME } from "@/configs";

export default {
  globals: {
    field: "Campo",
    fields: "Campos",
    fields_zero: "Nenhum campo" ,
    fields_one: "{{ count }} Campo" ,
    fields_other: "{{ count }} Campos",

    preset: "Preset",
    presets: "Presets",
    presets_zero: "Nenhum preset",
    presets_one: "{{ count }} Preset" ,
    presets_other: "{{ count }} Presets",
    loadedPresets_zero: "Nenhum preset carregado",
    loadedPresets_one: "{{ count }} preset carregado",
    loadedPresets_other: "{{ count }} presets carregados",

    import: "Importar",
    export: "Exportar",
    confirm: "Confirmar",
    cancel: "Cancelar",
    copiedToClipboard: "Copiado para a área de transferência!",
    failedToCopy: "Falha ao copiar {{ item }}",
  },
  configs: {
    preset: {
      defaultName: "Novo preset"
    },
    theme: {
      dark: "Escuro",
      light: "Claro",
      system: "Sistema",
    },
    // TODO: Add config modal translations
    importStrategy: {
      append: {
        title: "Adicionar",
        description: "Adiciona novos presets aos existentes sem substituir os duplicados",
      },
      overwrite: {
        title: "Sobrescrever",
        description: "Sobrescreve o preset existente com o importado",
      },
      replaceAll: {
        title: "Substituir tudo",
        description: "Remove todos os presets atuais e importa os novos",
      }
    }
  },
  defaults: {
    alert: {
      title: "Atenção",
      description: "Tem certeza que deseja continuar?",
      confirmButton: "$t(globals.confirm)",
      cancelButton: "$t(globals.cancel)",
    }
  },
  header: {
    title: APP_NAME,
    description: "Preencha formulários automaticamente com dados aleatórios",
  },
  presetsManager: {
    title: "$t(globals.presets)",
    buttons: {
      import: "$t(globals.import)",
      export: "$t(globals.export)",
      new: "Novo"
    },
    alerts: {
      deletePreset: {
        description: "Tem certeza que deseja remover o preset \"{{ presetToDelete.name }}\"?"
      }
    },
    dialogs: {
      importPreset: {
        title: "$t(globals.import)",
        description_zero: "$t(globals.loadedPresets, { 'count': {{ total }} } )",
        description_one: "{{ count }} conflito entre $t(globals.loadedPresets, { 'count': {{ total }} })",
        description_other: "{{ count }} conflitos entre $t(globals.loadedPresets, { 'count': {{ total }} })",
        confirmButton: "$t(globals.import)",
        cancelButton: "$t(globals.cancel)",
        form: {
          strategyToggle: {
            label: "Estratégia",
          }
        }
      }
    },
    form: {
      presetSelect: {
        placeholder: "Selecione um preset",
        empty: "Nenhum preset encontrado"
      }
    },
    messages: {
      importPreset: {
        invalid: "JSON de presets inválido",
        failed: "Falha ao importar presets",
      },
      exportPreset: {
        failed: "Falha ao exportar presets",
      }
    }
  },
  fieldsManager:  {
    description: "$t(globals.fields)",
    buttons: {
      add: "Adicionar campo",
    },
    popovers: {
      fieldSettings: {
        title: "Configurações",
        formatButton: "Formatar",
        caption: "Use JSON5 para configurar o gerador.",
        docUrl: "Docs",
      }
    },
    form: {
      generatorSelect: {
        placeholder: "Selecione um gerador",
        empty: "Nenhum gerador encontrado"
      },
      selectorInput: {
        placeholder: ".class / #id / [data-test]",
      },
      presetNameInput: {
        placeholder: "Nome do preset",
      }
    },
    messages: {
      copyValue: {
        failed: "$t(globals.failedToCopy, { 'item': 'valor' })",
        success: "$t(globals.copiedToClipboard)",
      }
    }
  },
  footer: {
    buttons: {
      generateData: "Gerar dados",
      copyAsJson: "Copiar como JSON",
    },
    messages: {
      copyJson: {
        success: "$t(globals.copiedToClipboard)",
        failed: "$t(globals.failedToCopy, { 'item': 'JSON' })",
      },
    }
  }
}
