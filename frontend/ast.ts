// Define all possible node types in your language's AST (Abstract Syntax Tree).
export type NodeType =
	// STATEMENTS: These do not produce values but perform actions.
	| "Program"
	| "VarDeclaration"
	| "FunctionDeclaration"
	// EXPRESSIONS: These produce values when evaluated.
	| "AssignmentExpr"
	| "MemberExpr"
	| "CallExpr"
	// LITERALS: These represent raw values like numbers or objects.
	| "Property"
	| "ObjectLiteral"
	| "NumericLiteral"
	| "Identifier"
	| "BinaryExpr";

/**
 * Base interface for all statements.
 * Statements perform actions but don't directly return values.
 * Every statement has a "kind" that tells us what type of node it is.
 */
export interface Stmt {
	kind: NodeType;
}

/**
 * Program node represents the top-level structure of the code.
 * It contains a list (body) of all top-level statements.
 */
export interface Program extends Stmt {
	kind: "Program";
	body: Stmt[];
}

/**
 * Variable declaration node.
 * It represents `let` or `const` variable declarations.
 */
export interface VarDeclaration extends Stmt {
	kind: "VarDeclaration";
	constant: boolean;    // true if it's a `const`, false if it's a `let`.
	identifier: string;   // variable name.
	value?: Expr;         // optional assigned value.
}

/**
 * Function declaration node.
 * Represents the definition of a function.
 */
export interface FunctionDeclaration extends Stmt {
	kind: "FunctionDeclaration";
	parameters: string[]; // function parameter names.
	name: string;         // name of the function.
	body: Stmt[];         // function body, which is a list of statements.
}

/**
 * Base interface for all expressions.
 * Expressions evaluate to a value (unlike statements).
 * Expressions extend Stmt because they still have a "kind" field.
 */
export interface Expr extends Stmt {}

/**
 * Assignment expression node.
 * Represents assigning a value to a variable or property.
 */
export interface AssignmentExpr extends Expr {
	kind: "AssignmentExpr";
	assigne: Expr; // variable or object property being assigned.
	value: Expr;   // value being assigned.
}

/**
 * Binary expression node.
 * Represents operations with two sides, like "a + b".
 */
export interface BinaryExpr extends Expr {
	kind: "BinaryExpr";
	left: Expr;        // left-hand side expression.
	right: Expr;       // right-hand side expression.
	operator: string;  // operator (+, -, *, /, %).
}

/**
 * Call expression node.
 * Represents function calls like "print(x)".
 */
export interface CallExpr extends Expr {
	kind: "CallExpr";
	args: Expr[];    // arguments passed to the function.
	caller: Expr;    // the function being called.
}

/**
 * Member expression node.
 * Represents accessing a property, like "obj.property" or "arr[0]".
 */
export interface MemberExpr extends Expr {
	kind: "MemberExpr";
	object: Expr;    // the object being accessed.
	property: Expr;  // the property name or index being accessed.
	computed: boolean; // true for arr[0], false for obj.property.
}

// LITERAL / PRIMARY EXPRESSION TYPES
/**
 * Identifier node.
 * Represents variable names in expressions.
 */
export interface Identifier extends Expr {
	kind: "Identifier";
	symbol: string; // the actual variable name.
}

/**
 * Numeric literal node.
 * Represents number values like 42.
 */
export interface NumericLiteral extends Expr {
	kind: "NumericLiteral";
	value: number; // the actual numeric value.
}

/**
 * Property node.
 * Represents a key-value pair inside an object.
 */
export interface Property extends Expr {
	kind: "Property";
	key: string;   // property name.
	value?: Expr;  // property value, can be omitted.
}

/**
 * Object literal node.
 * Represents object literals like { x: 10, y: 20 }.
 */
export interface ObjectLiteral extends Expr {
	kind: "ObjectLiteral";
	properties: Property[]; // list of key-value pairs.
}
