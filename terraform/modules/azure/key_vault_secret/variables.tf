variable "key_vault_id" {
  description = "The ID of the Key Vault."
  type        = string
}

variable "secrets" {
  description = "A map of secrets to create in the Key Vault."
  type        = map(string)
}
