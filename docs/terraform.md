<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 5.0.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 5.0.0 |
| <a name="provider_random"></a> [random](#provider\_random) | n/a |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_api_gateway"></a> [api\_gateway](#module\_api\_gateway) | terraform-aws-modules/apigateway-v2/aws | 2.2.2 |
| <a name="module_lambda"></a> [lambda](#module\_lambda) | terraform-aws-modules/lambda/aws | 6.4.0 |

## Resources

| Name | Type |
|------|------|
| [aws_cloudwatch_log_group.logs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_secretsmanager_secret.adminTokens](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret) | resource |
| [aws_secretsmanager_secret_version.admintokens](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret_version) | resource |
| [random_pet.this](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_admin_token_artifactory"></a> [admin\_token\_artifactory](#input\_admin\_token\_artifactory) | Admin token for Artifactory | `string` | n/a | yes |
| <a name="input_admin_token_sonarqube"></a> [admin\_token\_sonarqube](#input\_admin\_token\_sonarqube) | Admin token for SonarQube | `string` | n/a | yes |
| <a name="input_api_url_artifactory"></a> [api\_url\_artifactory](#input\_api\_url\_artifactory) | API URL for Artifactory | `string` | n/a | yes |
| <a name="input_api_url_sonarqube"></a> [api\_url\_sonarqube](#input\_api\_url\_sonarqube) | API URL for SonarQube | `string` | n/a | yes |
| <a name="input_claims_allowlist"></a> [claims\_allowlist](#input\_claims\_allowlist) | List of claims of the JWT to be available for conditions (limit 500 bytes) | `string` | `"repository\r\nrun_attempt\r\nrun_id\r\nrun_number\r\njob_workflow_ref\r\n"` | no |
| <a name="input_domain_name"></a> [domain\_name](#input\_domain\_name) | Domain to host on | `string` | `""` | no |
| <a name="input_domain_name_certificate_arn"></a> [domain\_name\_certificate\_arn](#input\_domain\_name\_certificate\_arn) | Arn of the certificate used for the domain\_name | `string` | `""` | no |
| <a name="input_permitted_github_owner"></a> [permitted\_github\_owner](#input\_permitted\_github\_owner) | Allow repositories from this GitHub.com org | `string` | n/a | yes |
| <a name="input_postfix"></a> [postfix](#input\_postfix) | Postfix for all resources | `string` | `""` | no |
| <a name="input_prefix"></a> [prefix](#input\_prefix) | Prefix for all resources | `string` | `"tf"` | no |
| <a name="input_tagkey_prefix"></a> [tagkey\_prefix](#input\_tagkey\_prefix) | Prefix for tag eys | `string` | `"gha_"` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_domain_name_configuration"></a> [domain\_name\_configuration](#output\_domain\_name\_configuration) | domain\_name\_configuration output from api gateway module |
| <a name="output_endpoint_url"></a> [endpoint\_url](#output\_endpoint\_url) | API Gateway Enpoint url |
| <a name="output_role_assumer_arn"></a> [role\_assumer\_arn](#output\_role\_assumer\_arn) | Arn of the IAM used to assume the given role |
<!-- END_TF_DOCS -->