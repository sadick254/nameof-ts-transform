import * as ts from 'typescript';

function transformer(context: ts.TransformationContext) {
  return function createVisitor(sourceFile: ts.SourceFile) {
      function visitor(node: ts.Node) {
        if(ts.isCallExpression(node)) {
          const expressionText = node.expression.getText();
          if(expressionText === 'nameof' && node.typeArguments && node.typeArguments.length === 1) {
            let typeName:string;
            if (ts.isTypeReferenceNode(node.typeArguments[0])) {
                typeName = node.typeArguments[0].typeName.getText();
            } else if (ts.isArrayTypeNode(node.typeArguments[0])) {
                typeName = `${node.typeArguments[0].elementType.getText()}[]`;
            }

            if (typeName) {
                return ts.factory.createStringLiteral(typeName);
            }
          }

          if(expressionText === 'nameof' && node.arguments && node.arguments.length >= 1) {
            const propertyPath = node.arguments[0].getText().replace(/\?/g, "");
            if (node.arguments.length === 2) {
                const parts = propertyPath.split(".");
                if (parts.length > 1) {
                    parts[0] = "";
                    return ts.factory.createBinaryExpression(
                        ts.factory.createIdentifier(node.arguments[1].getText()),
                        ts.factory.createToken(ts.SyntaxKind.PlusToken),
                        ts.factory.createStringLiteral(parts.join("."))
                    );
                }
            }
            return ts.factory.createStringLiteral(propertyPath);
          }
        }

        if(ts.isImportDeclaration(node) && node.moduleSpecifier.getText().includes('nameof-ts-transform')) {
          return undefined;
        }

        return ts.visitEachChild(node, visitor, context);
      }
      return ts.visitNode(sourceFile, visitor);
  }
}

export function nameof<T>(property?: unknown, replaceParent?: string): string;
export function nameof<T>(): string {
    return 'nameof';
}

export const name: string = 'nameof-ts-transform';
export const version: string = '0.0.10';
export const factory = () => transformer;
export const before = factory

