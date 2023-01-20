import Folder from './Folder';
import util from 'util';
import fs from 'fs';
import tarLib from 'tar';
import File from './File';
import PackageJson from './PackageJson';

export default class FileSystem {

  public baseDirectory: string;

  constructor() {
    this.baseDirectory = `${__dirname}/.debunk-tmp${this.randomInt(0, 999999)}`
  };

  public async downloadRepository(buffer: Buffer): Promise<Folder> {
    return this.downloadTarball(buffer, 'repository');
  }

  public async downloadPublishedPackage(buffer: Buffer): Promise<Folder> {
    return this.downloadTarball(buffer, 'publishedPackage');
  }

  public async downloadLocalPackage(buffer: Buffer): Promise<Folder> {
    return this.downloadTarball(buffer, 'localPackage');
  }

  public async readTgzFile(file: File): Promise<Buffer> {
    return await util.promisify(fs.readFile)(`${this.baseDirectory}/${file.path}/${file.name}`)
  }

  public async readPackageJsonFile(folder: Folder): Promise<PackageJson> {
    return this.readJsonFile({ path: folder.path, name: 'package.json'});
  }

  public async hasLockFile(folder: Folder): Promise<{ result: boolean, type: string|null}>{
    if(await util.promisify(fs.exists)(`${this.baseDirectory}/${folder.path}/package-lock.json`)) {
      return { result: true, type: 'npm' };
    } else if (await util.promisify(fs.exists)(`${this.baseDirectory}/${folder.path}/yarn.lock`)) {
      return { result: true, type: 'yarn' };
    } else {
      return { result: false, type: null };
    }
  }

  public async readJsonFile(file: File): Promise<object> {
    const rawFile = await util.promisify(fs.readFile)(`${this.baseDirectory}/${file.path}/${file.name}`, { encoding: 'utf-8'});
    return JSON.parse(rawFile);
  }

  public tempDirectory(): void {
    if (!fs.existsSync(this.baseDirectory)) {
      fs.mkdirSync(this.baseDirectory);
    }
  }

  public removeTempDirectory(): void {
    fs.rmdirSync(this.baseDirectory, { recursive: true });
  }

  private createDirectory(path: string): void {
    if (!fs.existsSync(`${this.baseDirectory}/${path}`)) {
      fs.mkdirSync(`${this.baseDirectory}/${path}`);
    }
  }

  private async downloadTarball(buffer: Buffer, name: string): Promise<Folder> {
    this.createDirectory(`/${name}/`);

    const path = `${this.baseDirectory}/${name}`;

    await util.promisify(fs.writeFile)(`${path}/tar`, buffer);
    await tarLib.extract({ cwd: `${path}/`, file: `${path}/tar`});
    await util.promisify(fs.unlink)(`${path}/tar`);

    const extractedNames = await util.promisify(fs.readdir)(`${path}/`);

    if (extractedNames.length <= 0 || extractedNames.length > 1) {
      throw new Error(`Could not download ${name} as expected`);
    }

    return { path: `/${name}/${extractedNames[0]}` };
  }

  private randomInt(low: number, high: number): number {
    return Math.floor(Math.random() * (high - low) + low);
  }
}
