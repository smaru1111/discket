data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "key_vault" {
  name                        = var.name
  location                    = var.location
  resource_group_name         = var.resource_group_name
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  sku_name                    = "standard"

  soft_delete_retention_days  = 7
  purge_protection_enabled    = false
}

resource "azurerm_key_vault_access_policy" "access_policy" {
  depends_on = [azurerm_key_vault.key_vault]
  key_vault_id = azurerm_key_vault.key_vault.id

  tenant_id = data.azurerm_client_config.current.tenant_id
  # TODO: Use the object ID for group-based access policies.
  object_id = data.azurerm_client_config.current.object_id

  key_permissions = ["Get", "List", "Create", "Delete", "Recover", "Backup", "Restore", "Purge"]

  secret_permissions = ["Get", "List", "Set", "Delete", "Recover", "Backup", "Restore", "Purge"]

  certificate_permissions = ["Get"]
}
