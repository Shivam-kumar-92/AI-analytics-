import * as XLSX from 'xlsx';

export interface ParseResult {
  data: Record<string, any>[];
  fileName: string;
  sourceType: 'csv' | 'xlsx' | 'json' | 'txt' | 'manual' | 'paste';
  error?: string;
}

/**
 * Universal Data Parser
 * Supports CSV, XLSX, JSON, TXT tabular and manual copy/paste
 */
export class DataParser {
  static parseCSV(csvText: string, fileName = 'upload.csv'): ParseResult {
    try {
      const lines = csvText.trim().split(/\r\n|\n|\r/);
      if (lines.length < 2) {
        return { data: [], fileName, sourceType: 'csv', error: 'CSV file contains no data rows.' };
      }

      // Detect delimiter: comma, tab, semicolon, pipe
      const firstLine = lines[0];
      const delimiters = [',', '\t', ';', '|'];
      let bestDelimiter = ',';
      let maxCols = 0;
      for (const d of delimiters) {
        const count = firstLine.split(d).length;
        if (count > maxCols) {
          maxCols = count;
          bestDelimiter = d;
        }
      }

      const headers = this.parseCSVLine(firstLine, bestDelimiter).map((h) =>
        h.trim().replace(/^["']|["']$/g, '')
      );

      const rows: Record<string, any>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const values = this.parseCSVLine(line, bestDelimiter);
        const row: Record<string, any> = {};
        headers.forEach((h, idx) => {
          const val = values[idx] !== undefined ? values[idx].trim().replace(/^["']|["']$/g, '') : '';
          row[h || `col_${idx + 1}`] = this.autoCastValue(val);
        });
        rows.push(row);
      }

      return { data: rows, fileName, sourceType: 'csv' };
    } catch (err: any) {
      return { data: [], fileName, sourceType: 'csv', error: `CSV Parsing error: ${err.message}` };
    }
  }

  private static parseCSVLine(line: string, delimiter: string): string[] {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(cur);
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur);
    return result;
  }

  static parseJSON(jsonText: string, fileName = 'data.json'): ParseResult {
    try {
      const parsed = JSON.parse(jsonText);
      let data: Record<string, any>[] = [];
      if (Array.isArray(parsed)) {
        data = parsed;
      } else if (typeof parsed === 'object' && parsed !== null) {
        // check if there is an array property inside (e.g. { data: [...] } or { reviews: [...] })
        const arrayKey = Object.keys(parsed).find((k) => Array.isArray(parsed[k]));
        if (arrayKey) {
          data = parsed[arrayKey];
        } else {
          data = [parsed];
        }
      }
      return { data, fileName, sourceType: 'json' };
    } catch (err: any) {
      return { data: [], fileName, sourceType: 'json', error: `JSON parsing error: ${err.message}` };
    }
  }

  static async parseExcel(file: File): Promise<ParseResult> {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      return { data: json, fileName: file.name, sourceType: 'xlsx' };
    } catch (err: any) {
      return { data: [], fileName: file.name, sourceType: 'xlsx', error: `Excel parsing error: ${err.message}` };
    }
  }

  static parseText(text: string, fileName = 'input.txt'): ParseResult {
    const trimmed = text.trim();
    if (trimmed.startsWith('[') || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
      const jsonRes = this.parseJSON(trimmed, fileName);
      if (!jsonRes.error && jsonRes.data.length > 0) return jsonRes;
    }
    return this.parseCSV(trimmed, fileName);
  }

  static autoCastValue(val: string): any {
    if (val === '' || val === null || val === undefined) return '';
    if (val.toLowerCase() === 'true') return true;
    if (val.toLowerCase() === 'false') return false;
    if (val.toLowerCase() === 'null') return '';

    // Check currency or percentage
    const cleanedCurrency = val.replace(/^[₹$€£\s]+/, '').replace(/,/g, '');
    if (!isNaN(Number(cleanedCurrency)) && cleanedCurrency.trim() !== '') {
      return Number(cleanedCurrency);
    }

    if (val.endsWith('%')) {
      const pct = val.slice(0, -1).trim();
      if (!isNaN(Number(pct))) return Number(pct);
    }

    return val;
  }
}
