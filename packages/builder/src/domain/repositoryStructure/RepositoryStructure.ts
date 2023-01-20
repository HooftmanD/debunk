import Folder from '../../shared/Folder';
import FileSystem from '../../shared/FileSystem';

export default class RepositoryStructure {

  constructor(private fileSystem: FileSystem, private folder: Folder) { }
  
  public async getPackageFolder(name: string): Promise<Folder> {
    const packageFile = await this.fileSystem.readPackageJsonFile(this.folder);

    if (packageFile.private) {
      return { path: this.findPathInMonoRepository(this.folder.path, name)};
    } else {
      return this.folder;
    }
  };

  private findPathInMonoRepository(path: string, name: string): string {
    if (name.startsWith('@')) {
      name = name.split('/')[1];
    }

    return `${path}/packages/${name}`;
  }
}
