export enum LogLevel {
    'none'  = 0,
    'error' = 10,
    'warn'  = 20,
    'info'  = 30,
    'debug' = 40,
}

export class Logger {
    private static logLevel: LogLevel;
    public static setLogLevel(logLevel: LogLevel){
        Logger.logLevel = logLevel;
    }
    public static jsonify(args: (string|object)[]) {
        return args.map((arg: (object | string)) => {
            if (typeof arg === 'object') {
                try {
                    return JSON.stringify(arg, null, 4);
                } catch {
                    return arg;
                }
            }
            return arg;
        });
    }
    public static info(...args: (string|object)[]) {
        if (Logger.logLevel >= LogLevel.info) {
            console.log(...this.jsonify(args));
        }
    }
    public static warn(...args: (string|object)[]) {
        if (Logger.logLevel >= LogLevel.warn) {
            console.warn(...this.jsonify(args));
        }
    }
    public static error(...args: (string|object)[]) {
        if (Logger.logLevel >= LogLevel.error) {
            console.error(...this.jsonify(args));
        }
    }
    public static debug(...args: (string|object)[]) {
        if (Logger.logLevel >= LogLevel.debug) {
            console.trace(...this.jsonify(args));
        }
    }
}