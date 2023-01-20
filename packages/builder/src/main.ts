import { PackageAnalyzer } from "./PackageAnalyzer";
import PackageReport from "./PackageReport";

const p = [
  ['inherits', '2.0.4'],
  ['typed-inject', '2.1.1'],
  ['demomaliciouspackageishan', '1.0.2'],
  ['chalk', '3.0.0'],
  ['commander', '5.0.0'],
  ['express', '4.17.1'],
  ['prop-types', '15.7.2'],
  ['tslib', '1.11.1'],
  ['debug', '4.1.1'],
  ['fs-extra', '9.0.0'],
];

const tasks: Promise<PackageReport>[] = []

p.forEach(element => {
  const pa = new PackageAnalyzer();
  tasks.push(pa.analyze(element[0], element[1]));
});

Promise.all(tasks).then(
  (m: PackageReport[]) => { 
    console.table(m)
  }
).catch(e => console.error(e));
