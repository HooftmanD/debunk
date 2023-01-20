import RepositoryType from "../RepositoryType";
import DefaultRepositoryType from "./DefaultRepositoryType";
import FileSystem from "../../../shared/FileSystem";
import Command from "../../../shared/Command";
import Folder from "../../../shared/Folder";

export default class NpmBuildRepositoryType extends DefaultRepositoryType implements RepositoryType{

  constructor(protected fileSystem: FileSystem, protected command: Command, protected folder: Folder) { 
    super(fileSystem, command, folder);
  }

  public async transform(): Promise<Folder> {
    await this.command.execute('npm install', this.folder.path);
    await this.command.execute('npm run build', this.folder.path);
    const executionResult = await this.command.execute('npm pack', this.folder.path);
    const packageName = executionResult.stdout.replace(/(\r\n|\n|\r)/gm, '');
    const buffer = await this.fileSystem.readTgzFile({ path: this.folder.path, name: packageName});
    return await this.fileSystem.downloadLocalPackage(buffer);
  }
}
