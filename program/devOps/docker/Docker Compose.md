# Docker 进阶



## Docker Compose

DockerFile build run 手动操作，单个容器，n多个微服务，依赖关系，难以操作。

轻松高效管理容器。定义运行多个容器。

**批量容器编排。**



### Compose三步骤

1. DockerFile保证我们的项目在任何地方可以运行
2. docker-compose.yml
3. 启动 `docker-compose up`



### 安装

1. 下载

```shell
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 国内地址
curl -L https://get.daocloud.io/docker/compose/releases/download/1.29.2/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
```



2. 授权

```shell
sudo chmod +x /usr/local/bin/docker-compose
```



3. 查看是否安装成功

```shell
[root@VM-0-9-centos bin]# docker-compose version
docker-compose version 1.29.2, build 5becea4c
docker-py version: 5.0.0
CPython version: 3.7.10
OpenSSL version: OpenSSL 1.1.0l  10 Sep 2019

```



### 初体验

官方demo：python计数器应用。

#### 1. 创建应用

```shell
# 创建目录
[root@VM-0-9-centos home]# mkdir composetest
[root@VM-0-9-centos home]# cd composetest/

# 创建app.py
vim app.py
-----
import time

import redis
from flask import Flask

app = Flask(__name__)
cache = redis.Redis(host='redis', port=6379)

def get_hit_count():
    retries = 5
    while True:
        try:
            return cache.incr('hits')
        except redis.exceptions.ConnectionError as exc:
            if retries == 0:
                raise exc
            retries -= 1
            time.sleep(0.5)

@app.route('/')
def hello():
    count = get_hit_count()
    return 'Hello World! I have been seen {} times.\n'.format(count)

# 创建requirements.txt 
flask
redis
```



#### 2. 创建DockerFile

```shell
# syntax=docker/dockerfile:1
FROM python:3.7-alpine
WORKDIR /code
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
RUN apk add --no-cache gcc musl-dev linux-headers
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
EXPOSE 5000
COPY . .
CMD ["flask", "run"]
```



#### 3. Compose中定义services

```shell
vim docker-compose.yml
---
version: "3.9"
services:
  web:
    build: .
    ports:
      - "8000:5000"
  redis:
    image: "redis:alpine"
```



```shell
[root@VM-0-9-centos composetest]# ll
total 16
-rw-r--r-- 1 root root 514 Apr 15 00:04 app.py
-rw-r--r-- 1 root root 111 Apr 15 00:08 docker-compose.yml
-rw-r--r-- 1 root root 278 Apr 15 00:07 Dockerfile
-rw-r--r-- 1 root root  12 Apr 15 00:05 requirements.txt

```



#### 4. 构建

```shell
docker-compose up
---

[root@VM-0-9-centos ~]# docker ps
CONTAINER ID   IMAGE             COMMAND                  CREATED              STATUS              PORTS                                       NAMES
0adfcdb14748   composetest_web   "flask run"              About a minute ago   Up About a minute   0.0.0.0:8000->5000/tcp, :::8000->5000/tcp   composetest_web_1
ae7ca75cd778   redis:alpine      "docker-entrypoint.s…"   About a minute ago   Up About a minute   6379/tcp                                    composetest_redis_1
---

[root@VM-0-9-centos ~]# curl localhost:8000
Hello World! I have been seen 1 times.
[root@VM-0-9-centos ~]# curl localhost:8000
Hello World! I have been seen 2 times.
[root@VM-0-9-centos ~]# curl localhost:8000
Hello World! I have been seen 3 times.
[root@VM-0-9-centos ~]# curl localhost:8000
Hello World! I have been seen 4 times.
[root@VM-0-9-centos ~]# 

# 成功！
```



#### 5. 停止

```shell
docker-compose down
Ctrl + c
```



### Yaml规则

[官方文档](https://docs.docker.com/compose/compose-file/build/)

```shell
# 3层
version: # 版本

services: # 服务
	# 服务1
	web
		images
		build
		network
    # 服务2
    redis

# 其他配置
volumes...
networks...
configs...
```



### 实战：启动一个WordPress博客

```shell
# 1. 创建项目
mkdir my_wordpress
cd my_wordpress/

# 2. 创建docker-compose.yml
version: "3.9"
    
services:
  db:
    image: mysql:5.7
    volumes:
      - db_data:/var/lib/mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: somewordpress
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress
    
  wordpress:
    depends_on:
      - db
    image: wordpress:latest
    volumes:
      - wordpress_data:/var/www/html
    ports:
      - "8000:80"
    restart: always
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress
volumes:
  db_data: {}
  wordpress_data: {}
  
# 3. 启动
docker-compose up -d

# 4. 访问
http://localhost:8000
```









## Docker Swarm

集群的方式部署。