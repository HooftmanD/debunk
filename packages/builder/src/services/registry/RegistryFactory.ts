import Package from './Registry';
import DefaultRegistry from './registries/DefaultRegistry';
import ScopedRegistry from './registries/ScopedRegistry';
import FileSystem from '../../shared/FileSystem';

export default abstract class RegistryFactory {

  public static getRegistry(fileSystem: FileSystem, name: string, version: string): Package {
    if (name.startsWith('@')){
      return new ScopedRegistry(fileSystem, name, version);
    } else {
      return new DefaultRegistry(fileSystem, name, version);
    }
  }
}
