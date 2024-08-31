variable "resource_group_name" {
  description = "The name of the resource group where the Postgresql Server will be created."
  type        = string
}

variable "location" {
  description = "The Azure region where the Postgresql Server will be created."
  type        = string
}

variable "qsgl_server_name" {
  description = "The name of the Postgresql Server."
  type        = string
}

variable "qsgl_database_name" {
  description = "The name of the Postgresql Database."
  type        = string
}

variable "admin_username" {
  description = "The administrator username for the Postgresql Server."
  type        = string
}

variable "admin_password" {
  description = "The administrator password for the Postgresql Server."
  type        = string
  sensitive   = true
}

variable "sku_name" {
  description = "The SKU name for the Postgresql Database."
  type        = string
  default     = "B_Standard_B1ms"
}
