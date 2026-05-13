---
description: "Use when creating or editing files under test-data. Keeps test fixtures organized by endpoint."
applyTo: "test-data/**/*"
---
# Test Data Layout Conventions

- Organize test data by endpoint first.
- Keep all `/users`-specific data under `test-data/users/`, including payloads, search/filter fixtures, contract fixtures, and schemas.
- Prefer endpoint-local files over top-level behavior folders when the data belongs to one endpoint.
- Reuse canonical endpoint data files instead of duplicating user records across multiple files.
- When the same canonical record repeats within an endpoint fixture file, extract a shared base fixture and compose variants from it instead of repeating inline literals.