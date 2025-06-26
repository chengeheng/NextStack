# 日志系统使用说明

本项目集成了完整的日志系统，使用 **winston** 作为主要的日志库，支持HTTP请求日志和服务器运行日志的记录。

## 功能特性

- ✅ **HTTP请求日志**：记录所有HTTP请求的详细信息
- ✅ **服务器运行日志**：记录服务器启动、关闭、错误等运行状态
- ✅ **日志轮转**：自动按日期轮转日志文件，避免单个文件过大
- ✅ **日志压缩**：自动压缩旧日志文件，节省磁盘空间
- ✅ **日志级别**：支持不同级别的日志（error、warn、info、debug）
- ✅ **日志查看工具**：提供命令行工具和API接口查看日志
- ✅ **日志清理**：自动清理过期日志文件

## 日志文件结构

日志文件存储在 `logs/` 目录下，按类型和日期分类：

```
logs/
├── http-2024-01-01.log      # HTTP请求日志
├── http-2024-01-02.log
├── server-2024-01-01.log    # 服务器运行日志
├── server-2024-01-02.log
├── error-2024-01-01.log     # 错误日志
└── error-2024-01-02.log
```

## 日志格式

每条日志包含以下信息：

- **时间戳**：精确到秒的时间
- **日志级别**：ERROR、WARN、INFO、DEBUG
- **消息内容**：具体的日志信息
- **元数据**：额外的上下文信息（如IP地址、用户ID等）

示例：

```
2024-01-01 12:00:00 [INFO]: HTTP Request Started {"method":"GET","url":"/api/users","clientIP":"127.0.0.1","userAgent":"Mozilla/5.0..."}
2024-01-01 12:00:01 [INFO]: HTTP Request Completed {"method":"GET","url":"/api/users","statusCode":200,"responseTime":"45.23ms"}
2024-01-01 12:00:02 [ERROR]: Database connection failed {"error":"Connection timeout","stack":"..."}
```

## 使用方法

### 1. 在代码中使用日志

```typescript
import { log } from "../utils/logger";

// 记录不同级别的日志
log.info("用户登录成功", { userId: "123", username: "admin" });
log.warn("密码尝试次数过多", { username: "admin", attempts: 5 });
log.error("数据库连接失败", { error: "Connection timeout" });
log.debug("调试信息", { requestId: "abc123" });

// 记录HTTP请求日志
log.http("API调用", { endpoint: "/api/users", method: "GET" });
```

### 2. 命令行查看日志

```bash
# 查看所有日志文件
npm run logs:list

# 查看指定日志文件（最后50行）
npm run logs:view http-2024-01-01.log

# 查看指定日志文件（最后100行）
npm run logs:view http-2024-01-01.log --lines=100

# 实时监控日志文件
npm run logs:tail server-2024-01-01.log

# 清理30天前的日志文件
npm run logs:clean 30

# 查看帮助
npm run logs:help
```

### 3. API接口查看日志

```bash
# 获取日志统计信息
GET /api/logs/stats

# 获取HTTP请求日志
GET /api/logs/http?lines=100&level=ERROR&search=error

# 获取服务器运行日志
GET /api/logs/server?startDate=2024-01-01&endDate=2024-01-02

# 获取错误日志
GET /api/logs/error?lines=50

# 获取所有日志
GET /api/logs/all?search=login

# 清理旧日志文件
DELETE /api/logs/clean?days=30
```

### 4. API参数说明

- `lines`: 返回最后几行日志（默认全部）
- `level`: 过滤日志级别（ERROR、WARN、INFO、DEBUG）
- `search`: 搜索关键词
- `startDate`: 开始日期（YYYY-MM-DD格式）
- `endDate`: 结束日期（YYYY-MM-DD格式）
- `days`: 清理多少天前的日志文件

## 配置说明

### 日志配置（server/utils/logger.ts）

