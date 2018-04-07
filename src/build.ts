import {readFileSync, writeFileSync} from "fs";
import {dirname, join, sep} from "path";

function copyFile(inPath : string, outPath : string) {
    writeFileSync(outPath, readFileSync(inPath));
}

interface PackageJson {
    version: string;
    private: boolean;
    main: string;
    types: string;
}

function build() {
    const rootDir = dirname(__dirname);
    const outputDir = __dirname;

    // Read package.json
    let packageContents : PackageJson = JSON.parse(readFileSync(join(rootDir, `package.json`), 'utf8'));
    packageContents.version = packageContents.version.replace(/-dev/g, ''); // Remove "-dev" from the version number
    packageContents.private = false; // Make it publishable
    packageContents.main = packageContents.main.replace(/dist\//g, ''); // Reference this from the root of the publish directory
    packageContents.types = packageContents.types.replace(/dist\//g, ''); // Reference this from the root of the publish directory
    // Write it out to the publishing directory
    writeFileSync(join( outputDir , `package.json`), JSON.stringify(packageContents, null, 2)); // NOTE: this file will have LF line endings
    // Copy some other files to publish into the publishing directory
    const filesToCopy = [
        '.npmignore',
        'README.md'
    ];
    for (const fileToCopy of filesToCopy) {
        copyFile(join(rootDir, fileToCopy), join(outputDir, fileToCopy));
    }
}

if (require.main === module) {
    build();
}
