import ts from 'typescript'

export const before = (options?: any, program?: ts.Program) => {
    return (context: ts.TransformationContext) => {
        return (sourceFile: ts.SourceFile) => {
            return sourceFile;
        }
    }
}
