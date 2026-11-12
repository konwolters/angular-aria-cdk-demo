type CsvRow = readonly (string | number)[];

/** Creates a semicolon-separated CSV download in the browser. */
export function downloadGuiCsv(filename: string, headers: CsvRow, rows: readonly CsvRow[]): void {
  const escape = (value: string | number): string => {
    const text = String(value);
    return /[;"\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };
  const csv = [headers, ...rows].map((row) => row.map(escape).join(';')).join('\r\n');
  const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
