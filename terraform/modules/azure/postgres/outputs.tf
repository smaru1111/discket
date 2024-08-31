
output "psgl_server_id" {
  value = azurerm_postgresql_flexible_server.postgresql_server.id
}

output "psgl_database_id" {
  value = azurerm_postgresql_flexible_server_database.postgresql_server.id
}