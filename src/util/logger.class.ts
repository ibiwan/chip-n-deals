// import { LoggerService } from '@nestjs/common';
import { Table, printTable, renderTable } from 'console-table-printer';

import { ConsoleLogger } from '@nestjs/common';

// enum LogLevel {
//   Trace = 'Trace',
//   Debug = 'Debug',
//   Info = 'Info',
//   Warning = 'Warning',
//   Error = 'Error',
//   Fatal = 'Fatal',
// }

// const isString = (val) => typeof val === 'string' || val instanceof String;

// const logDetail =
//   (level: LogLevel) =>
//   (context: string, detail: string | object = null) => {
//     const out: { level: string; context?: string; detail?: string } = { level };
//     if (context) {
//       out.context = context;
//     }
//     if (detail) {
//       const detailString = isString(detail)
//         ? (detail as string)
//         : JSON.stringify(detail);
//       out.detail = detailString;
//     }
//     console.log(out);
//   };

// export const logger = {
//   trace: logDetail(LogLevel.Trace),
//   debug: logDetail(LogLevel.Debug),
//   info: logDetail(LogLevel.Info),
//   warning: logDetail(LogLevel.Warning),
//   error: logDetail(LogLevel.Error),
//   fatal: logDetail(LogLevel.Fatal),
// };
const regexClassy =
  /(?<classMethod>[^(]+) \((?<file>[^:]*):(?<row>\d+):(?<col>\d+)\)/;
const regexPlain = /(?<file>[^:]*):(?<row>\d+):(?<col>\d+)/;

export const shortStack = () => {
  const root = process.cwd();
  const fullStack = new Error().stack;

  const smallStack = fullStack
    .split('\n')
    .slice(2, 8)
    .map((s) => s.slice(7).split(root).join('.'));

  const stack = smallStack.map((s) => {
    const matches = regexClassy.exec(s) ?? regexPlain.exec(s);
    return matches?.groups;
  });

  const tabular = new Table({
    columns: [{ name: 'classMethod', title: 'class/method' }, { name: 'file' }],
    disabledColumns: ['row', 'col'],
    computedColumns: [
      {
        name: 'rowcol',
        function: (row) => row.row + ':' + row.col,
      },
    ],
    title: 'stack:',
    rows: stack,
  });

  return '\n' + tabular.render();
};

export class TestLogger extends ConsoleLogger {}
