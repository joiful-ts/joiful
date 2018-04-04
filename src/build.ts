import {readFileSync, writeFileSync} from "fs";
import {join} from "path";

function copyFile(inPath : string, outPath : string) {
    writeFileSync(outPath, readFileSync(inPath));
}

function build() {
    // Read package.json
    let packageContents = readFileSync(join(__dirname, `..`, `package.json`), 'utf8');
    packageContents = packageContents
        .replace(/dist\//g, '') // Replace "dist/" with "". (Not foolproof, but good enough)
        .replace(/"private": true/, `"private": false`); // Make this publishable
    // Write it out to the publishing directory
    writeFileSync(join( __dirname , `package.json`), packageContents);
    // Copy some other files to publish into the publishing directory
    const filesToCopy = [
        '.npmignore',
        'README.md'
    ];
    for (const fileToCopy of filesToCopy) {
        copyFile(join(__dirname, `..`, fileToCopy), join(__dirname, fileToCopy));
    }
}

if (require.main === module) {
    build();
}
