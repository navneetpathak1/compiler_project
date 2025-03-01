// Import helper functions and types for creating values (booleans, numbers, functions, etc.)
import {
	MK_BOOL,
	MK_NATIVE_FN,
	MK_NULL,
	MK_NUMBER,
	RuntimeVal,
} from "./values.ts";

// Function to create the global environment where global variables and functions live.
export function createGlobalEnv() {
	const env = new Environment();

	// Define built-in global constants: true, false, null.
	env.declareVar("true", MK_BOOL(true), true);
	env.declareVar("false", MK_BOOL(false), true);
	env.declareVar("null", MK_NULL(), true);

	// Define a native built-in `print` function, which prints values to the console.
	env.declareVar(
		"print",
		MK_NATIVE_FN((args, scope) => {
			console.log(...args);
			return MK_NULL(); // Return null after printing.
		}),
		true
	);

	// Define a native built-in `time` function, which returns the current time in milliseconds.
	function timeFunction(_args: RuntimeVal[], _env: Environment) {
		return MK_NUMBER(Date.now());
	}
	env.declareVar("time", MK_NATIVE_FN(timeFunction), true);

	return env; // Return the newly created global environment.
}

// Environment class handles variable scope and lookup.
// Each Environment can have a parent, forming a chain for nested scopes.
export default class Environment {
	private parent?: Environment; // Reference to parent scope (if any)
	private variables: Map<string, RuntimeVal>; // Stores variables in the current scope
	private constants: Set<string>; // Tracks variables declared as constants (cannot be reassigned)

	constructor(parentENV?: Environment) {
		this.parent = parentENV; // Set parent if provided (for nested scopes)
		this.variables = new Map();
		this.constants = new Set();
	}

	/**
	 * Declare a new variable in the current scope.
	 * Throws an error if the variable already exists.
	 */
	public declareVar(
		varname: string,
		value: RuntimeVal,
		constant: boolean
	): RuntimeVal {
		if (this.variables.has(varname)) {
			throw `Cannot declare variable ${varname}. It is already defined.`;
		}

		this.variables.set(varname, value);
		if (constant) {
			this.constants.add(varname); // Mark variable as constant if needed
		}
		return value;
	}

	/**
	 * Assign a value to an existing variable.
	 * Resolves the variable through the parent chain if necessary.
	 * Throws an error if trying to reassign a constant.
	 */
	public assignVar(varname: string, value: RuntimeVal): RuntimeVal {
		const env = this.resolve(varname); // Find the environment where the variable is declared

		// Check if it's a constant (constants cannot be reassigned)
		if (env.constants.has(varname)) {
			throw `Cannot reassign variable ${varname} as it was declared constant.`;
		}

		env.variables.set(varname, value);
		return value;
	}

	/**
	 * Look up a variable's value, searching the current and parent scopes.
	 * Throws an error if the variable does not exist.
	 */
	public lookupVar(varname: string): RuntimeVal {
		const env = this.resolve(varname); // Find the environment where the variable exists
		return env.variables.get(varname) as RuntimeVal;
	}

	/**
	 * Find the environment where a variable is defined.
	 * Searches parent environments if the variable is not found in the current one.
	 * Throws an error if the variable does not exist.
	 */
	public resolve(varname: string): Environment {
		if (this.variables.has(varname)) {
			return this; // Found in current environment
		}

		if (this.parent == undefined) {
			throw `Cannot resolve '${varname}' as it does not exist.`; // Variable not found anywhere
		}

		// Recursively check parent environment
		return this.parent.resolve(varname);
	}
}
