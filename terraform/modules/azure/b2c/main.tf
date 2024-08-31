resource "azurerm_aadb2c_directory" "example" {
  country_code            = "JP"
  data_residency_location = "Asia Pacific"
  display_name            = var.display_name
  domain_name             = var.domain_name
  resource_group_name     = var.resource_group_name
  sku_name                = "PremiumP1"
}