variable "function_app_name" {
  description = "Name of the Azure Function App"
  type        = string
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "location" {
  description = "Location of the Azure Function App"
  type        = string
}

variable "storage_account_name" {
  description = "Name of the storage account for Azure Functions"
  type        = string
}

variable "app_service_plan_name" {
  description = "Name of the App Service Plan for Azure Functions"
  type        = string
}

variable "package_name" {
  description = "Name of the package file for functions"
  type        = string
  default     = "function.zip"
}

variable "app_settings" {
  description = "Static Web Appのアプリケーション設定"
  type        = map(string)
  default     = {}
}