enum LogLevel {
  Trace = 'Trace',
  Debug = 'Debug',
  Info = 'Info',
  Warning = 'Warning',
  Error = 'Error',
  Fatal = 'Fatal',
}

const isString = (val) => typeof val === 'string' || val instanceof String;

const logDetail =
  (level: LogLevel) =>
  (context: string, detail: string | object = null) => {
    const detailString = isString(detail) ? detail : JSON.stringify(detail);
    console.log({ level, context, detail: detailString });
  };

export const logger = {
  trace: logDetail(LogLevel.Trace),
  debug: logDetail(LogLevel.Debug),
  info: logDetail(LogLevel.Info),
  warning: logDetail(LogLevel.Warning),
  error: logDetail(LogLevel.Error),
  fatal: logDetail(LogLevel.Fatal),
};

export const shortStack = () => {
  const root = process.cwd();
  const stack = new Error().stack
    .split('\n')
    .slice(2, 6)
    .map((s) => s.slice(7).split(root).join('.'));

  return stack;
};
