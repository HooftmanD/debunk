import RepositoryType from "../RepositoryType";
import DefaultRepositoryType from "./DefaultRepositoryType";
import FileSystem from "../../../shared/FileSystem";
import Command from "../../../shared/Command";
import Folder from "../../../shared/Folder";

export default class YarnBuildRepositoryType extends DefaultRepositoryType implements RepositoryType {

  constructor(protected fileSystem: FileSystem, protected command: Command, protected folder: Folder) { 
    super(fileSystem, command, folder);
  }

  public async transform(): Promise<Folder> {
    await this.command.execute('yarn install', this.folder.path);
    await this.command.execute('yarn build', this.folder.path);
    const executionResult = await this.command.execute('yarn pack', this.folder.path);
    const packageName = executionResult.stdout.substring(
      executionResult.stdout.lastIndexOf(this.folder.path) + this.folder.path.length + 1, 
      executionResult.stdout.lastIndexOf('".')
    );
    const buffer = await this.fileSystem.readTgzFile({ path: this.folder.path, name: packageName});
    return await this.fileSystem.downloadLocalPackage(buffer);
  }
}
