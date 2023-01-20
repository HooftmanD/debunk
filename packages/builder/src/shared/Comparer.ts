import dircompare, { Result } from "dir-compare";

export default class Comparer {
    
    public async compare(filePath1: string, filePath2: string): Promise<Result> {
        
        const options = {
            compareContent: true,
            compareFileAsync: dircompare.fileCompareHandlers.lineBasedFileCompare.compareAsync,
            ignoreLineEnding: true,
            ignoreWhiteSpaces: true
        }
        
        return dircompare.compare(filePath1, filePath2, options);
    }
}