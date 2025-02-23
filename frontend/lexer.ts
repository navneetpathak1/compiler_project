


export enum TokenType {
    Null,
    Number,
    Identifier,
    Equals,
    OpenParen,
    CloseParen,
    BinaryOperator,
    Let,
    EOF, // end of file token
}

const KEYWORDS: Record<string , TokenType> = {
    let: TokenType.Let,
    null: TokenType.Null,
}

export interface Token {
    value: string;
    type: TokenType;
}

function token(value = "", type: TokenType) : Token {
    return {value, type};
}

function isalpha(src: string) {
    return src.toUpperCase() != src.toLocaleLowerCase();
}

function isSkippable(src: string) {
    return src == ' ' || src == '\n' || src == '\t';
}

function isint(src: string) {
    const c = src.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
    return (c >= bounds[0] && c <= bounds[1]);
}

export function tokenize( sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    const src = sourceCode.split(""); //split into every single character

    // build each token until end of file
    while(src.length > 0) {

        if(src[0] == '(') {
            tokens.push(token(src.shift(), TokenType.OpenParen));
        } else if(src[0] == ")") {
            tokens.push(token(src.shift(), TokenType.CloseParen));
        } else if(src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/" || src[0] == "%") {
            tokens.push(token(src.shift(), TokenType.BinaryOperator));
        } else if(src[0] == "=" ) {
            tokens.push(token(src.shift(), TokenType.Equals));
        } else {
            // handle multicharacter token
            //  build number token
            if(isint(src[0])) {
                let num = "";
                while(src.length > 0 && isint(src[0])) {
                    num += src.shift(); // shift remove the first character of array
                }
                tokens.push(token( num , TokenType.Number));
            } else if(isalpha(src[0])) {
                let ident = ""; // userDefine or keywords
                while(src.length > 0 && isalpha(src[0])) {
                    ident += src.shift(); // shift remove the first character of array
                }
                // check for reserved keywords

                const reserved = KEYWORDS[ident];
                if(typeof reserved == "number") {
                    tokens.push(token( ident , reserved));
                } else {
                    tokens.push(token( ident , TokenType.Identifier));
                }
            } else if(isSkippable(src[0])) {
                src.shift(); // can be skip
            } else {
                console.log("unreconized character found in source: ", src[0]);
                Deno.exit(1);
            
            }
        }
 
    }
    tokens.push({type: TokenType.EOF, value: "EndOfFile"});
    return tokens;
}

// const source = await Deno.readTextFile("./test.txt");

// for(const token of tokenize(source)) {
//     console.log(token);
// }
