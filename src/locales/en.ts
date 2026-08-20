import { APP_NAME } from "@/configs";

export default {
  "app_name": APP_NAME,
  "app_description": "Fill forms automatically with random data",

  "field": "Field",
  "fields": "Fields",
  "fields_zero": "No fields" ,
  "fields_one": "{{ count }} Field" ,
  "fields_other": "{{ count }} Fields",

  "button_add_field": "Add Field",

  "preset": "Preset",
  "presets": "Presets",
  "presets_zero": "No presets",
  "presets_one": "{{ count }} Preset" ,
  "presets_other": "{{ count }} Presets",

  "button_new_preset": "New",
  "button_import_presets": "Import",
  "button_export_presets": "Export",

  "input_preset_name_placeholder": "Preset name",
  "select_preset_placeholder": "Select a preset",
  "select_preset_empty": "No presets found",


  "input_field_selector_placeholder": ".classe / #id / [data-test]",
  "select_field_generator_placeholder": "Select a generator",
  "select_generator_empty": "No generators found",

  "default_alert_cancel_button_text": "Cancel",
  "default_alert_confirm_button_text": "Confirm",
  "default_alert_title": "Warning",
  "default_alert_description": "Are you sure you want to continue?",

  "dialog_import_confirm_button_text": "Import",
  "dialog_import_cancel_button_text": "Cancel",
  "dialog_import_title": "Import",
  "dialog_import_description_zero": "{{ total }} to import",
  "dialog_import_description_other": "{{ count }} duplicated presets of {{ total }} to import",

  "delete_preset_alert_description": "Are you sure you want to delete preset \"{{ presetToDelete.name }}\"?",

  "button_generate_data": "Generate Data",
  "button_copy_as_json": "Copy as JSON",

  "title_field_options": "Options",
  "description_field_options": "Use JSON5 to configure the generator.",
  "button_format_field_options": "Format",
  "link_doc_field_options": "Doc",

  "message_import_invalid_preset_error": "Invalid presets",
  "message_import_preset_error": "Error importing preset",
  "message_export_preset_error": "Error exporting preset",
  "message_values_generated_success": "Data generated successfully",
  "message_values_copied_success": "JSON copied!",
  "message_values_copied_error": "Error coping values",
  "message_value_copied_success": "Copied!",
  "message_value_copied_error": "Error coping value",
}
