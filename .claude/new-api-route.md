Create a new API route in src/app/api/.

Endpoint: $ARGUMENTS

Rules:
1. Read CLAUDE.md — sections "Code Conventions" and "Error Handling"
2. Validate input with Zod schema (define in src/schemas/ or inline)
3. Proper error handling: try/catch, HTTP status codes, JSON error responses
4. Typed request and response with TypeScript
5. Use GET or POST method as appropriate
6. Add corresponding type in src/types/ if needed
7. Response format: { success: true, data: ... } or { success: false, error: "message" }