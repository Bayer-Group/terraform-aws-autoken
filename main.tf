module "lambda" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "6.0.1"

  function_name = "${var.prefix}-autoken"
  runtime       = "nodejs18.x"
  handler       = "lambda.handler"
  source_path   = [
    "${path.module}/dist/lambda.js",
    "${path.module}/dist/lambda.js.map"
  ]

  publish = true

  environment_variables = {
    TAG_KEY_PREFIX         = "${var.tagkey_prefix}"
    CLAIMS_ALLOW_LIST      = "${var.claims_allowlist}"
    PERMITTED_GITHUB_OWNER = "${var.permitted_github_owner}"
    API_URL_ARTIFACTORY    = "${var.api_url_artifactory}"
    API_URL_SONARQUBE      = "${var.api_url_sonarqube}"
  }

  attach_policy_statements = true
  policy_statements = {
    secretsmanager = {
      effect    = "Allow",
      actions   = ["secretsmanager:GetSecretValue"],
      resources = [aws_secretsmanager_secret_version.admintokens.arn]
    }
  }

  allowed_triggers = {
    APIGatewayAny = {
      service    = "apigateway"
      source_arn = "${module.api_gateway.apigatewayv2_api_execution_arn}/*/*"
    }
  }
}

module "api_gateway" {
  source  = "terraform-aws-modules/apigateway-v2/aws"
  version = "2.2.2"

  name          = "${var.prefix}-autoken"
  protocol_type = "HTTP"

  create_api_domain_name      = var.domain_name != ""
  domain_name                 = var.domain_name
  domain_name_certificate_arn = var.domain_name_certificate_arn


  default_stage_access_log_destination_arn = aws_cloudwatch_log_group.logs.arn
  default_stage_access_log_format = replace(<<EOT
  { 
    "requestId":"$context.requestId", 
    "ip": "$context.identity.sourceIp", 
    "requestTime":"$context.requestTime", 
    "httpMethod":"$context.httpMethod",
    "routeKey":"$context.routeKey", 
    "status":"$context.status",
    "protocol":"$context.protocol", 
    "responseLength":"$context.responseLength", 
    "error":"$context.authorizer.error", 
    "aud":"$context.authorizer.claims.aud", 
    "sub":"$context.authorizer.claims.sub", 
    "job_workflow_ref":"$context.authorizer.claims.job_workflow_ref" 
}
EOT
  , "\n", " ")

  default_route_settings = {
    detailed_metrics_enabled = true
    throttling_burst_limit   = 100
    throttling_rate_limit    = 100
  }

  cors_configuration = {
    allow_headers = ["content-type", "x-amz-date", "authorization", "x-api-key", "x-amz-security-token", "x-amz-user-agent"]
    allow_methods = ["*"]
    allow_origins = ["*"]
  }

  integrations = {
    "$default" = {
      lambda_arn             = module.lambda.lambda_function_arn
      payload_format_version = "2.0"
      authorization_type     = "JWT"
      authorizer_id          = aws_apigatewayv2_authorizer.authorizer.id
    }
  }
}

resource "aws_apigatewayv2_authorizer" "authorizer" {
  api_id           = module.api_gateway.apigatewayv2_api_id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "${var.prefix}-autoken"

  jwt_configuration {
    audience = ["https://github.com/${var.permitted_github_owner}"]
    issuer   = "https://token.actions.githubusercontent.com"
  }
}

resource "aws_cloudwatch_log_group" "logs" {
  name = "${var.prefix}-autoken"
}

resource "aws_secretsmanager_secret" "adminTokens" {
  name = "autoken-admintokens"
}
resource "aws_secretsmanager_secret_version" "admintokens" {
  secret_id     = aws_secretsmanager_secret.adminTokens.id
  secret_string = jsonencode({
    sonarqube:   var.admin_token_sonarqube,
    artifactory: var.admin_token_artifactory
  })
}
