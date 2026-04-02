FROM node:22-slim
WORKDIR /app
RUN npm init -y && npm install @modelcontextprotocol/sdk@latest
COPY proxy.mjs .
CMD ["node", "proxy.mjs"]
