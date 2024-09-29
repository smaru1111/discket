module "resource_group" {
  source = "../resource_group/"

  resource_group_name = "${var.project_name}_${var.environment}_rg"
  location            = var.location
  environment         = var.environment
}


module "azure_storage" {
  depends_on          = [module.resource_group]
  source              = "../storage"
  resource_group_name = module.resource_group.resource_group_name

  storage_account_name = "${var.project_name}${var.environment}sac"
  location             = module.resource_group.resource_group_location
  environment          = var.environment
  project_name         = var.project_name
}

module "key_vault" {
  depends_on          = [module.resource_group]
  source              = "../key_vault"
  name                = "${var.project_name}${var.environment}kvt"
  location            = module.resource_group.resource_group_location
  resource_group_name = module.resource_group.resource_group_name
}

module "key_vault_secret" {
  depends_on   = [module.key_vault]
  source       = "../key_vault_secret"
  secrets      = var.secrets
  key_vault_id = module.key_vault.key_vault_id
}

module "functions" {
  depends_on = [module.resource_group, module.azure_storage, module.key_vault_secret]
  source = "../functions"

  function_app_name     = "${var.project_name}-${var.environment}-functions"
  resource_group_name   = module.resource_group.resource_group_name
  location              = module.resource_group.resource_group_location
  storage_account_name  = module.azure_storage.storage_account_name
  app_service_plan_name = "${var.project_name}${var.environment}functionsasp"
  app_settings = {
    "FUNCTIONS_WORKER_RUNTIME"       = "node"
    "FUNCTIONS_EXTENSION_VERSION"    = "~4"
    "WEBSITE_NODE_DEFAULT_VERSION"   = "18"
    "DATABASE_URL"                   = module.key_vault_secret.secrets["database-url"]
    "FORM_RECOGNIZER_ENDPOINT"       = module.key_vault_secret.secrets["form-recognizer-endpoint"]
    "FORM_RECOGNIZER_KEY"            = module.key_vault_secret.secrets["form-recognizer-key"]
    "SEARCH_SERVICE_ENDPOINT"        = module.key_vault_secret.secrets["search-service-endpoint"]
    "SEARCH_SERVICE_KEY"             = module.key_vault_secret.secrets["search-service-key"]
    "SEARCH_INDEX_NAME"              = module.key_vault_secret.secrets["search-index-name"]
    "AOAI_ENDPOINT"                  = module.key_vault_secret.secrets["aoai-endpoint"]
    "AOAI_KEY"                       = module.key_vault_secret.secrets["aoai-key"]
    "AOAI_EMBEDDING_DEPLOYMENT_NAME" = module.key_vault_secret.secrets["aoai-embedding-deployment-name"]
    "AOAI_GPT_DEPLOYMENT_NAME"       = module.key_vault_secret.secrets["aoai-gpt-deployment-name"]
    "AZURE_STORAGE_CONNECTION_STRING" = module.key_vault_secret.secrets["azure-storage-connection-string"]
    "AZURE_STORAGE_ACCOUNT_NAME"     = module.key_vault_secret.secrets["azure-storage-account-name"]
    "AZURE_STORAGE_ACCOUNT_KEY"      = module.key_vault_secret.secrets["azure-storage-account-key"]
    "AZURE_AD_B2C_CLIENT_ID"         = module.key_vault_secret.secrets["azure-ad-b2c-client-id"]
    "AZURE_AD_B2C_CLIENT_SECRET"     = module.key_vault_secret.secrets["azure-ad-b2c-client-secret"]
    "AZURE_AD_B2C_TENANT_ID"         = module.key_vault_secret.secrets["azure-ad-b2c-tenant-id"]
    "AZURE_AD_B2C_TENANT_NAME"       = module.key_vault_secret.secrets["azure-ad-b2c-tenant-name"]
    "AZURE_AD_B2C_AUTHORITY"         = module.key_vault_secret.secrets["azure-ad-b2c-authority"]
    
  }
}

module "static_site" {
  depends_on          = [module.key_vault_secret, module.functions]
  source = "../static_site"

  static_site_name = "${var.project_name}-${var.environment}-static-site"
  resource_group_name = module.resource_group.resource_group_name
  location            = "eastus2"
  repo_url            = var.repo_url
  branch              = var.branch
  github_token        = var.github_token
  func_app_id = module.functions.function_app_id

  app_settings = {
    "NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_NAME" = module.key_vault_secret.secrets["azure-storage-account-name"],
    "NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID" = module.key_vault_secret.secrets["azure-ad-b2c-client-id"],
    "NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME" = module.key_vault_secret.secrets["azure-ad-b2c-tenant-name"],
    "NEXT_PUBLIC_AZURE_AD_B2C_AUTHORITY" = module.key_vault_secret.secrets["azure-ad-b2c-authority"],
    "NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_SECRET" = module.key_vault_secret.secrets["azure-ad-b2c-client-secret"],
  }
}

module "postgres" {
  depends_on          = [module.resource_group]
  source = "../postgres"

  resource_group_name = module.resource_group.resource_group_name
  location            = module.resource_group.resource_group_location

  qsgl_server_name   = "${var.project_name}sqlpsgl${var.environment}"
  qsgl_database_name = "${var.project_name}"
  admin_username    = "sqladmin"
  admin_password    = var.db_admin_password
} 

module "service_principal" {
  depends_on = [module.resource_group]
  source = "../service_principal"

  project_name = var.project_name
  environment = var.environment
  resource_group_name = module.resource_group.resource_group_name
}

resource "azurerm_key_vault_access_policy" "sp_access_policy" {
  depends_on = [module.key_vault, module.service_principal]
  key_vault_id = module.key_vault.key_vault_id

  tenant_id    = var.tenant_id
  object_id    = module.service_principal.service_principal_id

  secret_permissions = ["Get"]
}

module "b2c" {
  depends_on = [module.resource_group]
  source = "../b2c"

  resource_group_name = module.resource_group.resource_group_name
  display_name = "${var.project_name}${var.environment}b2c"
  domain_name = "${var.project_name}${var.environment}.onmicrosoft.com"
}