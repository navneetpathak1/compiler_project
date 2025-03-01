// Import the types for runtime values, specifically NumberVal and RuntimeVal
import { NumberVal, RuntimeVal } from "./values.ts";

// Import all AST node types that this evaluator will handle.
import {
	AssignmentExpr,
	BinaryExpr,
	CallExpr,
	FunctionDeclaration,
	Identifier,
	NumericLiteral,
	ObjectLiteral,
	Program,
	Stmt,
	VarDeclaration,
} from "../frontend/ast.ts";

// Import the Environment class to handle variable scopes.
import Environment from "./environment.ts";

// Import individual evaluation functions for different statements.
import {
	eval_function_declaration,
	eval_program,
	eval_var_declaration,
} from "./eval/statements.ts";

// Import individual evaluation functions for different expressions.
import {
	eval_assignment,
	eval_binary_expr,
	eval_call_expr,
	eval_identifier,
	eval_object_expr,
} from "./eval/expressions.ts";

// The main evaluate function which acts as the interpreter's entry point for evaluating AST nodes.
export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
	switch (astNode.kind) {
		// Handle numeric literals (e.g., 5, 3.14)
		case "NumericLiteral":
			return {
				value: (astNode as NumericLiteral).value,
				type: "number",
			} as NumberVal;

		// Handle identifiers (variable names) by looking them up in the environment.
		case "Identifier":
			return eval_identifier(astNode as Identifier, env);

		// Handle object literals (key-value pairs).
		case "ObjectLiteral":
			return eval_object_expr(astNode as ObjectLiteral, env);

		// Handle function calls (e.g., foo(2, 3)).
		case "CallExpr":
			return eval_call_expr(astNode as CallExpr, env);

		// Handle assignment expressions (e.g., x = 5).
		case "AssignmentExpr":
			return eval_assignment(astNode as AssignmentExpr, env);

		// Handle binary expressions (e.g., 5 + 3).
		case "BinaryExpr":
			return eval_binary_expr(astNode as BinaryExpr, env);

		// Handle program nodes, which contain a list of top-level statements.
		case "Program":
			return eval_program(astNode as Program, env);

		// Handle variable declarations (e.g., let x = 5).
		case "VarDeclaration":
			return eval_var_declaration(astNode as VarDeclaration, env);

		// Handle function declarations (e.g., function foo() {...}).
		case "FunctionDeclaration":
			return eval_function_declaration(astNode as FunctionDeclaration, env);

		// Catch all for unimplemented AST node types.
		default:
			console.error(
				"This AST Node has not yet been setup for interpretation.\n",
				astNode
			);
			Deno.exit(0); // Exit the process with an error if an unsupported node type is encountered.
	}
}
