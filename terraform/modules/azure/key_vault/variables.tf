variable "name" {
  description = "The name of the Key Vault."
  type        = string
}

variable "location" {
  description = "The location of the Key Vault."
  type        = string
}

variable "resource_group_name" {
  description = "The name of the resource group in which to create the Key Vault."
  type        = string
}
