# 🧑‍💻 Custom Scripting Language Interpreter

This project implements a simple interpreted scripting language built with TypeScript and Deno. It includes a **parser, interpreter, and runtime environment** to run programs written in the custom language.

## 📚 Features

- ✅ Supports:
    - Variable Declarations (`let`, `const`)
    - Functions (user-defined)
    - Arithmetic Operations (`+`, `-`, `*`, `/`, `%`)
    - Object Literals
    - Function Calls
- ✅ Built-in Functions:
    - `print(...)`: Print values to console.
    - `time()`: Get current timestamp.
- ✅ Supported Data Types:
    - Numbers
    - Booleans (`true`, `false`)
    - Null (`null`)
    - Objects
    - Functions
- ✅ Lexing, Parsing, and AST Generation
- ✅ AST Interpretation with Nested Scopes and Closures
- ✅ Basic Error Handling

---

## 🏃‍♂️ How to Run

### Prerequisites
- **Deno** installed (https://deno.land)

### Running a Program
1. Place your script in `test.txt` (or any file you choose).
2. Run the interpreter:

```bash
deno run --allow-read main.ts
