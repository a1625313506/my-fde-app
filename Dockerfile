# 🌟 第一阶段：用 Node 环境编译前端代码
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 🌟 第二阶段：用 Nginx 运行编译好的产物
FROM nginx:alpine
# 把上一步编译出来的 dist 文件夹里的东西，复制到 Nginx 的默认目录
COPY --from=build /app/dist /usr/share/nginx/html
# 把咱们写的 Nginx 配置文件替换掉默认的
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]