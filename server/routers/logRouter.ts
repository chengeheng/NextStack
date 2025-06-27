import { Router } from "express";
import { logViewer } from "../utils/logViewer";
import { log } from "../utils/logger";

const router = Router();

// 获取日志统计信息
router.get("/stats", (req, res) => {
  try {
    const stats = logViewer.getLogStats();
    log.info("Log stats requested", { clientIP: req.ip });
    res.success(stats);
  } catch (error) {
    log.error("Error getting log stats", {
      clientIP: req.ip,
      error: error instanceof Error ? error.message : String(error),
    });
    res.error(1, "获取日志统计信息失败", error);
  }
});

// 获取HTTP请求日志
router.get("/http", (req, res) => {
  try {
    const { lines, level, search, startDate, endDate } = req.query;
    const options = {
      lines: lines ? parseInt(lines as string) : undefined,
      level: level as string,
      search: search as string,
      startDate: startDate as string,
      endDate: endDate as string,
    };

    const logs = logViewer.getHttpLogs(options);
    log.info("HTTP logs requested", {
      clientIP: req.ip,
      options,
      count: logs.length,
    });
    res.success({ logs, count: logs.length });
  } catch (error) {
    log.error("Error getting HTTP logs", {
      clientIP: req.ip,
      error: error instanceof Error ? error.message : String(error),
    });
    res.error(1, "获取HTTP日志失败", error);
  }
});

// 获取服务器运行日志
router.get("/server", (req, res) => {
  try {
    const { lines, level, search, startDate, endDate } = req.query;
    const options = {
      lines: lines ? parseInt(lines as string) : undefined,
      level: level as string,
      search: search as string,
      startDate: startDate as string,
      endDate: endDate as string,
    };

    const logs = logViewer.getServerLogs(options);
    log.info("Server logs requested", {
      clientIP: req.ip,
      options,
      count: logs.length,
    });
    res.success({ logs, count: logs.length });
  } catch (error) {
    log.error("Error getting server logs", {
      clientIP: req.ip,
      error: error instanceof Error ? error.message : String(error),
    });
    res.error(1, "获取服务器日志失败", error);
  }
});

// 获取错误日志
router.get("/error", (req, res) => {
  try {
    const { lines, level, search, startDate, endDate } = req.query;
    const options = {
      lines: lines ? parseInt(lines as string) : undefined,
      level: level as string,
      search: search as string,
      startDate: startDate as string,
      endDate: endDate as string,
    };

    const logs = logViewer.getErrorLogs(options);
    log.info("Error logs requested", {
      clientIP: req.ip,
      options,
      count: logs.length,
    });
    res.success({ logs, count: logs.length });
  } catch (error) {
    log.error("Error getting error logs", {
      clientIP: req.ip,
      error: error instanceof Error ? error.message : String(error),
    });
    res.error(1, "获取错误日志失败", error);
  }
});

// 获取所有日志
router.get("/all", (req, res) => {
  try {
    const { lines, level, search, startDate, endDate } = req.query;
    const options = {
      lines: lines ? parseInt(lines as string) : undefined,
      level: level as string,
      search: search as string,
      startDate: startDate as string,
      endDate: endDate as string,
    };

    const logs = logViewer.getAllLogs(options);
    log.info("All logs requested", {
      clientIP: req.ip,
      options,
      count: logs.length,
    });
    res.success({ logs, count: logs.length });
  } catch (error) {
    log.error("Error getting all logs", {
      clientIP: req.ip,
      error: error instanceof Error ? error.message : String(error),
    });
    res.error(1, "获取所有日志失败", error);
  }
});

// 清理旧日志文件
router.delete("/clean", (req, res) => {
  try {
    const { days = 30 } = req.query;
    const daysToKeep = parseInt(days as string);

    if (isNaN(daysToKeep) || daysToKeep < 1) {
      return res.error(1, "无效的天数参数");
    }

    const result = logViewer.cleanOldLogs(daysToKeep);
    log.info("Log cleanup completed", {
      clientIP: req.ip,
      daysToKeep,
      deletedFiles: result.deletedFiles.length,
      errorFiles: result.errorFiles.length,
    });
    res.success(result);
  } catch (error) {
    log.error("Error cleaning old logs", {
      clientIP: req.ip,
      error: error instanceof Error ? error.message : String(error),
    });
    res.error(1, "清理旧日志失败", error);
  }
});

export default router;
