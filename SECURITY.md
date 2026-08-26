# Security Policy

## Supported Version

The latest `main` branch and the current `1.x` release line receive security fixes. This repository is a synthetic-data product case and is not approved for healthcare production use.

## Reporting a Vulnerability

Please do not open a public issue for a suspected vulnerability. Use GitHub’s **Private vulnerability reporting** or contact the repository owner through the [`eangelica2014`](https://github.com/eangelica2014) profile. Include the affected component, reproducible steps, expected impact, and any evidence that the issue could expose data, bypass verification, invoke a forbidden tool, mutate state without confirmation, or cross the clinical-advice boundary.

You should receive an acknowledgment within five business days. A validated report will be triaged by severity, documented without exposing exploit details, and fixed with a regression test before public disclosure when feasible.

## Healthcare-Specific Boundaries

Do not submit real patient data or PHI in a report, fixture, screenshot, or trace. Use synthetic values only. The browser prototype does not implement production authentication, authorization, encryption, tenant isolation, EHR/PMS credentials, telephony, or HIPAA-compliant observability. Any deployment involving protected health information requires an appropriate legal, privacy, security, accessibility, clinical-safety, vendor, and operational review.

