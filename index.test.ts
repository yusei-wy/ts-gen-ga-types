import { factory } from 'typescript';
import { createTypeAlias, createEventType, print, createType } from '.';

describe('createTypeAlias で型作成のための値から type alias を作成する', () => {
    it('型名 ConvertStart, プロパティ・値が与えられたとき, ConvertStart 型の AST を作成する', () => {
        const actual = createTypeAlias('ConvertStart', {
            action: 'convert_start',
            category: 'convert',
        });

        /**
         * type ConvertStart = {
         *     action: 'convert_start';
         *     cateogry: 'convert';
         * };
         */
        const expected = factory.createTypeAliasDeclaration(
            undefined,
            undefined,
            factory.createIdentifier('ConvertStart'),
            undefined,
            factory.createTypeLiteralNode([
                factory.createPropertySignature(
                    undefined,
                    factory.createIdentifier('action'),
                    undefined,
                    factory.createLiteralTypeNode(factory.createStringLiteral('convert_start')),
                ),
                factory.createPropertySignature(
                    undefined,
                    factory.createIdentifier('category'),
                    undefined,
                    factory.createLiteralTypeNode(factory.createStringLiteral('convert')),
                ),
            ]),
        );

        expect(actual).toStrictEqual(expected);
    });

    it('型名 ConvertEnd, プロパティ・値が与えられたとき, ConvertEnd 型の AST を作成する', () => {
        const actual = createTypeAlias('ConvertEnd', {
            action: 'convert_end',
            category: 'convert',
        });

        /**
         * type ConvertEnd = {
         *     action: 'convert_end';
         *     cateogry: 'convert';
         * };
         */
        const expected = factory.createTypeAliasDeclaration(
            undefined,
            undefined,
            factory.createIdentifier('ConvertEnd'),
            undefined,
            factory.createTypeLiteralNode([
                factory.createPropertySignature(
                    undefined,
                    factory.createIdentifier('action'),
                    undefined,
                    factory.createLiteralTypeNode(factory.createStringLiteral('convert_end')),
                ),
                factory.createPropertySignature(
                    undefined,
                    factory.createIdentifier('category'),
                    undefined,
                    factory.createLiteralTypeNode(factory.createStringLiteral('convert')),
                ),
            ]),
        );

        expect(actual).toStrictEqual(expected);
    });
});

describe('print で AST を文字列に変換する', () => {
    it('ConvertStart の AST を与えたとき ConvertStart 型を出力する', () => {
        const arg = factory.createTypeAliasDeclaration(
            undefined,
            undefined,
            factory.createIdentifier('ConvertStart'),
            undefined,
            factory.createTypeLiteralNode([
                factory.createPropertySignature(
                    undefined,
                    factory.createIdentifier('action'),
                    undefined,
                    factory.createLiteralTypeNode(factory.createStringLiteral('convert_start')),
                ),
                factory.createPropertySignature(
                    undefined,
                    factory.createIdentifier('category'),
                    undefined,
                    factory.createLiteralTypeNode(factory.createStringLiteral('convert')),
                ),
            ]),
        );
        const actual = print(arg);
        const expected = `type ConvertStart = {
    action: "convert_start";
    category: "convert";
};`;

        expect(actual).toBe(expected);
    });
});

describe('createEventType', () => {
    it('ConvertStart と ConvertEnd を受け取ったとき, その２つを Event 型を生成する', () => {
        const arg = ['ConvertStart', 'ConvertEnd'];
        const actual = createEventType(arg);
        const expected = `export type Event = (ConvertStart | ConvertEnd) & {
            label?: Record<string, string | number | boolean>;
            value?: string;
        };`;
    });
});

describe('createType', () => {
    it('型名と property を与えたとき, 引数の方との交差型 Event 型を生成する', () => {
        const arg = [
            {
                name: 'ConvertStart',
                property: {
                    action: 'convert_start',
                    category: 'convert',
                },
            },
            {
                name: 'ConvertEnd',
                property: {
                    action: 'convert_end',
                    category: 'convert',
                },
            },
        ];
        const actual = createType(arg);
        const expected = `type ConvertStart = {
    action: "convert_start";
    category: "convert";
};

type ConvertEnd = {
    action: "convert_end";
    category: "convert";
};

export type Event = (ConvertStart | ConvertEnd) & {
    label?: Record<string, string | number | boolean>;
    value?: string;
};`;

        expect(actual).toBe(expected);
    });
});
