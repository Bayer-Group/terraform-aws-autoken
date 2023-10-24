<div align="center">
<h1 align="center">autoken</h1>
<h3 align="center">Short-lived tokens for development platforms</br> enabling effortless integration using GitHub Actions</h3>
    
Want to set up user agnostic automation? Do you want to comply with credential rotation requirements? This takes care of all these points by validating access during a GitHub Actions run and granting a temporary token only for the active run. You never need to rotate your tokens again! 
</div>

## Usage

The GitHub Action `bayer-group/autoken` can be used within a pipeline. Depending on the platform it brokeres credentials for, it grants access based on metadata and specific configuration.

### SonarQube

You GitHub Actions pipeline could use the following steps for integrating with SonarQube:

```
  - uses: bayer-group/autoken@v1
    with:
      platform: 'sonarqube'
  - uses: sonarsource/sonarqube-scan-action@v2
```

The `bayer-group/autoken` action retrieves a temporary token for SonarQube and the scan action `sonarsource/sonarqube-scan-action` is able to use this token directly to perform and report the scan.

Autoken only grant access via a token if the according SonarQube project specifies the requesting GitHub repository as its connected repo.

## Artifactory

To integrate with Artifactory, you could use a GitHub Actions pipeline with the following steps. `ARTIFACTORY_REGISTRY` still has to be provided by the developer, as it varies based on the repository you are looking to connect to.

```
  - uses: bayer-group/autoken@v1
    with:
      platform: 'artifactory'
  - run: echo $ARTIFACTORY_TOKEN | docker login https://${ARTIFACTORY_REGISTRY} --username ${ARTIFACTORY_USER} --password-stdin
  - run: |
      docker build . --tag ${TAG}
      docker push ${TAG}
```

For every GitHub Repository, `bayer-group/autoken` maintains a transient bot user in Artifactory. Upon calling the action, autoken retrieves short-lived credentials for this transient user. Developers can grant this bot user permissions within Artifactory as they like and the credentials granted by Autoken will reflect those.

## Deployment

Autoken can be hosted via AWS, heavily relying on API Gateway and AWS Lambda.
The infrastracture is preapred using Terraform.

To deploy Autoken, take the following steps

1. Enter the missing required parameters for `variables.tf`
  * `permitted_github_owner`: which GitHub organization can this instance of Autoken be used in 
  * `domain_name` & `domain_name_certificate_arn`: domain config
  * Platform specific configuration via `admin_token_sonarqube`, `admin_token_artifactory`, `api_url_sonarqube`, & `api_url_artifactory`
2. Deploy via Terraform into your AWS account

## Architecture

See [the architecture documentation](architecture.md) for further information on how Autoken is set up.
