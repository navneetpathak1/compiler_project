// Define all possible token types that can appear in the source code.
export enum TokenType {
	// Literals (actual values)
	Number,          // Example: 123
	Identifier,      // Example: variable names like x, y, etc.
	// Keywords (reserved words)
	Let,             // 'let' keyword
	Const,           // 'const' keyword
	Fn,              // 'fn' keyword (for defining functions)

	// Symbols and operators
	BinaryOperator,  // +, -, *, /, %
	Equals,          // =
	Comma,           // ,
	Dot,             // .
	Colon,           // :
	Semicolon,       // ;
	OpenParen,       // (
	CloseParen,      // )
	OpenBrace,       // {
	CloseBrace,      // }
	OpenBracket,     // [
	CloseBracket,    // ]
	EOF,             // Special token marking the end of the file
}

/**
 * This is a lookup table for reserved keywords.
 * When the lexer encounters one of these words, it knows to create a keyword token.
 */
const KEYWORDS: Record<string, TokenType> = {
	let: TokenType.Let,
	const: TokenType.Const,
	fn: TokenType.Fn,
};

// Represents a single token produced by the lexer.
export interface Token {
	value: string;   // The actual text from the source code.
	type: TokenType; // The type of token it represents (e.g., Number, Identifier, etc.)
}

// Helper function to create a token.
function token(value = "", type: TokenType): Token {
	return { value, type };
}

/**
 * Checks if a character is an alphabetic letter (A-Z or a-z).
 */
function isalpha(src: string) {
	return src.toUpperCase() != src.toLowerCase();
}

/**
 * Checks if a character is a type of whitespace (space, tab, newline, etc.).
 */
function isskippable(str: string) {
	return str == " " || str == "\n" || str == "\t" || str == "\r";
}

/**
 * Checks if a character is a numeric digit (0-9).
 */
function isint(str: string) {
	const c = str.charCodeAt(0);
	const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
	return c >= bounds[0] && c <= bounds[1];
}

/**
 * Main function that takes source code and converts it into a list of tokens.
 * 
 * - Reads characters from `sourceCode`.
 * - Matches characters into tokens like numbers, keywords, operators, etc.
 * - Returns a list of tokens.
 */
export function tokenize(sourceCode: string): Token[] {
	const tokens = new Array<Token>();
	const src = sourceCode.split(""); // Convert source string into array of characters.

	// Continue processing until all characters are consumed.
	while (src.length > 0) {
		// Process one-character tokens like parentheses and braces.
		if (src[0] == "(") {
			tokens.push(token(src.shift(), TokenType.OpenParen));
		} else if (src[0] == ")") {
			tokens.push(token(src.shift(), TokenType.CloseParen));
		} else if (src[0] == "{") {
			tokens.push(token(src.shift(), TokenType.OpenBrace));
		} else if (src[0] == "}") {
			tokens.push(token(src.shift(), TokenType.CloseBrace));
		} else if (src[0] == "[") {
			tokens.push(token(src.shift(), TokenType.OpenBracket));
		} else if (src[0] == "]") {
			tokens.push(token(src.shift(), TokenType.CloseBracket));
		} 
		// Process operators like +, -, *, /, %
		else if (
			src[0] == "+" ||
			src[0] == "-" ||
			src[0] == "*" ||
			src[0] == "/" ||
			src[0] == "%"
		) {
			tokens.push(token(src.shift(), TokenType.BinaryOperator));
		} 
		// Process assignment and punctuation symbols.
		else if (src[0] == "=") {
			tokens.push(token(src.shift(), TokenType.Equals));
		} else if (src[0] == ";") {
			tokens.push(token(src.shift(), TokenType.Semicolon));
		} else if (src[0] == ":") {
			tokens.push(token(src.shift(), TokenType.Colon));
		} else if (src[0] == ",") {
			tokens.push(token(src.shift(), TokenType.Comma));
		} else if (src[0] == ".") {
			tokens.push(token(src.shift(), TokenType.Dot));
		} 
		// Process multi-character tokens like numbers and identifiers/keywords.
		else {
			// Process numeric literals (like 123).
			if (isint(src[0])) {
				let num = "";
				while (src.length > 0 && isint(src[0])) {
					num += src.shift();
				}
				tokens.push(token(num, TokenType.Number));
			} 
			// Process identifiers (like variable names) and check for keywords.
			else if (isalpha(src[0])) {
				let ident = "";
				while (src.length > 0 && isalpha(src[0])) {
					ident += src.shift();
				}

				// Check if the identifier is a reserved keyword.
				const reserved = KEYWORDS[ident];
				if (typeof reserved == "number") {
					// It's a keyword (like `let` or `fn`)
					tokens.push(token(ident, reserved));
				} else {
					// Otherwise it's a regular identifier (like variable names).
					tokens.push(token(ident, TokenType.Identifier));
				}
			} 
			// Skip whitespace.
			else if (isskippable(src[0])) {
				src.shift(); // Just discard it.
			} 
			// Handle any unexpected characters (error case).
			else {
				console.error(
					"Unrecognized character found in source: ",
					src[0].charCodeAt(0),
					src[0]
				);
				Deno.exit(1); // Exit with error code.
			}
		}
	}

	// Finally, append the end-of-file token.
	tokens.push({ type: TokenType.EOF, value: "EndOfFile" });
	return tokens;
}
