import {lint} from '../src/headless';
import {rules} from '../src/rules';
import {DEFAULT_SETTINGS, LinterSettings} from '../src/settings-data';

function settingsWithOnly(ruleAlias: string): LinterSettings {
  const settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS)) as LinterSettings;
  settings.ruleConfigs = {};

  for (const rule of rules) {
    settings.ruleConfigs[rule.alias] = {...rule.getDefaultOptions(), enabled: rule.alias === ruleAlias};
  }

  settings.logLevel = 'ERROR';
  return settings;
}

test('lints through the registered rules without loading Obsidian', () => {
  const output = lint({
    text: '# Heading',
    path: 'notes/example.md',
    name: 'example',
    createdAt: '2026-09-21T10:00:00Z',
    modifiedAt: '2026-09-21T10:00:00Z',
    currentTime: '2026-09-21T10:00:00Z',
    locale: 'en',
    settings: settingsWithOnly('line-break-at-document-end'),
  });

  expect(output).toBe('# Heading\n');
});
