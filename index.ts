import * as ts from 'typescript';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

type CreateTypeAlias = (name: string, property: Record<string, string>) => ts.TypeAliasDeclaration;

export const createTypeAlias: CreateTypeAlias = (name, property) => {
    const nodes = Object.entries(property).map((p: [string, string]) => {
        const [key, value] = p;

        const keyword = (() => {
            if (value === 'string') {
                return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
            } else if (value === 'number') {
                return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
            } else if (value === 'boolean') {
                return ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
            }
        })();

        const type = keyword ?? ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(value));

        return ts.factory.createPropertySignature(undefined, ts.factory.createIdentifier(key), undefined, type);
    });

    return ts.factory.createTypeAliasDeclaration(
        undefined,
        undefined,
        ts.factory.createIdentifier(name),
        undefined,
        ts.factory.createTypeLiteralNode(nodes),
    );
};

const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const source = ts.createSourceFile('index.ts', '', ts.ScriptTarget.Latest);

type Print = (ast: ts.TypeAliasDeclaration) => string;
export const print: Print = (ast) => {
    return printer.printNode(ts.EmitHint.Unspecified, ast, source);
};

export const createEventType = (names: string[]): string => {
    return `export type Event = (${names.join(' | ')}) & {
    label?: Record<string, string | number | boolean>;
    value?: string;
};`;
};

type TypeAlias = {
    name: string;
    property: Record<string, string>;
};

export const createType = (aliases: TypeAlias[]): string => {
    const types = aliases
        .map(({ name, property }) => createTypeAlias(name, property))
        .map(print)
        .join('\n\n');

    const names = aliases.map(({ name }) => name);
    const eventType = createEventType(names);

    return [types, eventType].join('\n\n');
};

const main = () => {
    try {
        const file = fs.readFileSync('./events.yaml', 'utf8');
        const input = yaml.load(file) as TypeAlias[];
        const output = createType(input);
        fs.writeFileSync('./types.ts', output);
    } catch (e) {
        console.error(e);
    }
};
main();
