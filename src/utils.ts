import * as fs from 'fs';

export const checkIsDirectory = (filePath: string): boolean => {
    return fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory();
};

export const createDirectory = (directoryPath: string): void => {
    fs.mkdirSync(directoryPath);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const writeToFile = (filePath: string, data: any): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fs.writeFileSync(filePath, data, (error) => {
        if (error) throw error;
    });
};
