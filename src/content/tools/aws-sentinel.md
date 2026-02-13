---
name: "aws-sentinel"
tagline: "AWS Sentinel is a powerful command-line security scanner for AWS resources."
author: "Rishab Kumar"
author_github: "rishabkumar7"
github_url: "https://github.com/rishabkumar7/aws-sentinel"
website_url: "https://pypi.org/project/aws-sentinel/"
tags: ["cli", "cloud", "security", "aws"]
language: "Python"
license: "MIT"
date_added: "2026-02-13"
featured: false
---

AWS Sentinel is a powerful command-line security scanner for AWS resources. It helps identify common security issues and misconfigurations in your AWS environment. Now featuring natural language queries powered by Amazon Bedrock!

AWS Sentinel currently checks for the following security issues:

- S3 Buckets: Identifies publicly accessible buckets
- EC2 Security Groups: Finds security groups with port 22 (SSH) open to the public
- EBS Volumes: Detects unencrypted volumes
- IAM Users: Identifies users without Multi-Factor Authentication (MFA)