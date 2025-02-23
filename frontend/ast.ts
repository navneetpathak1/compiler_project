
export type NodeType = "Program" | "NumericLiteral" | "NullLiteral" | "Identifier" | "BinaryExpr";

// let x = if true? {45} : {55} thats not allowed in owr language 
// awr language work like c

export interface Stmt {
  kind: NodeType;
}

export interface Program extends Stmt {
    kind : "Program";
    body: Stmt[];
}

export interface Expr extends Stmt {}

export interface BinaryExpr extends Expr {
    kind: "BinaryExpr";
    left: Expr;
    right: Expr;
    operator: string; 
}

export interface Identifier extends Expr {
    kind: "Identifier";
    symbol: string;
}

export interface NumericLiteral extends Expr {
    kind: "NumericLiteral";
    value: number;
}

export interface NullLiteral extends Expr {
    kind: "NullLiteral";
    value: "null";
}

