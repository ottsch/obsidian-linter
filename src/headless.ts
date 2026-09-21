import moment from 'moment';
import type {Moment} from 'moment';
import {RulesRunner} from './rules-runner';
import type {LinterSettings} from './settings-data';
import './headless-rules-registry';
import {setLanguage} from './lang/helpers';
import {sortRules} from './rules';
import {stripCr} from './utils/strings';

export {DEFAULT_SETTINGS} from './settings-data';
export type {LinterSettings} from './settings-data';

export type HeadlessLintOptions = {
  text: string;
  path: string;
  name: string;
  createdAt: string | number | Date | Moment;
  modifiedAt: string | number | Date | Moment;
  currentTime: string | number | Date | Moment;
  locale: string;
  settings: LinterSettings;
  defaultMisspellings?: Map<string, string>;
};

function formatTimestamp(value: HeadlessLintOptions['createdAt'], locale: string): string {
  return moment(value).locale(locale).format();
}

export function lint(options: HeadlessLintOptions): string {
  sortRules();
  setLanguage(options.locale);

  const runner = new RulesRunner();
  const createdAtFormatted = formatTimestamp(options.createdAt, options.locale);
  const modifiedAtFormatted = formatTimestamp(options.modifiedAt, options.locale);

  return runner.lintText({
    oldText: stripCr(options.text),
    fileInfo: {
      name: options.name,
      path: options.path,
      createdAtFormatted,
      modifiedAtFormatted,
    },
    settings: options.settings,
    momentLocale: options.locale,
    getCurrentTime: () => moment(options.currentTime).locale(options.locale),
    defaultMisspellings: options.defaultMisspellings ?? new Map<string, string>(),
  });
}
