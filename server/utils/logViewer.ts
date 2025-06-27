import fs from "fs";
import path from "path";
import { log } from "./logger";

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  meta?: any;
}

interface LogViewerOptions {
  lines?: number; // 显示最后几行
  level?: string; // 过滤日志级别
  search?: string; // 搜索关键词
  startDate?: string; // 开始日期 YYYY-MM-DD
  endDate?: string; // 结束日期 YYYY-MM-DD
}

export class LogViewer {
  private logsDir: string;

  constructor() {
    this.logsDir = path.join(process.cwd(), "logs");
  }

  // 获取所有日志文件
  private getLogFiles(): string[] {
    try {
      if (!fs.existsSync(this.logsDir)) {
        return [];
      }
      return fs
        .readdirSync(this.logsDir)
        .filter((file) => file.endsWith(".log"))
        .map((file) => path.join(this.logsDir, file));
    } catch (error) {
      log.error("Error reading log directory", {
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  }

  // 解析单行日志
  private parseLogLine(line: string): LogEntry | null {
    try {
      // 匹配日志格式: 2024-01-01 12:00:00 [INFO]: message
      const regex = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) \[(\w+)\]: (.+)$/;
      const match = line.match(regex);

      if (match) {
        const [, timestamp, level, message] = match;
        return {
          timestamp,
          level: level.toUpperCase(),
          message,
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // 过滤日志条目
  private filterLogEntry(entry: LogEntry, options: LogViewerOptions): boolean {
    if (options.level && entry.level !== options.level.toUpperCase()) {
      return false;
    }

    if (
      options.search &&
      !entry.message.toLowerCase().includes(options.search.toLowerCase())
    ) {
      return false;
    }

    if (options.startDate || options.endDate) {
      const entryDate = entry.timestamp.split(" ")[0]; // 提取日期部分

      if (options.startDate && entryDate < options.startDate) {
        return false;
      }

      if (options.endDate && entryDate > options.endDate) {
        return false;
      }
    }

    return true;
  }

  // 读取日志文件
  private readLogFile(
    filePath: string,
    options: LogViewerOptions = {}
  ): LogEntry[] {
    try {
      if (!fs.existsSync(filePath)) {
        return [];
      }

      const content = fs.readFileSync(filePath, "utf-8");
      const lines = content.split("\n").filter((line) => line.trim());

      let entries: LogEntry[] = [];

      for (const line of lines) {
        const entry = this.parseLogLine(line);
        if (entry && this.filterLogEntry(entry, options)) {
          entries.push(entry);
        }
      }

      // 如果指定了行数，只返回最后几行
      if (options.lines && options.lines > 0) {
        entries = entries.slice(-options.lines);
      }

      return entries;
    } catch (error) {
      log.error("Error reading log file", {
        filePath,
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  }

  // 获取HTTP请求日志
  getHttpLogs(options: LogViewerOptions = {}): LogEntry[] {
    const httpLogFiles = this.getLogFiles().filter((file) =>
      file.includes("http-")
    );
    let allEntries: LogEntry[] = [];

    for (const file of httpLogFiles) {
      const entries = this.readLogFile(file, options);
      allEntries = allEntries.concat(entries);
    }

    // 按时间戳排序
    return allEntries.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  // 获取服务器运行日志
  getServerLogs(options: LogViewerOptions = {}): LogEntry[] {
    const serverLogFiles = this.getLogFiles().filter((file) =>
      file.includes("server-")
    );
    let allEntries: LogEntry[] = [];

    for (const file of serverLogFiles) {
      const entries = this.readLogFile(file, options);
      allEntries = allEntries.concat(entries);
    }

    return allEntries.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  // 获取错误日志
  getErrorLogs(options: LogViewerOptions = {}): LogEntry[] {
    const errorLogFiles = this.getLogFiles().filter((file) =>
      file.includes("error-")
    );
    let allEntries: LogEntry[] = [];

    for (const file of errorLogFiles) {
      const entries = this.readLogFile(file, options);
      allEntries = allEntries.concat(entries);
    }

    return allEntries.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  // 获取所有日志
  getAllLogs(options: LogViewerOptions = {}): LogEntry[] {
    const allFiles = this.getLogFiles();
    let allEntries: LogEntry[] = [];

    for (const file of allFiles) {
      const entries = this.readLogFile(file, options);
      allEntries = allEntries.concat(entries);
    }

    return allEntries.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  // 获取日志统计信息
  getLogStats(): {
    totalFiles: number;
    totalSize: number;
    files: Array<{ name: string; size: number; lastModified: Date }>;
  } {
    const files = this.getLogFiles();
    let totalSize = 0;
    const fileStats: Array<{ name: string; size: number; lastModified: Date }> =
      [];

    for (const file of files) {
      try {
        const stats = fs.statSync(file);
        const fileName = path.basename(file);
        totalSize += stats.size;
        fileStats.push({
          name: fileName,
          size: stats.size,
          lastModified: stats.mtime,
        });
      } catch (error) {
        log.error("Error getting file stats", {
          file,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return {
      totalFiles: files.length,
      totalSize,
      files: fileStats.sort(
        (a, b) => b.lastModified.getTime() - a.lastModified.getTime()
      ),
    };
  }

  // 清理旧日志文件
  cleanOldLogs(daysToKeep: number = 30): {
    deletedFiles: string[];
    errorFiles: string[];
  } {
    const files = this.getLogFiles();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const deletedFiles: string[] = [];
    const errorFiles: string[] = [];

    for (const file of files) {
      try {
        const stats = fs.statSync(file);
        if (stats.mtime < cutoffDate) {
          fs.unlinkSync(file);
          deletedFiles.push(path.basename(file));
          log.info("Deleted old log file", { file: path.basename(file) });
        }
      } catch (error) {
        errorFiles.push(path.basename(file));
        log.error("Error deleting log file", {
          file: path.basename(file),
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return { deletedFiles, errorFiles };
  }
}

// 导出单例实例
export const logViewer = new LogViewer();
