import {readdirSync} from 'node:fs';
import {join} from 'node:path';
import {createRequire} from 'node:module';

const rulesDirectory = join(__dirname, 'rules');
const requireRule = createRequire(__filename);

for (const file of readdirSync(rulesDirectory).filter((file) => file.endsWith('.ts')).sort()) {
  requireRule(join(rulesDirectory, file));
}
