import * as Task from 'azure-pipelines-task-lib';

export class Helper {
    constructor() {}

    static WriteConsoleInformation(message: string, debug: boolean): void {
        console.info(message);
        if (debug) {
            Task.debug(message);
        }
    }

    static WriteConsoleError(message: string): void {
        console.error(message);
        Task.error(message);
    }
}