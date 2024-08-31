variable "environment" {
  description = "The environment name."
  type        = string
}

variable "project_name" {
  description = "The project name."
  type        = string
  default      = "discket"
}

variable "location" {
  description = "Specifies the supported Azure location where the resource exists."
  type        = string
}

variable "db_admin_password" {
  description = "The password for the database administrator."
  type        = string
}

variable "repo_url" {
  description = "The URL of the GitHub repository."
  type        = string
}

variable "branch" {
  description = "The branch of the GitHub repository."
  type        = string
}

variable "github_token" {
  description = "The token for the GitHub repository."
  type        = string
}

variable "secrets" {
  description = "A map of secrets to be stored in the Key Vault."
  type        = map(string)
  default     = {}
}

variable "tenant_id" {
  description = "The tenant ID for the Azure subscription."
  type        = string
}

variable "use_front_door" {
  description = "Whether to create Front Door resources"
  type        = bool
  default     = true
}