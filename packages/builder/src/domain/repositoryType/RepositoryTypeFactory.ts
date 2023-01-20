import Folder from '../../shared/Folder';
import RepositoryType from './RepositoryType';
import Command from '../../shared/Command';
import FileSystem from '../../shared/FileSystem';
import NpmBuildRepositoryType from './repositoryTypes/NpmBuildRepositoryType';
import DefaultRepositoryType from './repositoryTypes/DefaultRepositoryType';
import YarnBuildRepositoryType from './repositoryTypes/YarnBuildRepositoryType';

export default abstract class RepositoryTypeFactory {

  public static async getRepositoryType(fileSystem: FileSystem, command: Command, folder: Folder): Promise<RepositoryType> {
    const packageFile = await fileSystem.readPackageJsonFile(folder);
    const lockFile = await fileSystem.hasLockFile(folder)

    if (lockFile.result && lockFile.type === "yarn" && packageFile.scripts && packageFile.scripts.build) {
      return new YarnBuildRepositoryType(fileSystem, command, folder);
    } else if (lockFile.result && lockFile.type === "npm" && packageFile.scripts && packageFile.scripts.build) {
      return new NpmBuildRepositoryType(fileSystem, command, folder);
    } else {
      return new DefaultRepositoryType(fileSystem, command, folder);
    }
  }
}