```typescript
// 日志文件配置
const httpLogTransport = new DailyRotateFile({
  filename: path.join(logsDir, "http-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true, // 自动压缩
  maxSize: "20m", // 单个文件最大20MB
  maxFiles: "14d", // 保留14天
  level: "info",
});
```

### 环境变量

```bash
# 设置日志级别（production环境下默认为info）
NODE_ENV=production

# 自定义日志目录（可选）
LOG_DIR=/path/to/logs
```

## 日志中间件

### HTTP请求日志中间件

自动记录所有HTTP请求的详细信息：

- 请求方法、URL、状态码
- 客户端IP地址、User-Agent
- 请求和响应大小
- 响应时间
- 时间戳

### 错误日志中间件

自动捕获和记录所有未处理的错误：

- 错误类型、消息、堆栈信息
- 请求上下文信息
- 时间戳

## 性能考虑

- **异步写入**：日志写入不会阻塞主线程
- **批量写入**：winston会自动批量写入日志
- **文件轮转**：避免单个日志文件过大
- **压缩存储**：自动压缩旧日志文件

## 监控和维护

### 定期清理

建议定期清理旧日志文件以节省磁盘空间：

```bash
# 每周清理30天前的日志
npm run logs:clean 30
```

### 磁盘空间监控

监控 `logs/` 目录的磁盘使用情况：

```bash
# 查看日志目录大小
du -sh logs/

# 查看日志文件统计
npm run logs:list
```

### 日志分析

可以使用日志分析工具（如ELK Stack）进行更深入的日志分析：

```bash
# 导出日志进行分析
cat logs/http-*.log > all-http-logs.log
cat logs/error-*.log > all-error-logs.log
```

## 故障排除

### 常见问题

1. **日志文件不生成**

   - 检查 `logs/` 目录是否存在
   - 检查文件写入权限
   - 检查磁盘空间

2. **日志文件过大**

   - 调整 `maxSize` 配置
   - 调整 `maxFiles` 配置
   - 手动清理旧文件

3. **日志级别不正确**
   - 检查 `NODE_ENV` 环境变量
   - 检查日志配置中的 `level` 设置

### 调试模式

在开发环境下，日志会同时输出到控制台和文件：

```bash
NODE_ENV=development npm run dev
```

## 扩展功能

### 自定义日志格式

可以在 `server/utils/logger.ts` 中修改日志格式：

```typescript
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    // 自定义格式
    return `${timestamp} [${level}]: ${message} ${JSON.stringify(meta)}`;
  })
);
```

### 添加新的日志传输器

可以添加其他传输器，如发送到远程服务器：

```typescript
import winston from "winston";

const logger = winston.createLogger({
  transports: [
    // 文件传输器
    new winston.transports.File({ filename: "error.log", level: "error" }),
    // 控制台传输器
    new winston.transports.Console(),
    // 远程传输器（需要额外配置）
    // new winston.transports.Http({ host: 'localhost', port: 8080 })
  ],
});
```

## 最佳实践

1. **合理使用日志级别**

   - ERROR：系统错误，需要立即处理
   - WARN：警告信息，需要注意
   - INFO：一般信息，记录重要操作
   - DEBUG：调试信息，仅在开发环境使用

2. **包含有用的上下文信息**

   ```typescript
   log.error("用户操作失败", {
     userId: user.id,
     action: "login",
     error: error.message,
     timestamp: new Date().toISOString(),
   });
   ```

3. **避免记录敏感信息**

   - 不要记录密码、token等敏感信息
   - 对敏感数据进行脱敏处理

4. **定期检查和清理**
   - 定期检查日志文件大小
   - 定期清理过期日志
   - 监控日志系统性能

## 相关文件

- `server/utils/logger.ts` - 日志配置
- `server/middlewares/logger-middleware.ts` - 日志中间件
- `server/utils/logViewer.ts` - 日志查看工具
- `server/routers/logRouter.ts` - 日志API接口
- `scripts/view-logs.ts` - 命令行日志工具
