<div align="center">
<h1 align="center">autoken</h1>
<h3 align="center">Short-lived tokens for development platforms</br> enabling effortless integration using GitHub Actions</h3>
    
Want to set up user agnostic automation? Do you want to comply with credential rotation requirements? This takes care of all these points by validating access during a GitHub Actions run and granting a temporary token only for the active run. You never need to rotate your tokens again! 
</div>

## Deploy Terraform

Use the Terraform module to deploy Autoken to your AWS account. Provide your GitHub organization and Artifactory / SonarQube information as needed.

```
module "autoken" {
  source  = "bayer-group/autoken/aws"
  version = "1.0.0" # to current version

  permitted_github_owner = "bayer-group"

  api_url_artifactory     = "https://artifactory.your-company.com"
  admin_token_artifactory = ${var.admin_token_artifactory}
  api_url_sonarqube       = "https://sonarqube.your-company.com/api"
  admin_token_sonarqube   = ${var.admin_token_sonarqube}
}
```

See the [Terraform Module docs](docs/terraform.md).

## Usage

The GitHub Action `bayer-group/terraform-aws-autoken` can be used within a pipeline. Depending on the platform it brokeres credentials for, it grants access based on metadata and specific configuration.

### SonarQube

You GitHub Actions pipeline could use the following steps for integrating with SonarQube:

```
  - uses: bayer-group/terraform-aws-autoken@v1
    with:
      platform: 'sonarqube'
  - uses: sonarsource/sonarqube-scan-action@v2
```

The `bayer-group/autoken` action retrieves a temporary token for SonarQube and the scan action `sonarsource/sonarqube-scan-action` is able to use this token directly to perform and report the scan.

Autoken only grant access via a token if the according SonarQube project specifies the requesting GitHub repository as its connected repo.

### Artifactory

To integrate with Artifactory, you could use a GitHub Actions pipeline with the following steps. `ARTIFACTORY_REGISTRY` still has to be provided by the developer, as it varies based on the repository you are looking to connect to.

```
  - uses: bayer-group/terraform-aws-autoken@v1
    with:
      platform: 'artifactory'
  - run: echo $ARTIFACTORY_TOKEN | docker login https://${ARTIFACTORY_REGISTRY} --username ${ARTIFACTORY_USER} --password-stdin
  - run: |
      docker build . --tag ${TAG}
      docker push ${TAG}
```

For every GitHub Repository, `bayer-group/terraform-aws-autoken` maintains a transient bot user in Artifactory. Upon calling the action, autoken retrieves short-lived credentials for this transient user. Developers can grant this bot user permissions within Artifactory as they like and the credentials granted by Autoken will reflect those.

## Architecture

See [the architecture documentation](architecture.md) for further information on how Autoken is set up.

## Contributing

We are very open for community improvements of Autoken!
Take a look out our [contribution information](CONTRIBUTING.md), if you are looking to contributue to this project.
