
import * as Task from 'azure-pipelines-task-lib';
import * as path from 'path';
import * as fs from 'fs';
import * as sentry from '@sentry/node';

import { Helper } from './helper';
import { RegExMatch } from './regExMatch';

Task.setResourcePath(path.join(__dirname, 'task.json'));

async function run(): Promise<void> {

    sentry.init({
        dsn: 'SENTRY_DSN',
        release: 'TASK_RELEASE_VERSION'
    });

    const filePath: string = <string>Task.getPathInput('PathToFile', true);
    const regExString: string = <string>Task.getInput('RegEx', true);
    const valueToReplace: string = <string>Task.getInput('ValueToReplace', true);
    const global: boolean = Task.getBoolInput('Global');
    const ignoreCase: boolean = Task.getBoolInput('IgnoreCase');
    const multiLine: boolean = Task.getBoolInput('MultiLine');

    Helper.WriteConsoleInformation(`File path: ${filePath}`, false);
    Helper.WriteConsoleInformation(`Regular Expression: ${regExString}`, false);
    Helper.WriteConsoleInformation(`Replacement Value: ${valueToReplace}`, false);

    fs.readFile(filePath, 'utf8', (readError, data) => {
        if (readError) {
            Task.setResult(Task.TaskResult.Failed, `Failed to read the file. File path: ${filePath}`);
            return;
        }

        // Match and Replace
        const modifiedContent = RegExMatch.MatchAndReplace(data, regExString, valueToReplace, global, ignoreCase, multiLine);

        fs.writeFile(filePath, modifiedContent, 'utf8', writeError => {
            if (writeError) {
                Task.setResult(Task.TaskResult.Failed, `Failed to write the file. Error: ${writeError.message}`);
                sentry.captureException(writeError);
                return;
            }

            Task.setResult(Task.TaskResult.Succeeded, 'RegEx Match Replace Complete.');
        });
    });

}

run()
    .catch((err: any) => {
        sentry.captureException(err);
    });