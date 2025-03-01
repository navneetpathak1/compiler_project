import {
	AssignmentExpr,
	BinaryExpr,
	CallExpr,
	Identifier,
	ObjectLiteral,
} from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import {
	FunctionValue,
	MK_NULL,
	NativeFnValue,
	NumberVal,
	ObjectVal,
	RuntimeVal,
} from "../values.ts";

/**
 * Evaluates a numeric binary expression (e.g., 3 + 4).
 * Supports addition, subtraction, multiplication, division, and modulo.
 */
function eval_numeric_binary_expr(
	lhs: NumberVal,
	rhs: NumberVal,
	operator: string
): NumberVal {
	let result: number;

	if (operator == "+") {
		result = lhs.value + rhs.value;
	} else if (operator == "-") {
		result = lhs.value - rhs.value;
	} else if (operator == "*") {
		result = lhs.value * rhs.value;
	} else if (operator == "/") {
		// TODO: Add division by zero check.
		result = lhs.value / rhs.value;
	} else {
		result = lhs.value % rhs.value;
	}

	return { value: result, type: "number" };
}

/**
 * Evaluates any binary expression (e.g., a + b).
 * Currently only supports numeric operations.
 */
export function eval_binary_expr(
	binop: BinaryExpr,
	env: Environment
): RuntimeVal {
	const lhs = evaluate(binop.left, env);
	const rhs = evaluate(binop.right, env);

	// If both operands are numbers, use numeric evaluation.
	if (lhs.type == "number" && rhs.type == "number") {
		return eval_numeric_binary_expr(
			lhs as NumberVal,
			rhs as NumberVal,
			binop.operator
		);
	}

	// Fallback (unsupported operations return null for now).
	return MK_NULL();
}

/**
 * Evaluates an identifier by looking it up in the environment.
 */
export function eval_identifier(
	ident: Identifier,
	env: Environment
): RuntimeVal {
	const val = env.lookupVar(ident.symbol);
	return val;
}

/**
 * Evaluates an assignment expression (e.g., x = 5).
 * The left-hand side must be an identifier.
 */
export function eval_assignment(
	node: AssignmentExpr,
	env: Environment
): RuntimeVal {
	if (node.assigne.kind !== "Identifier") {
		throw `Invalid LHS inside assignment expression: ${JSON.stringify(node.assigne)}`;
	}

	const varname = (node.assigne as Identifier).symbol;
	return env.assignVar(varname, evaluate(node.value, env));
}

/**
 * Evaluates an object literal (e.g., {x: 5, y: 10}).
 * Each property is either evaluated or fetched from the environment if no value is provided.
 */
export function eval_object_expr(
	obj: ObjectLiteral,
	env: Environment
): RuntimeVal {
	const object = { type: "object", properties: new Map() } as ObjectVal;

	for (const { key, value } of obj.properties) {
		// If value is undefined, try to look up the key in the environment.
		const runtimeVal =
			value == undefined ? env.lookupVar(key) : evaluate(value, env);

		object.properties.set(key, runtimeVal);
	}

	return object;
}

/**
 * Evaluates a function call expression.
 * This handles both native functions (like `print`) and user-defined functions.
 */
export function eval_call_expr(expr: CallExpr, env: Environment): RuntimeVal {
	// Evaluate all arguments.
	const args = expr.args.map((arg) => evaluate(arg, env));

	// Evaluate the function being called.
	const fn = evaluate(expr.caller, env);

	// If it's a native function (built-in), call it directly.
	if (fn.type == "native-fn") {
		const result = (fn as NativeFnValue).call(args, env);
		return result;
	}

	// If it's a user-defined function, create a new local scope.
	if (fn.type == "function") {
		const func = fn as FunctionValue;
		const scope = new Environment(func.declarationEnv); // New scope with closure.

		// Create variables for each parameter.
		for (let i = 0; i < func.parameters.length; i++) {
			// TODO: Consider adding function arity checks (parameter count verification).
			const varname = func.parameters[i];
			scope.declareVar(varname, args[i], false); // Declare each parameter.
		}

		let result: RuntimeVal = MK_NULL();
		// Execute the function body.
		for (const stmt of func.body) {
			result = evaluate(stmt, scope);
		}

		return result;
	}

	// If the caller is not callable, throw an error.
	throw "Cannot call value that is not a function: " + JSON.stringify(fn);
}
