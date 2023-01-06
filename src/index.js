const ts = require('typescript');

function transformer(context) {
  return function (sourceFile) {
      function visitor(node) {
        if(ts.isCallExpression(node)) {
          const expressionText = node.expression.getText();
          if(expressionText === 'nameof' && node.typeArguments && node.typeArguments.length === 1) {
            let typeName;
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

function nameof() {
  return 'nameof'
}

const name = 'nameof-ts-transform';
const version = '0.0.10';

module.exports = {
  factory: () => transformer,
  before: () => transformer,
  nameof,
  name,
  version
}
