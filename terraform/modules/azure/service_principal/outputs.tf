output "client_id" {
  value = azuread_application.app.client_id
}

output "service_principal_id" {
  value = azuread_service_principal.sp.id
}

output "service_principal_password" {
  value = azuread_service_principal_password.sp_password.value
}
