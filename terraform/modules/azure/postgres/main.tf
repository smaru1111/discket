resource "azurerm_postgresql_flexible_server" "postgresql_server" {
  name                = var.qsgl_server_name
  resource_group_name = var.resource_group_name
  location            = var.location
  version                = "12"
  administrator_login    = var.admin_username
  administrator_password = var.admin_password
  zone = "2"

  storage_mb   = 32768
  backup_retention_days = 7
  geo_redundant_backup_enabled = false
  auto_grow_enabled            = true

  sku_name   = var.sku_name
}

resource "azurerm_postgresql_flexible_server_database" "postgresql_server" {
  name      = var.qsgl_database_name
  server_id = azurerm_postgresql_flexible_server.postgresql_server.id
  collation = "en_US.utf8"
  charset   = "UTF8"
  # prevent the possibility of accidental data loss
  lifecycle {
    prevent_destroy = true
  }
}

# resource "azurerm_postgresql_server" "postgresql_server" {
#   name                = var.sql_server_name
#   resource_group_name = var.resource_group_name
#   location            = var.location

#   sku_name = var.sku_name

#   storage_mb                   = 5120
#   backup_retention_days        = 7
#   geo_redundant_backup_enabled = false
#   auto_grow_enabled            = true

#   administrator_login          = var.admin_username
#   administrator_login_password = var.admin_password
#   version                      = "9.5"
#   ssl_enforcement_enabled      = true
# }

# resource "azurerm_postgresql_database" "postgresql_server" {
#   name      = var.sql_database_name
#   # depends_on = [ azurerm_postgresql_server.postgresql_server ]
#   server_name = azurerm_postgresql_server.postgresql_server.name
#   resource_group_name = var.resource_group_name
#   charset             = "UTF8"
#   collation           = "English_United States.1252"

#   # prevent the possibility of accidental data loss
#   lifecycle {
#     prevent_destroy = true
#   }
# }