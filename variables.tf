variable "prefix" {
  description = "Prefix for all resources"
  type        = string
  default     = "tf"
}

variable "tagkey_prefix" {
  description = "Prefix for tag eys"
  type        = string
  default     = "gha_"
}

variable "claims_allowlist" {
  description = "List of claims of the JWT to be available for conditions (limit 500 bytes)"
  type        = string
  default     = <<EOT
repository
run_attempt
run_id
run_number
job_workflow_ref
EOT
}

variable "permitted_github_owner" {
  description = "Allow repositories from this GitHub.com org"
  type        = string
}

variable "domain_name" {
  description = "Domain to host on"
  type        = string
  default     = ""
}

variable "domain_name_certificate_arn" {
  description = "Arn of the certificate used for the domain_name"
  type        = string
  default     = ""
}

variable "admin_token_sonarqube" {
  description = "Admin token for SonarQube"
  type        = string
  sensitive   = true
}

variable "admin_token_artifactory" {
  description = "Admin token for Artifactory"
  type        = string
  sensitive   = true
}

variable "api_url_sonarqube" {
  description = "API URL for SonarQube"
  type        = string
}

variable "api_url_artifactory" {
  description = "API URL for Artifactory"
  type        = string
}
