data "azurerm_client_config" "current" {}

resource "azuread_application" "app" {
  display_name = "${var.project_name}-${var.environment}-app"
}

resource "azuread_service_principal" "sp" {
  depends_on = [azuread_application.app]
  client_id = azuread_application.app.client_id
}

resource "azuread_service_principal_password" "sp_password" {
  depends_on = [azuread_service_principal.sp]
  service_principal_id = azuread_service_principal.sp.id
  end_date             = "2025-01-01T01:02:03Z"
}

resource "azurerm_role_assignment" "sp_contributor" {
  depends_on = [azuread_service_principal.sp]
  scope                = "/subscriptions/${data.azurerm_client_config.current.subscription_id}/resourceGroups/${var.resource_group_name}"
  role_definition_name = "Contributor"
  principal_id         = azuread_service_principal.sp.id
}
