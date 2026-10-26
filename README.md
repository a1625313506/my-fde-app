# 🤖 My AI Assistant (Frontend)

一个基于 React + Tailwind CSS 开发的现代化 AI 聊天助手前端。支持流式打字机效果与丝滑的用户交互体验。

## 🚀 技术栈
- **框架**: React 18 + TypeScript + Vite
- **样式**: Tailwind CSS
- **通信**: Fetch API + ReadableStream (SSE 流式解析)

## ✨ 核心功能
- **打字机效果**：实时解析并渲染大模型流式数据，体验对标 ChatGPT。
- **乐观更新**：消息发送即时上屏，无需等待网络。
- **状态管理**：Loading 动画、防连点禁用、多角色气泡样式区分。

## 📦 本地运行
1. `npm install`
2. `npm run dev`

> 注意：请确保后端服务已在 `localhost:8000` 启动。
> 后端仓库：[点击访问](https://github.com/a1625313506/my-fde-backend)