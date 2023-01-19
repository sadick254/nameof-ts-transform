export function manual(content: string): string {
    if (content.includes("nameof")) {
        content = content.replace(/import.*from "nameof-ts-transform";/g, "");

        const nameRegEx = /nameof<(.*?)>\(\)/g;
        let matchName;
        do {
            matchName = nameRegEx.exec(content);
            if (matchName && matchName.length === 2) {
                content = content.replace(matchName[0], `"${matchName[1].replace(/\?/g, "")}"`);
            }
        } while (matchName);

        const propRegEx = /nameof\((.*?)\)/g;
        let matchProp;
        do {
            matchProp = propRegEx.exec(content);
            if (matchProp && matchProp.length === 2) {
                content = content.replace(matchProp[0], `"${matchProp[1].replace(/\?/g, "")}"`);
            }
        } while (matchProp);
    }
    return content;
}
