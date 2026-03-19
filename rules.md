# AI Interaction Rules

This file contains permanent rules that any AI agent working on this codebase must adhere to.

## General Principles

1. **Understand Before Modifying**: Do not re-edit or modify the codebase without recursively understanding the context and architecture first.
2. **Industry Best Practices**: All fixes, modifications, or feature implementations must adhere to industry best practices. Avoid "random fixes."
3. **Systemic Integrity**: Ensure that any edit or fix does not negatively impact the entire codebase. Changes should be localized and robust.
4. **Professionalism and Experience**: Act with the expertise of a seasoned (e.g., 20-year) software developer. Prioritize clean, maintainable, and efficient code.
5. **Error Prevention**: Proactively avoid errors. Double-check logic and side effects before applying changes.
6. **Environmental Awareness**: Before attempting fixes related to imports or environment configuration, thoroughly read and understand the project's environment (e.g., virtual environments, dependency management).

## Updates

- If the user specifies a new rule, it should be appended or updated here.
- **Rule 7: Thorough Scrutiny and Isolation**: Always read the rules before starting. When an issue is identified or a fix is proposed, navigate directly to the point of occurrence. Perform a deep scrutiny and isolation of concerns before implementing any changes. Even if no immediate or standard fix is available, always prioritize the most optimal and robust solution for the specific problem context. Don't rush or hesitate to follow through with the necessary steps for a proper fix.
- **Rule 8: Cleanup Requirement**: Always remove test scripts, diagnostic tools, and evaluation scripts (e.g., `test_*.py`, `debug_*.log`) immediately after their purpose is served.
- **Rule 9: Recursive Scanning**: After every significant evaluation or fix, perform a recursive scan of the project source directory (excluding `myenv`) to identify and remove unnecessary file instances, stale logs, or leftover artifacts to maintain a lean codebase.
- **Rule 10: Core Mission Alignment**: Every modification or feature must align with the primary objective: to ensure a seamless marketplace for vendors to display their products, and buyers to purchase them without leaving the platform
- **Rule 11: Error Confirmation**: Always proactively confirm and handle errors before claiming certainty. Never assume a fix is 100% correct without verifying imports, dependencies, and potential side effects.
- **Rule 12: Absolute Syntax Integrity**: Always verify syntax thoroughly before and after every modification. Pay extreme attention to balancing parentheses, braces, and brackets, especially in complex components like `AuthGuard.tsx` or `AuthContext.tsx`. A single syntax error can break the entire build process.
- **Rule 13: Code Completeness**: Never accidentally leave out lines of code during a modification (e.g., functional wrappers like `useEffect`, `try/catch`, or `if` statements). Every edit must maintain the full logical structure and continuity of the file.
