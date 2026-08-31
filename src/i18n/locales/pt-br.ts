import { APP_NAME, APP_AUTHOR_USER } from "@/configs";

export default {
  globals: {
    appTitle: APP_NAME,
    appDescription: "Preencha formulários automaticamente com dados aleatórios",
    credits: `Made with ♥ by\u00A0<author>${APP_AUTHOR_USER}</author>`,

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
    catalog: {
      method: {
        defaultName: "novoMetodo",
      }
    },
    preset: {
      defaultName: "Novo preset"
    },
    theme: {
      dark: "Escuro",
      light: "Claro",
      system: "Sistema",
    },
    importStrategy: {
      append: {
        label: "Adicionar",
        description: "Adiciona novos presets aos existentes sem substituir os duplicados",
      },
      overwrite: {
        label: "Sobrescrever",
        description: "Sobrescreve o preset existente com o importado",
      },
      replaceAll: {
        label: "Substituir tudo",
        description: "Remove todos os presets atuais e importa os novos",
      },
      alwaysAsk: {
        label: "Perguntar sempre",
        description: "Sempre perguntar ao importar presets",
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
  preferencesManager: {
    title: "Preferencias",
    confirmButton: "Concluído",
    form: {
      themeToggle: {
        label: "Tema",
      },
      importStrategyToggle: {
        label: "Estrategia de importação",
      },
      localeSelect: {
        label: "Localização",
        placeholder: "Selecione uma localização",
        empty: "Nenhuma localização encontrada",
      },
      languageSelect: {
        label: "Língua",
        placeholder: "Seleciona uma língua",
        empty: "Nenhuma língua encontrada",
      }
    }
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
};
