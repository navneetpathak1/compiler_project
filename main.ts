// Import the Parser class which handles parsing the source code into an AST
import Parser from "./frontend/parser.ts";

// Import function to create the global environment (scope for variables and functions)
import { createGlobalEnv } from "./runtime/environment.ts";

// Import the evaluate function which interprets and executes the AST
import { evaluate } from "./runtime/interpreter.ts";

// Entry point - run the interpreter with a file (test.txt in this case)
run("./test.txt");

// Main function to read and execute the file
async function run(filename: string) {
	// Create a new parser instance
	const parser = new Parser();

	// Set up the global environment where variables and functions will live
	const env = createGlobalEnv();

	// Read the source code from the provided file
	const input = await Deno.readTextFile(filename);

	// Parse the source code into an Abstract Syntax Tree (AST)
	const program = parser.produceAST(input);

	// Evaluate (execute) the program using the global environment
	const result = evaluate(program, env);

	// Optional: Uncomment to see the final evaluation result (helpful for debugging)
	// console.log(result);
}
