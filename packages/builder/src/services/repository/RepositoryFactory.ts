import Repository from "./Repository";
import RegistryInformation from "../registry/RegistryInformation";
import GitHeadRepository from "./repositories/GitHeadRepository";
import DefaultRepository from "./repositories/DefaultRepository";
import FileSystem from "../../shared/FileSystem";

export default abstract class RepositoryFactory {

  public static getRepository(fileSystem: FileSystem, registryInformation: RegistryInformation): Repository {
    if (registryInformation.gitHead){
      return new GitHeadRepository(fileSystem, registryInformation);
    } else {
      return new DefaultRepository(fileSystem, registryInformation);
    }
  }
}
