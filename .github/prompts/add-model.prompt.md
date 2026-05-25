---
description: This prompt is used to add a new model to the system.
argument-hint: Name of the model to create, e.g. 'User'
agent: agent
tools: [read, edit, search]
inputs:
  - id: modelName
    type: promptString
    description: "Name of the model to create (PascalCase, e.g. 'LinkItem')"
  - id: modelFields
    type: promptString
    description: "Comma-separated list of fields with types (e.g. 'id: string, title: string, url: string, createdAt: Date')"
---

Create a new Angular model named **${input:modelName}** with the following fields: `${input:modelFields}`.

## Steps  
1. Search the codebase to ensure there is no existing model named `${input:modelName}`.
2. Create a new file at `src/app/models/${input:modelName | kebabCase}.model.ts`.
3. Define a TypeScript interface named `${input:modelName}` with the fields: `${input:modelFields}`.
4. Export the interface as a named export.
5. Update any relevant references or barrel exports if they exist in the models directory.

## Conventions
- Models are defined as TypeScript interfaces — no classes, no `any`.
- Model files are located in `src/app/models/` and named in kebab-case (e.g. `user.model.ts`).
- Each model interface should be a named export.

## Output
Report the name of the created model and the file path where it was added.
