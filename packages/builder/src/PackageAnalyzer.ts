import PackageReport from "./PackageReport";
import RegistryFactory from "./services/registry/RegistryFactory";
import RepositoryFactory from "./services/repository/RepositoryFactory";
import FileSystem from "./shared/FileSystem";
import RepositoryStructure from "./domain/repositoryStructure/RepositoryStructure";
import RepositoryTypeFactory from './domain/repositoryType/RepositoryTypeFactory';
import Command from "./shared/Command";
import Folder from "./shared/Folder";
import Registry from "./services/registry/Registry";
import RegistryInformation from "./services/registry/RegistryInformation";
import Comparer from "./shared/Comparer";
import { Result } from "dir-compare";

export class PackageAnalyzer {
  private fileSystem: FileSystem = new FileSystem();
  private command: Command =  new Command(this.fileSystem);
  private comparer: Comparer = new Comparer();

  public async analyze(name: string, version: string): Promise<PackageReport> {
    this.fileSystem.tempDirectory();

    const registry = RegistryFactory.getRegistry(this.fileSystem, name, version);
    const registryInformation = await registry.fetchInformation();

    const result = await Promise.all([
      this.downloadSourcePackage(registryInformation, name),
      this.downloadPublishedPackage(registry, registryInformation)
    ]);

    const [firstFolder, secondFolder] = result;

    const comparison = await this.comparePackages(firstFolder, secondFolder);

    return { 
      name: name,
      version: version,
      same: comparison.same
    };
  }

  private async downloadSourcePackage(registryInformation: RegistryInformation, name: string): Promise<Folder> {
    const downloadedRepository = await this.downloadRepository(registryInformation);

    const repositoryStructure = new RepositoryStructure(this.fileSystem, downloadedRepository);
    const getPackageFolder = await repositoryStructure.getPackageFolder(name);
    const repositoryType = await RepositoryTypeFactory.getRepositoryType(this.fileSystem, this.command, getPackageFolder);
    return repositoryType.transform();
  }

  private async downloadRepository(registryInformation: RegistryInformation): Promise<Folder>{
      const repository = RepositoryFactory.getRepository(this.fileSystem, registryInformation);
      return await repository.downloadRepository();
  }

  private async downloadPublishedPackage(registry: Registry, registryInformation: RegistryInformation):Promise<Folder> {
    return registry.downloadPackage(registryInformation);
  }

  private async comparePackages(firstFolder: Folder, secondFolder: Folder): Promise<Result>{
    return this.comparer.compare(
      `${this.fileSystem.baseDirectory}${firstFolder.path}`, 
      `${this.fileSystem.baseDirectory}${secondFolder.path}`
    );
  }
}
