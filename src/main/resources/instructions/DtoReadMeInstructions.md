# DTO Package ReadMe Generation Instructions

You are an AI agent tasked with generating and maintaining ReadMe files for DTO packages. Follow these best practices to ensure clarity, accuracy, and maintainability:

---

## 1. Synchronization & Accuracy

- Always ensure the ReadMe reflects the **latest state** of all DTO classes in the package.
- Whenever a DTO class is changed, check and update the corresponding ReadMe file.
- If you detect any discrepancy between the ReadMe and the implementation, **notify the developers immediately**.
- Verify that validation annotations and field mappings are accurately documented.

## 2. Linking & Referencing

- Whenever you mention a DTO class, **link its name to the source file** using Markdown syntax.
- Link to related entity classes when relevant.

## 3. Structure

Organize the ReadMe using the following sections:

### Title

- Use a clear, descriptive title (e.g., "User DTO Package Overview").

### Introduction

- Briefly describe the package's purpose and its role in the API layer.
- Explain the DTO strategy used (e.g., separate request/response DTOs, inheritance patterns).

### DTO Categories

Organize DTOs into clear categories:

#### Simple DTOs
- List DTOs that represent complete entity data (usually include ID fields).
- For each DTO:
  - Provide the class name (linked).
  - Describe its purpose.
  - List key fields (with types, validation annotations, and constraints).
  - Mention which entity it represents.
  - Note if it implements the `Dto<Entity>` interface.

#### Request DTOs
- List DTOs used for API input (usually exclude ID fields for creation).
- For each request DTO:
  - Provide the class name (linked).
  - Describe its purpose.
  - List all fields with validation rules and constraints.
  - Note any nested DTOs or complex field types.

#### Response DTOs
- List DTOs used for API output.
- For each response DTO:
  - Provide the class name (linked).
  - Describe its purpose.
  - List key fields and their data types.
  - Note any nested DTOs or wrapper structures.

### DTO Relationships Diagram

- Provide a diagram or structured list showing:
  - How DTOs relate to entities.
  - Request/Response DTO pairs.
  - Nested DTO relationships.
  - Inheritance hierarchies (if any).

### Formatting

- Use Markdown headings, bullet points, and tables for clarity.
- Include code snippets for complex validation examples.
- Use clear section dividers and consistent formatting.
- Keep explanations concise but comprehensive.

---

## 4. Example Structure

```markdown
# User DTO Package Overview

## Introduction
This package contains DTOs for user management operations...

## Simple DTOs
- [ContactDto](./ContactDto.java) - Complete contact information with ID
- [UserDto](./UserDto.java) - User data for responses

## Request DTOs  
- [ContactRequestDto](./dto/ContactRequestDto.java) - Contact creation without ID
- [CreateBuilderRequest](./dto/CreateBuilderRequest.java) - Builder user creation

## Response DTOs
- [CreateBuilderResponse](./dto/CreateBuilderResponse.java) - Builder creation result
```

---

## 5. Field Documentation

When documenting fields, include:
- Field name and type
- Validation annotations and parameters
- Business constraints and rules
- Whether the field is required or optional
