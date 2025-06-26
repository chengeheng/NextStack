#!/usr/bin/env node

import fs from "fs";
import path from "path";

// 获取命令行参数
const args = process.argv.slice(2);
const command = args[0];
const options: Record<string, any> = {};

// 解析选项
for (let i = 1; i < args.length; i++) {
  const arg = args[i];
  if (arg.startsWith("--")) {
    const [key, value] = arg.slice(2).split("=");
    options[key] = value || true;
  }
}

const logsDir = path.join(process.cwd(), "logs");

// 获取日志文件列表
function getLogFiles(): string[] {
  if (!fs.existsSync(logsDir)) {
    console.log("日志目录不存在:", logsDir);
    return [];
  }

  return fs
    .readdirSync(logsDir)
    .filter((file) => file.endsWith(".log"))
    .sort()
    .reverse();
}

// 显示日志文件列表
function listLogs(): void {
  const files = getLogFiles();
  if (files.length === 0) {
    console.log("没有找到日志文件");
    return;
  }

  console.log("\n📁 日志文件列表:");
  console.log("=".repeat(50));

  files.forEach((file) => {
    const filePath = path.join(logsDir, file);
    const stats = fs.statSync(filePath);
    const size = (stats.size / 1024).toFixed(2);
    const date = stats.mtime.toLocaleString();

    console.log(`${file.padEnd(25)} | ${size.padStart(8)} KB | ${date}`);
  });

  console.log("=".repeat(50));
  console.log(`总计: ${files.length} 个文件`);
}

// 查看指定日志文件
function viewLog(filename: string, lines: number = 50): void {
  const filePath = path.join(logsDir, filename);

  if (!fs.existsSync(filePath)) {
    console.log(`❌ 文件不存在: ${filename}`);
    return;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const logLines = content.split("\n").filter((line) => line.trim());

  // 获取最后几行
  const lastLines = logLines.slice(-lines);

  console.log(`\n📄 查看日志文件: ${filename}`);
  console.log(`📊 总行数: ${logLines.length}, 显示最后 ${lastLines.length} 行`);
  console.log("=".repeat(80));

  lastLines.forEach((line) => {
    // 简单的日志格式高亮
    if (line.includes("[ERROR]")) {
      console.log(`\x1b[31m${line}\x1b[0m`); // 红色
    } else if (line.includes("[WARN]")) {
      console.log(`\x1b[33m${line}\x1b[0m`); // 黄色
    } else if (line.includes("[INFO]")) {
      console.log(`\x1b[32m${line}\x1b[0m`); // 绿色
    } else {
      console.log(line);
    }
  });

  console.log("=".repeat(80));
}

// 实时监控日志文件
function tailLog(filename: string): void {
  const filePath = path.join(logsDir, filename);

  if (!fs.existsSync(filePath)) {
    console.log(`❌ 文件不存在: ${filename}`);
    return;
  }

  console.log(`\n👀 实时监控日志文件: ${filename}`);
  console.log("按 Ctrl+C 停止监控");
  console.log("=".repeat(80));

  let position = fs.statSync(filePath).size;

  const watcher = fs.watch(filePath, (eventType) => {
    if (eventType === "change") {
      const stats = fs.statSync(filePath);
      if (stats.size > position) {
        const stream = fs.createReadStream(filePath, {
          start: position,
          end: stats.size,
        });

        stream.on("data", (chunk) => {
          const lines = chunk
            .toString()
            .split("\n")
            .filter((line) => line.trim());
          lines.forEach((line) => {
            if (line.includes("[ERROR]")) {
              console.log(`\x1b[31m${line}\x1b[0m`);
            } else if (line.includes("[WARN]")) {
              console.log(`\x1b[33m${line}\x1b[0m`);
            } else if (line.includes("[INFO]")) {
              console.log(`\x1b[32m${line}\x1b[0m`);
            } else {
              console.log(line);
            }
          });
        });

        position = stats.size;
      }
    }
  });

  // 处理Ctrl+C
  process.on("SIGINT", () => {
    watcher.close();
    console.log("\n\n🛑 停止监控");
    process.exit(0);
  });
}

// 清理旧日志文件
function cleanLogs(days: number = 30): void {
  const files = getLogFiles();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  let deletedCount = 0;
  let errorCount = 0;

  console.log(`\n🧹 清理 ${days} 天前的日志文件...`);

  files.forEach((file) => {
    try {
      const filePath = path.join(logsDir, file);
      const stats = fs.statSync(filePath);

      if (stats.mtime < cutoffDate) {
        fs.unlinkSync(filePath);
        console.log(`✅ 删除: ${file}`);
        deletedCount++;
      }
    } catch (error) {
      console.log(
        `❌ 删除失败: ${file} - ${error instanceof Error ? error.message : String(error)}`
      );
      errorCount++;
    }
  });

  console.log(`\n📊 清理完成:`);
  console.log(`   - 删除文件: ${deletedCount}`);
  console.log(`   - 删除失败: ${errorCount}`);
}

// 显示帮助信息
function showHelp(): void {
  console.log(`
📋 日志查看工具使用说明:

用法: npx tsx scripts/view-logs.ts <命令> [选项]

命令:
  list                   显示所有日志文件
  view <文件名>          查看指定日志文件
  tail <文件名>          实时监控日志文件
  clean [天数]           清理旧日志文件 (默认30天)

选项:
  --lines=<数量>         显示最后几行 (默认50行)

示例:
  npx tsx scripts/view-logs.ts list
  npx tsx scripts/view-logs.ts view http-2024-01-01.log
  npx tsx scripts/view-logs.ts view server-2024-01-01.log --lines=100
  npx tsx scripts/view-logs.ts tail error-2024-01-01.log
  npx tsx scripts/view-logs.ts clean 7

日志文件类型:
  - http-*.log           HTTP请求日志
  - server-*.log         服务器运行日志
  - error-*.log          错误日志
`);
}

// 主函数
function main(): void {
  switch (command) {
    case "list":
      listLogs();
      break;

    case "view":
      const filename = args[1];
      if (!filename) {
        console.log("❌ 请指定要查看的日志文件名");
        return;
      }
      viewLog(filename, options.lines ? parseInt(options.lines) : 50);
      break;

    case "tail":
      const tailFilename = args[1];
      if (!tailFilename) {
        console.log("❌ 请指定要监控的日志文件名");
        return;
      }
      tailLog(tailFilename);
      break;

    case "clean":
      const days = args[1] ? parseInt(args[1]) : 30;
      cleanLogs(days);
      break;

    case "help":
    case "--help":
    case "-h":
      showHelp();
      break;

    default:
      console.log("❌ 未知命令:", command);
      console.log('使用 "npx tsx scripts/view-logs.ts help" 查看帮助');
      break;
  }
}

// 运行主函数
main();
