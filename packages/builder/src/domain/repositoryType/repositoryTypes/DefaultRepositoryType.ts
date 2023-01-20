import Folder from '../../../shared/Folder';
import RepositoryType from '../RepositoryType';
import Command from '../../../shared/Command';
import FileSystem from '../../../shared/FileSystem';

export default class DefaultRepositoryType implements RepositoryType {

  constructor(protected fileSystem: FileSystem, protected command: Command, protected folder: Folder) { }

  public async transform(): Promise<Folder> {
    const executionResult = await this.command.execute('npm pack', this.folder.path);
    const packageName = executionResult.stdout.replace(/(\r\n|\n|\r)/gm, '');
    const buffer = await this.fileSystem.readTgzFile({ path: this.folder.path, name: packageName});
    return await this.fileSystem.downloadLocalPackage(buffer);
  }
}
