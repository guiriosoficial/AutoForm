import { APP_NAME } from "@/configs";

export default {
  "app_name": APP_NAME,
  "app_description": "Preencha formulários automaticamente com dados aleatórios",

  "field": "Campo",
  "fields": "Campos",
  "fields_zero": "Nenhum campo" ,
  "fields_one": "{{ count }} Campo" ,
  "fields_other": "{{ count }} Campos",

  "button_add_field": "Adicionar Campo",

  "preset": "Preset",
  "presets": "Presets",
  "presets_zero": "Nenhum preset",
  "presets_one": "{{ count }} Preset" ,
  "presets_other": "{{ count }} Presets",

  "button_new_preset": "Novo",
  "button_import_presets": "Importar",
  "button_export_presets": "Exportar",

  "input_preset_name_placeholder": "Nome do preset",
  "select_preset_placeholder": "Selecione um preset",
  "select_preset_empty": "Nenhum preset encontrado",

  "input_field_selector_placeholder": ".classe / #id / [data-test]",
  "select_field_generator_placeholder": "Selecione um gerador",
  "select_generator_empty": "Nenhum gerador encontrado",

  "default_alert_cancel_button_text": "Cancelar",
  "default_alert_confirm_button_text": "Continuar",
  "default_alert_title": "Atenção",
  "default_alert_description": "Tem certeza que deseja continuar?",

  "dialog_import_confirm_button_text": "Importar",
  "dialog_import_cancel_button_text": "Cancelar",
  "dialog_import_title": "Importar",
  "dialog_import_description_zero": "Importando {{ total }} presets",
  "dialog_import_description_other": "{{ count }} presets duplicados de {{ total }} carregados",

  "delete_preset_alert_description": "Tem certeza que deseja excluir o preset \"{{ presetToDelete.name }}\"?",

  "button_generate_data": "Gerar dados",
  "button_copy_as_json": "Copiar JSON",

  "title_field_options": "Configurações",
  "description_field_options": "Configura o gerador usando JSON5.",
  "button_format_field_options": "Formatar",
  "link_doc_field_options": "Doc",

  "message_import_invalid_preset_error": "Preset inválido",
  "message_import_preset_error": "Erro ao importar preset",
  "message_export_preset_error": "Erro ao exportar preset",
  "message_values_generated_success": "Dados gerados com sucesso",
  "message_values_copied_success": "JSON copiado!",
  "message_values_copied_error": "Erro ao copiar JSON",
  "message_value_copied_success": "Copiado!",
  "message_value_copied_error": "Erro ao copiar",
}
