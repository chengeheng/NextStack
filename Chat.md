# 即时通讯系统架构设计

## 概述

本项目实现了一个完整的即时通讯(IM)系统，支持多用户、多房间的实时聊天功能。

## 技术栈

- **前端**: Next.js 14, React, TypeScript, Redux Toolkit
- **后端**: Node.js, Express, Socket.IO
- **数据库**: MongoDB, Mongoose
- **实时通信**: Socket.IO
- **状态管理**: Redux Toolkit

## 系统架构

### 1. 前端架构

#### 1.1 状态管理 (Redux Toolkit)

- **用户状态** (`client/store/slices/userSlice.ts`): 管理用户登录状态和用户信息
- **聊天状态** (`client/store/slices/chatSlice.ts`): 管理聊天相关的所有状态
  - 房间列表
  - 当前房间
  - 消息历史
  - 未读消息计数
  - 输入状态
  - 在线用户

#### 1.2 Socket工具 (`client/utils/chat/socket.ts`)

- 封装Socket.IO连接管理
- 提供统一的WebSocket事件处理接口
- 支持自动重连和错误处理
- 单例模式确保全局唯一连接

#### 1.3 聊天Hook (`client/hooks/useChat.ts`)

- 整合Redux状态和Socket连接
- 提供聊天相关的所有操作方法
- 自动处理用户认证和房间管理

#### 1.4 组件结构

```
app/admin/chat/
├── page.tsx              # 主聊天页面
├── roomList.tsx          # 房间列表组件
├── chatArea.tsx          # 聊天区域组件
└── createRoomDialog.tsx  # 创建房间对话框
```

### 2. 后端架构

#### 2.1 数据模型

- **用户模型** (`server/models/userModel.ts`): 用户信息
- **房间模型** (`server/models/roomModel.ts`): 聊天房间
- **消息模型** (`server/models/messageModel.ts`): 聊天消息

#### 2.2 API路由

- **认证路由** (`server/routers/auth.ts`): 用户登录注册
- **用户路由** (`server/routers/userRouter.ts`): 用户管理
- **聊天路由** (`server/routers/chatRouter.ts`): 聊天功能

#### 2.3 WebSocket服务 (`server/services/websocketService.ts`)

- 实时消息推送
- 用户状态管理
- 房间事件处理

## 数据模型设计

### 1. 用户模型 (User)

```typescript
interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  status: "online" | "offline" | "away";
  lastSeen: Date;
}
```

### 2. 房间模型 (Room)

```typescript
interface Room {
  _id: string;
  name: string;
  type: "private" | "group" | "channel";
  description?: string;
  avatar?: string;
  members: Member[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. 消息模型 (Message)

```typescript
interface Message {
  _id: string;
  roomId: string;
  senderId: string;
  type: "text" | "image" | "file" | "system";
  content: string;
  metadata?: any;
  replyTo?: string;
  readBy: string[];
  createdAt: Date;
}
```

### 4. 成员模型 (Member)

```typescript
interface Member {
  userId: string;
  role: "admin" | "moderator" | "member";
  joinedAt: Date;
  lastReadAt?: Date;
}
```

## API设计

### 1. 房间管理

```
GET    /api/chat/rooms              # 获取用户房间列表
POST   /api/chat/rooms/create       # 创建新房间
GET    /api/chat/rooms/:id          # 获取房间详情
PUT    /api/chat/rooms/:id          # 更新房间信息
DELETE /api/chat/rooms/:id          # 删除房间
POST   /api/chat/rooms/:id/join     # 加入房间
POST   /api/chat/rooms/:id/leave    # 离开房间
```

### 2. 消息管理

```
GET    /api/chat/rooms/:id/messages     # 获取房间消息
POST   /api/chat/messages               # 发送消息
PUT    /api/chat/messages/:id/read      # 标记消息已读
DELETE /api/chat/messages/:id           # 删除消息
```

## WebSocket协议

### 1. 客户端事件

```typescript
// 认证
socket.emit('authenticate', { userId: string, token: string });

// 房间操作
socket.emit('join_room', { roomId: string });
socket.emit('leave_room', { roomId: string });

// 消息操作
socket.emit('send_message', messageData);
socket.emit('message_read', { roomId: string, messageIds: string[] });

// 输入状态
socket.emit('typing_start', { roomId: string });
socket.emit('typing_end', { roomId: string });
```

### 2. 服务器事件

```typescript
// 认证结果
socket.on('authenticated', { success: boolean, error?: string });

// 消息推送
socket.on('message', { type: 'message', data: IMessage });

// 命令推送
socket.on('command', { type: 'command', data: ICommand });
```

### 3. 命令类型

```typescript
enum CommandType {
  USER_JOIN = "user_join",
  USER_LEAVE = "user_leave",
  TYPING_START = "typing_start",
  TYPING_END = "typing_end",
  MESSAGE_READ = "message_read",
  ROOM_UPDATE = "room_update",
}
```

## 关键特性

### 1. 实时通信

- WebSocket长连接
- 自动重连机制
- 消息实时推送
- 输入状态同步

### 2. 状态管理

- Redux Toolkit统一状态管理
- 异步操作处理
- 状态持久化
- 类型安全

### 3. 用户体验

- 响应式设计
- 加载状态提示
- 错误处理
- 离线支持

### 4. 安全性

- JWT认证
- 用户权限控制
- 输入验证
- XSS防护

## 部署说明

### 1. 环境要求

- Node.js 18+
- MongoDB 5+
- Redis (可选，用于会话存储)

### 2. 环境变量

```env
MONGODB_URI=mongodb://localhost:27017/chat
JWT_SECRET=your-jwt-secret
PORT=3000
```

### 3. 启动命令

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 生产模式
pnpm build
pnpm start
```

## 扩展性设计

### 1. 消息类型扩展

- 支持图片、文件、语音消息
- 富文本消息
- 系统消息

### 2. 房间功能扩展

- 房间权限管理
- 房间分类
- 房间搜索

### 3. 用户功能扩展

- 好友系统
- 用户状态
- 消息通知

### 4. 性能优化

- 消息分页加载
- 图片压缩
- 缓存策略

## 故障排除

### 1. 连接问题

- 检查WebSocket服务器状态
- 验证网络连接
- 查看浏览器控制台错误

### 2. 认证问题

- 检查JWT token有效性
- 验证用户登录状态
- 查看服务器日志

### 3. 消息问题

- 检查数据库连接
- 验证消息格式
- 查看WebSocket事件日志
