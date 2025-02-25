
import { Stmt, Program, Expr, BinaryExpr, NumericLiteral, Identifier, NullLiteral } from "./ast.ts";

import {tokenize, Token, TokenType} from "./lexer.ts";

export default class parse {
    private tokens: Token[] = [];

    private not_eof(): boolean {
        return this.tokens[0].type !== TokenType.EOF;

    }

    private at() {
        return this.tokens[0] as Token;
    }

    private eat() {
        const prev = this.tokens.shift() as Token;
        return prev;
    }

    private expect(type: TokenType, err:any) {
        const prev = this.tokens.shift() as Token;
        if(!prev || prev.type !== type) {
            console.log("Parser Error: ", err, prev, "Expecting: ", type);
            Deno.exit(1);
        }
        return prev;
    }
    public produceAST(sourceCode: string): Program {
        this.tokens = tokenize(sourceCode);
        const program: Program = {
            kind: "Program",
            body: [],
        }

        // parse until end of file
        while(this.not_eof()) {
            program.body.push(this.parse_Stmt());
        }
        return program;
    }

    private parse_Stmt(): Stmt {
        // skip to parse_expr
        return this.parse_expr();
    }

    private parse_expr(): Expr {

        return this.parse_additive_expr();
    }

    private parse_additive_expr(): Expr {
        let left = this.parse_multiplicative_expr();

        while(this.at().value == "+" || this.at().value == "-"){
            const operator = this.eat().value;
            const right = this.parse_multiplicative_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
        }as BinaryExpr;
    }
    return left;
    }

    private parse_multiplicative_expr(): Expr {
        let left = this.parse_primary_expr();

        while(this.at().value == "/" || this.at().value == "*" || this.at().value == "%"){
            const operator = this.eat().value;
            const right = this.parse_primary_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
        }as BinaryExpr;
    }
    return left;
    }

    // ! order of precedence
    //  AdditiveExpr
    // MultiplicativeExpr
    // PrimaryExpr

    
    private parse_primary_expr(): Expr {

        const tk = this.at().type;
        switch(tk) {
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eat().value} as Identifier;
            
            case TokenType.Null:
                this.eat(); //advance past null keyword
                return { kind: "NullLiteral", value: "null"} as NullLiteral;
            
            case TokenType.Number:
                return { kind: "NumericLiteral", value: parseFloat(this.eat().value)} as NumericLiteral; 
                //only support integer for now
            
            case TokenType.OpenParen:
                this.eat(); // eat the opening parenthesis
                const value = this.parse_expr();
                this.expect(TokenType.CloseParen , 
                    "unexpected token found inside parenthesised expression. expected closing parenthesis"); // eat the closing parenthesis
                return value;

            default:
                console.log("Error: Unexpected token found during parsing: ", this.at());
                Deno.exit(1);
                 // Add this line to handle the return type
            
        }

    }    
}