provider "azurerm" {
  features {
    cognitive_account {
      purge_soft_delete_on_destroy = false
    }
  }
}

data "azurerm_client_config" "current" {}

module "common" {
  source = "../../modules/azure/common"

  environment        = var.environment
  location           = var.location
  project_name       = var.project_name
  secrets            = var.secrets
  db_admin_password  = var.db_admin_password
  repo_url           = var.repo_url
  branch             = var.branch
  github_token       = var.github_token
  use_front_door     = var.use_front_door
  tenant_id          = data.azurerm_client_config.current.tenant_id
}


terraform {
  backend "azurerm" {
    resource_group_name   = "discket_dev_rg"
    storage_account_name  = "discketdevsac"
    container_name        = "discketdevtfstate"
    key                   = "terraform.tfstate"
  }
}