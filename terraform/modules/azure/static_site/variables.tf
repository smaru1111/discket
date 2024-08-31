variable "resource_group_name" {
  description = "リソースグループの名前"
  type        = string
}

variable "static_site_name" {
  description = "Static Web Appの名前"
  type        = string
}

variable "location" {
  description = "リソースをデプロイする場所"
  type        = string
}

variable "repo_url" {
  description = "GitHubリポジトリのURL"
  type        = string
}

variable "branch" {
  description = "GitHubリポジトリのブランチ"
  type        = string
}

variable "github_token" {
  description = "GitHubのアクセストークン"
  type        = string
}

variable "app_settings" {
  description = "Static Web Appのアプリケーション設定"
  type        = map(string)
  default     = {}
}

variable "func_app_id" {
  description = "Function AppのID"
  type        = string
}