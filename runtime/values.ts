import Environment from "./environment.ts"; // Import the Environment class for scope management.
import { Stmt } from "../frontend/ast.ts"; // Import Stmt type from AST to define function bodies.

// List of possible runtime value types supported by the interpreter.
export type ValueType =
	| "null"
	| "number"
	| "boolean"
	| "object"
	| "native-fn"
	| "function";

// Base interface for all runtime values.
export interface RuntimeVal {
	type: ValueType; // Each runtime value has a type.
}

/**
 * Defines a "null" value in the language.
 */
export interface NullVal extends RuntimeVal {
	type: "null";
	value: null;
}

// Factory function to easily create a "null" value.
export function MK_NULL() {
	return { type: "null", value: null } as NullVal;
}

/**
 * Defines a boolean value (true/false).
 */
export interface BooleanVal extends RuntimeVal {
	type: "boolean";
	value: boolean;
}

// Factory function to create a boolean value.
export function MK_BOOL(b = true) {
	return { type: "boolean", value: b } as BooleanVal;
}

/**
 * Defines a numeric value (number type).
 */
export interface NumberVal extends RuntimeVal {
	type: "number";
	value: number;
}

// Factory function to create a numeric value.
export function MK_NUMBER(n = 0) {
	return { type: "number", value: n } as NumberVal;
}

/**
 * Defines an object value, which has properties stored in a Map.
 */
export interface ObjectVal extends RuntimeVal {
	type: "object";
	properties: Map<string, RuntimeVal>; // Each property maps a string key to a runtime value.
}

/**
 * Defines the type for native (built-in) functions.
 * These functions are implemented directly in JavaScript, not in the interpreted language.
 */
export type FunctionCall = (args: RuntimeVal[], env: Environment) => RuntimeVal;

/**
 * Defines a native function value.
 */
export interface NativeFnValue extends RuntimeVal {
	type: "native-fn";
	call: FunctionCall; // Native functions can be directly invoked.
}

// Factory function to create a native function.
export function MK_NATIVE_FN(call: FunctionCall) {
	return { type: "native-fn", call } as NativeFnValue;
}

/**
 * Defines a user-defined function.
 * These functions are defined within the interpreted language itself.
 */
export interface FunctionValue extends RuntimeVal {
	type: "function";
	name: string; // Name of the function.
	parameters: string[]; // List of parameter names.
	declarationEnv: Environment; // The environment in which the function was declared (for closures).
	body: Stmt[]; // The body of the function (the actual code/statements).
}
