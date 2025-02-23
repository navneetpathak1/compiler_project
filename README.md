Compiler Design Project

Project Overview

This project is a Compiler Design implementation for Project-Based Learning (PBL) in college. It involves building a simple compiler that can tokenize, parse, and evaluate mathematical expressions.

Features

Lexical Analysis: Tokenizing source code into meaningful symbols.

Parsing: Constructing an Abstract Syntax Tree (AST) from tokens.

Evaluation: Interpreting and executing mathematical expressions.

Error Handling: Detecting unexpected tokens and division by zero errors.

Technologies Used

Deno (for runtime execution)

TypeScript (for structured development)

Project Structure

📂 project-root/
├── 📂 frontend/
│   ├── ast.ts           # Abstract Syntax Tree definitions
│   ├── lexer.ts         # Lexical analyzer (tokenizer)
│   ├── parser.ts        # Parser to build AST
├── 📂 runtime/
│   ├── evaluator.ts     # Evaluates AST nodes
│   ├── values.ts        # Runtime values and types
├── main.ts              # Entry point of the compiler
├── README.md            # Project documentation

How to Run

Install Deno from deno.land.

Clone the repository:

cd compiler-project

Run the compiler:

deno run -A main.ts

Enter expressions like:

> 10 + 5
> 20 * 3

Future Enhancements

Implement variable assignments.

Add support for more complex expressions.

Improve error reporting with better debugging messages.

Author

Navneet Pathak - College PBL Project

💡 This project is an educational initiative and serves as a foundational step toward understanding compiler design concepts.

