resource "azurerm_application_insights" "app_insights" {
  name                = "${var.function_app_name}-insights"
  location            = var.location
  resource_group_name = var.resource_group_name
  application_type    = "web"
}

resource "azurerm_service_plan" "func_app_plan" {
  name                = var.app_service_plan_name
  location            = var.location
  resource_group_name = var.resource_group_name
  os_type             = "Linux"
  sku_name            = "Y1"
}

resource "azurerm_linux_function_app" "func_app" {
  name                = "${var.function_app_name}-sb"
  location            = var.location
  resource_group_name = var.resource_group_name
  service_plan_id = azurerm_service_plan.func_app_plan.id
  storage_account_name       = var.storage_account_name
  storage_account_access_key = data.azurerm_storage_account.func_storage.primary_access_key
  app_settings = var.app_settings
  site_config {
    application_stack {
      node_version = "18"
    }
    application_insights_connection_string = azurerm_application_insights.app_insights.connection_string
    application_insights_key               = azurerm_application_insights.app_insights.instrumentation_key
  }
}

data "azurerm_function_app_host_keys" "host_keys" {
  name                = azurerm_linux_function_app.func_app.name
  resource_group_name = var.resource_group_name
}

data "azurerm_storage_account" "func_storage" {
  name                = var.storage_account_name
  resource_group_name = var.resource_group_name
}

resource "azurerm_storage_container" "deploy_packages" {
  name                  = "deploy-packages"
  storage_account_name  = var.storage_account_name
  container_access_type = "private"
}
