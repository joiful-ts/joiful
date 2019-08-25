import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { rootPath } from 'get-root-path';

function copyFile(inPath: string, outPath: string) {
    writeFileSync(outPath, readFileSync(inPath));
}

interface Dependencies {
    [name: string]: string;
}

interface Scripts {
    [name: string]: string;
}

interface PackageJson {
    name: string;
    version: string;
    description: string;
    license: string;
    main: string;
    types: string;
    private: boolean;
    scripts: Scripts;
    dependencies: Dependencies;
    devDependencies: Dependencies;
    peerDependencies: Dependencies;
    repository: string;
    author: string;
    tags: string;
}

function readRootPackageJson(): PackageJson {
    return JSON.parse(readFileSync(join(rootPath, 'package.json'), 'utf8'));
}

function packageForDistribution() {
    const distPath = join(rootPath, 'dist');

    const packageJson = readRootPackageJson();

    // Make it publishable
    delete packageJson.private;

    // Reference these from the root of the dist directory
    packageJson.main = packageJson.main.replace(/dist\//g, '');
    packageJson.types = packageJson.types.replace(/dist\//g, '');
    delete packageJson.scripts;
    delete packageJson.devDependencies;

    // Write it out to the dist directory
    writeFileSync(join(distPath, 'package.json'), JSON.stringify(packageJson, null, 2));

    // Copy some other files to publish
    const filesToCopy = [
        'README.md',
    ];
    filesToCopy.forEach((fileToCopy) => {
        copyFile(join(rootPath, fileToCopy), join(distPath, fileToCopy));
    });
}

if (require.main === module) {
    packageForDistribution();
}
