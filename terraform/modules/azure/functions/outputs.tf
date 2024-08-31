output "function_app_name" {
  description = "Name of the Azure Function App"
  value       = azurerm_linux_function_app.func_app.name
}

output "function_app_default_hostname" {
  description = "Default hostname of the Azure Function App"
  value       = azurerm_linux_function_app.func_app.default_hostname
}

output "function_app_id" {
  description = "ID of the Azure Function App"
  value       = azurerm_linux_function_app.func_app.id
}

output "app_service_plan_id" {
  description = "ID of the App Service Plan"
  value       = azurerm_service_plan.func_app_plan.id
}

output "storage_account_name" {
  description = "Name of the storage account used by the Function App"
  value       = var.storage_account_name
}

output "storage_account_connection_string" {
  description = "Connection string of the storage account used by the Function App"
  value       = data.azurerm_storage_account.func_storage.primary_connection_string
  sensitive   = true
}

output "default_host_key" {
  description = "Default host key of the Azure Function App"
  value       = data.azurerm_function_app_host_keys.host_keys.default_function_key
}

output "default_hostname" {
  description = "Default hostname of the Azure Function App"  
  value       = azurerm_linux_function_app.func_app.default_hostname
}