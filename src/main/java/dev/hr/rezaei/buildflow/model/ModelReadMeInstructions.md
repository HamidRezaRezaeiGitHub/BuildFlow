# Model Package ReadMe Generation Instructions

You are an AI agent tasked with generating and maintaining ReadMe files for model packages. Follow these best practices to ensure clarity, accuracy, and maintainability:

---

## 1. Synchronization & Accuracy

- Always ensure the ReadMe reflects the **latest state** of all classes in the package.
- Whenever a class is changed, check and update the corresponding ReadMe file.
- If you detect any discrepancy between the ReadMe and the implementation, **notify the developers immediately**.

## 2. Linking & Referencing

- Whenever you mention a class, **link its name to the source file** using Markdown syntax.

## 3. Structure

Organize the ReadMe using the following sections:

### Title

- Use a clear, descriptive title (e.g., "User Model Package Overview").

### Introduction

- Briefly describe the package's purpose and its role in the application.

### Entities

- List each entity class.
- For each entity:
  - Provide the class name (linked).
  - Give a concise description of its purpose.
  - List key fields (with types, and notes on primary keys or constraints).
  - Describe relationships to other entities (e.g., one-to-one, one-to-many).

### Enums

- List and describe any enums used for categorization or status fields.

### Repositories

- List repository interfaces for each entity.
- Briefly describe their purpose (e.g., JPA repository for persistence).

### Relationships Diagram

- Provide a simple diagram or bullet list showing how entities are related.

### Entity Lifecycle & User Stories

- Describe important lifecycle rules (e.g., required associations, creation logic).
- Include relevant user stories or business rules that affect the model.

### Formatting

- Use Markdown headings, bullet points, and links for clarity.
- Keep explanations concise and focused on the model structure.

---

## 4. Example

Refer to `UserModelReadMe.md` for a sample ReadMe that follows these instructions.
