import { exec } from 'child_process';
import util from 'util';
import FileSystem from './FileSystem';

export default class Command {
  constructor(private fileSystem: FileSystem) {}

  public async execute(command: string, path: string): Promise<{stdout: string, stderr: string}> {
    return util.promisify(exec)(command, { cwd: `${this.fileSystem.baseDirectory}/${path}`});
  }
}
