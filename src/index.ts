import ts from 'typescript'


export const before = (options?: any, program?: ts.Program) => {
    return (context: ts.TransformationContext) => {
        return (sourceFile: ts.SourceFile) => {

            const visitor = (node: ts.Node): ts.Node => {

                if(ts.isCallExpression(node)) {
                    let expressionText: string = '';

                    try {
                        expressionText = node.expression.getText();
                    } catch {}

                    if (expressionText === 'nameof' && node.typeArguments && node.typeArguments.length === 1) {
                        let typeName: string = '';
                        if (ts.isTypeReferenceNode(node.typeArguments[0])) {
                            typeName = node.typeArguments[0].typeName.getText();
                        } else if (ts.isArrayTypeNode(node.typeArguments[0])) {
                            typeName = `${node.typeArguments[0].elementType.getText()}[]`
                        }

                        if (!!typeName) {
                            return ts.factory.createStringLiteral(typeName);
                        }
                    }

                } else if (ts.isImportDeclaration(node) && node.moduleSpecifier.getText().includes('nameof-ts-transform')) {
                    return undefined as unknown as ts.Node;
                }

                return ts.visitEachChild(node, visitor, context);
            }

            return ts.visitNode(sourceFile, visitor);
        }
    }
}
