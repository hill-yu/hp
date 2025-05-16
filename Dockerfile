FROM crpi-h8sgno287s1y36v4.us-west-1.personal.cr.aliyuncs.com/kelidu888/gemblitz:node-21.7.1-slim as BUILD
# 设置环境变量
# ARG VITE_MODE
# ENV VITE_MODE=${VITE_MODE}
WORKDIR /app
COPY ["package.json", "./"]
#COPY ["package-lock.json", "./"]

RUN npm install
COPY . /app/
WORKDIR /app

# RUN npm run build -- --mode $VITE_MODE
# RUN npm run build -- --mode development
RUN npm run build

CMD ["npm", "run", "preview"]

EXPOSE 3000