import { copyFile, mkdirp, readFile, writeFile } from 'fs-extra';
import { dirname, join } from 'path';
import { rootPath } from 'get-root-path';

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

async function readRootPackageJson(): Promise<PackageJson> {
    return JSON.parse(await readFile(join(rootPath, 'package.json'), 'utf8'));
}

async function packageForDistribution() {
    const distPath = join(rootPath, 'dist');

    const packageJson = await readRootPackageJson();

    // Make it publishable
    delete packageJson.private;

    // Reference these from the root of the dist directory
    packageJson.main = packageJson.main.replace(/dist\//g, '');
    packageJson.types = packageJson.types.replace(/dist\//g, '');
    delete packageJson.scripts;
    delete packageJson.devDependencies;

    // Write it out to the dist directory
    await writeFile(join(distPath, 'package.json'), JSON.stringify(packageJson, null, 2));

    // Copy some other files to publish
    const filesToCopy = [
        'README.md',
        // 'images/logo.png',
    ];
    await Promise.all(
        filesToCopy.map(async (relativePath) => {
            const absoluteSourceFileName = join(rootPath, relativePath);
            const absoluteDestFileName = join(distPath, relativePath);
            await mkdirp(dirname(absoluteDestFileName));
            await copyFile(absoluteSourceFileName, absoluteDestFileName);
        }),
    );
}

if (require.main === module) {
    packageForDistribution()
        .then(() => process.stdout.write('Package complete\n'))
        .catch((err) => process.stdout.write(`Package failed: ${err.message || err}\n`));
}
