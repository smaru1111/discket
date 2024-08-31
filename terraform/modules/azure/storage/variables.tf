variable "resource_group_name" {
  description = "The name of the resource group in which to create the storage account."
  type        = string
}

variable "storage_account_name" {
  description = "Specifies the name of the storage account. Must be unique across all storage accounts in Azure."
  type        = string
}

variable "location" {
  description = "Specifies the supported Azure location where the resource exists."
  type        = string
}

variable "environment" {
  description = "The environment in which the resources are created."
  type        = string
}

variable "project_name" {
  description = "The name of the project."
  type        = string
}

