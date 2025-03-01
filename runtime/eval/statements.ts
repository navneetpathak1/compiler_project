import {
	FunctionDeclaration,
	Program,
	VarDeclaration,
} from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { FunctionValue, MK_NULL, RuntimeVal } from "../values.ts";

/**
 * Evaluate a complete program.
 * Iterates through all statements in the program and evaluates them one by one.
 * The value of the last evaluated statement is returned.
 */
export function eval_program(program: Program, env: Environment): RuntimeVal {
	let lastEvaluated: RuntimeVal = MK_NULL(); // Default to null if program is empty
	for (const statement of program.body) {
		lastEvaluated = evaluate(statement, env); // Evaluate each statement
	}
	return lastEvaluated; // Return the result of the last statement
}

/**
 * Handle variable declaration (let or const).
 * Evaluates the assigned value (if present), otherwise defaults to null.
 * Then, declares the variable in the environment.
 */
export function eval_var_declaration(
	declaration: VarDeclaration,
	env: Environment
): RuntimeVal {
	const value = declaration.value
		? evaluate(declaration.value, env) // Evaluate initializer if present
		: MK_NULL(); // Default to null if no initializer

	// Declare the variable in the environment
	return env.declareVar(declaration.identifier, value, declaration.constant);
}

/**
 * Handle function declaration.
 * Creates a `FunctionValue` object representing the function.
 * Stores parameters, body, and the environment where the function is declared.
 * Declares the function as a constant in the environment (cannot be reassigned).
 */
export function eval_function_declaration(
	declaration: FunctionDeclaration,
	env: Environment
): RuntimeVal {
	// Create a function object capturing its declaration environment, parameters, and body.
	const fn = {
		type: "function",
		name: declaration.name,
		parameters: declaration.parameters,
		declarationEnv: env, // Store the environment the function was declared in
		body: declaration.body, // Function body (list of statements)
	} as FunctionValue;

	// Declare the function in the current environment, marked as constant.
	return env.declareVar(declaration.name, fn, true);
}
