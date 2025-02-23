# Compiler Design Project (PBL)

## Project Overview
This project is a **Compiler Design** implementation as part of our **Project-Based Learning (PBL)** for college. The compiler is designed to tokenize, parse, and evaluate arithmetic expressions using a custom-built interpreter.

## Features
- **Lexer:** Tokenizes the input source code.
- **Parser:** Generates an Abstract Syntax Tree (AST).
- **Evaluator:** Interprets and evaluates expressions.
- **Supports:** Basic arithmetic operations (`+`, `-`, `*`, `/`).

## Tech Stack
- **Deno** (Runtime)
- **TypeScript** (Programming Language)

## Project Structure
```
├── frontend/
│   ├── ast.ts          # Defines AST node structures
│   ├── lexer.ts        # Tokenizes input code
│   ├── parser.ts       # Parses tokens into AST
│
├── runtime/
│   ├── evaluator.ts    # Evaluates AST
│   ├── values.ts       # Defines runtime values
│
├── main.ts             # Entry point of the compiler
├── README.md           # Project documentation
```

## Installation & Running
1. Install [Deno](https://deno.land/).
2. Clone this repository:
   ```sh
   git clone https://github.com/your-repo/compiler-pbl.git
   ```
3. Navigate to the project folder:
   ```sh
   cd compiler-pbl
   ```
4. Run the compiler:
   ```sh
   deno run -A main.ts
   ```

## Example Input
```
10 + 5 * 2 - 3
```

## Output
```
17
```

## Contributors
- **Navneet Pathak**

## License
This project is for educational purposes only.
