import * as fs from 'fs';
import { rootPath } from 'get-root-path';
import * as path from 'path';

const sourcePackageFileName = path.join(rootPath, 'package.json');
const destinationPackageFileName = path.join(rootPath, 'dist/package.json');

const sourcePackage = JSON.parse(fs.readFileSync(sourcePackageFileName, 'utf-8'));
const destinationPackage = JSON.parse(fs.readFileSync(destinationPackageFileName, 'utf-8'));

destinationPackage.version = sourcePackage.version;

fs.writeFileSync(destinationPackageFileName, JSON.stringify(destinationPackage, null, '  '), { encoding: 'utf-8' });
