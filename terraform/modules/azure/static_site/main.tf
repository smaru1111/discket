resource "azurerm_static_web_app" "nextjs_app" {
  name                = var.static_site_name
  resource_group_name = var.resource_group_name
  location            = var.location
  app_settings = var.app_settings
  
  sku_tier = "Standard"
  sku_size = "Standard"
}

# Static Web AppとFunction Appの接続を追加
resource "azurerm_static_web_app_function_app_registration" "example" {
  static_web_app_id = azurerm_static_web_app.nextjs_app.id
  function_app_id   = var.func_app_id
}