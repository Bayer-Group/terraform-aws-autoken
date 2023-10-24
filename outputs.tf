output "endpoint_url" {
  description = "API Gateway Enpoint url"
  value       = module.api_gateway.apigatewayv2_api_api_endpoint
}

output "role_assumer_arn" {
  description = "Arn of the IAM used to assume the given role"
  value       = module.lambda.lambda_role_arn
}

output "domain_name_configuration" {
  description = "domain_name_configuration output from api gateway module"
  value       = module.api_gateway.apigatewayv2_domain_name_configuration
}
