[TOC]

云服务环境下的虚拟化容器技术。

### Docker 和云服务的关系

- **IaaS** 基础设施即服务： 阿里云服务器，腾讯云服务器
- **Paas** 平台即服务： Mysql，nginx，rocketmq，MongoDB，redis 等 - Docker 是基于 PaaS 的容器技术
- **Saas** 软件即服务： OA，钉钉，大象

### 虚拟化技术

对物理机资源（服务器，网络，内存及存储）进行更加合理有效的利用，可以将一台物理机器虚拟化出很多个完整的操作系统，并且相互独立的“虚拟计算机”。

可以打破实体结构不可切割的障碍，使用户可以比原本的组态更好的方式来应用这些资源（对资源进行合理的重组）。

虚拟技术种类有很多：软件虚拟化，硬件虚拟化，内存虚拟化，网络虚拟化，桌面虚拟化，服务虚拟化，虚拟机等。

最常用的虚拟化技术有：全虚拟化和操作系统虚拟化。

#### 全虚拟化(硬件虚拟化)

宿主机的操作系统和虚拟机中的操作系统无关。

VMware 是硬件虚拟化的实现。

#### OS 虚拟化

宿主机的操作系统和 Docker 中的操作系统是同一系列（比如宿主机是 Linux，Docker 只能是 centos,ubuntu）。

Docker 是基于操作系统虚拟化技术的实现。

#### 虚拟机和 Docker 对比

Docker 有更显著的优势，是虚拟化技术的未来。

- size： VM 大（4,5G），docker 很小（几百兆）
- startup：启动速度 Docker 快的多(秒级)，而虚拟机和真实机器启动速度差不多(分钟级)
- intergration：迁移和扩展

1. 启动速度快
2. 系统资源消耗低，一台 Linux 服务器合一运行成千上百个 Docker，而 VMware 大概只能运行 10 个左右
3. 更轻松的迁移和扩展，Docker 比 VMware 占用更少的硬盘空间，在需要搭建几套软件环境的情况下， 对安装好的 Docker 容器纪行迁移会更快捷，更方便。而且 Docker 容器几乎可以在任意的平台上运行，包括虚拟机，物理机，公有云，私有云，个人电脑等，这种兼容性，可以让用户将一个应用程序从一个平台直接迁移到另一个平台上

### Docker 能做什么

- 职责分类：开发人员只需要关心容器中运行的应用程度，而运维人员只需要关系如何管理容器。Docker 设计的目的就是要加强开发人员开发环境与应用程序要部署的生产环境的一致性。
- 高效的生命周期：缩短从开发，测试到部署，上线运行的周期。让你的应用程序具备可移植性，易于构建，易于协作。
- 鼓励使用面向服务的架构(自动化部署)：微服务架构，容易形成分布式的程序模型

### 核心概念

- 镜像 Image - 像类
- 容器 Container - 像实例
- 仓库注册中心 Registry - 分为私有(用户可以在本地创建一个私有 Registry)和公有(DockerHub，国内 USTC，网易云，DaoCloud，AliCloud)
- 仓库 Repository

![Docker核心概念](docker-image.png)

一个 Registry 中有多个 Repo，一个 Repo 中有多个不同 tag 的 Image

### 安装（云服务器）

```bash
#1. 卸载旧的
yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine

#2. 安装仓库
yum install -y yum-utils

#3. 设置镜像的仓库
yum-config-manager \
    --add-repo \
    http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo #阿里云镜像
    https://download.docker.com/linux/centos/docker-ce.repo #默认是国外的，搜索国内镜像

# 更新yum软件包索引
yum makecache fast

#4. 安装Docker相关内容，ce是社区版
yum install docker-ce docker-ce-cli containerd.io

#5. 启动Docker
systemctl start docker
systemctl restart docker

#6. 查看Docker版本，可以确认安装成功
docker version

#7. 测试Docker
docker run hello-world #一般会先拉取image
#如果出现 Hello from Docker！

#8. 查看下载的hello-world镜像
docker images

#9. 卸载，卸载依赖，删除资源
yum remove docker-ce docker-ce-cli containerd.io
rm -rf /var/lib/docker
rm -rf /var/lib/containerd
```

### 腾讯云镜像加速

```shell
# 编辑docker配置文件
vim /etc/docker/daemon.json

# 写入以下内容
{
	"registry-mirrors": [
		"https://mirror.ccs.tencentyun.com"
	]
}

# 重启Docker
systemctl restart docker
```

### 启动详解

![Docker启动流程](docker-run.png)

### 底层原理

Docker 是一个 Client -Server 结构的系统，Docker 的守护进程运行在主机上。通过 Socket 从客户端访问！Docker Server 接收到 Docker-Client 的指令，就去执行这个命令！

## Docker 的常用命令

[官方文档](https://docs.docker.com/engine/api/)

```shell
docker version      # 显示版本信息
docker info         # 显示docker的系统信息
docker 命令 --help   # 帮助命令
```

### 镜像命令

**docker images** 查看所有本地主机上的镜像

```shell
[root@VM-0-9-centos ~]# docker images
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
hello-world   latest    feb5d9fea6a5   6 months ago   13.3kB

# 说明
REPOSITORY 镜像的仓库源
TAG        镜像的标签
IMAGE ID   镜像ID
CREATED    镜像的创建时间
SIZE       镜像大小

# 选项
  -a, --all             显示全部
  -q, --quiet           只显示id
```

**docker search** 搜索线上的镜像

```shell
[root@VM-0-9-centos ~]# docker search mysql
NAME                             DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
mysql                            MySQL is a widely used, open-source relation…   12352     [OK]
mariadb                          MariaDB Server is a high performing open sou…   4756      [OK]
mysql/mysql-server               Optimized MySQL Server Docker images. Create…   916                  [OK]
```

**docker pull** 下载镜像

```shell
[root@VM-0-9-centos ~]# docker pull mysql #可以加tag
Using default tag: latest                 #如果不加tag，默认下载最新版
latest: Pulling from library/mysql        #分层下载，docker image的核心，联合文件系统
f003217c5aae: Pull complete
65d94f01a09f: Pull complete
43d78aaa6078: Pull complete
a0f91ffbdf69: Pull complete
59ee9e07e12f: Pull complete
04d82978082c: Pull complete
70f46ebb971a: Pull complete
db6ea71d471d: Pull complete
c2920c795b25: Pull complete
26c3bdf75ff5: Pull complete
9ec1f1f78b0e: Pull complete
4607fa685ac6: Pull complete
Digest: sha256:1c75ba7716c6f73fc106dacedfdcf13f934ea8c161c8b3b3e4618bcd5fbcf195
Status: Downloaded newer image for mysql:latest
docker.io/library/mysql:latest           # 真实地址

# 这两个命令等价
docker pull mysql
docker pull docker.io/library/mysql:latest

# 指定版本下载，这个版本必须存在于hub中
docker pull mysql:5.7

[root@VM-0-9-centos ~]# docker pull mysql:5.7
5.7: Pulling from library/mysql
f003217c5aae: Already exists # 分层的高明之处，共同的部分文件就可以不用再下载
65d94f01a09f: Already exists
43d78aaa6078: Already exists
a0f91ffbdf69: Already exists
59ee9e07e12f: Already exists
04d82978082c: Already exists
70f46ebb971a: Already exists
ba61822c65c2: Pull complete
dec59acdf78a: Pull complete
0a05235a6981: Pull complete
c87d621d6916: Pull complete
Digest: sha256:1a73b6a8f507639a8f91ed01ace28965f4f74bb62a9d9b9e7378d5f07fab79dc
Status: Downloaded newer image for mysql:5.7
docker.io/library/mysql:5.7

```

**docker rmi** 删除镜像

```shell
[root@VM-0-9-centos ~]# docker rmi -f [id]
[root@VM-0-9-centos ~]# docker rmi -f mysql:5.7
Untagged: mysql:5.7
Untagged: mysql@sha256:1a73b6a8f507639a8f91ed01ace28965f4f74bb62a9d9b9e7378d5f07fab79dc
Deleted: sha256:f26e21ddd20df245d88410116241f3eef1ec49ce888856c95b85081a7250183d
Deleted: sha256:c607cd1716e1e3f52d37b391b9e48207c15b9de687c49539c42b7c7411b8a845
Deleted: sha256:18d0239fa88c234ffcde52288f532ac4f69d052964d6605df32fb2e3a197bbf9
Deleted: sha256:8d1d80a87e029e4729a56a87e38d54b9ef2ca1af404e13af1feadeba53745529
Deleted: sha256:1ac7c17dadb8b439a4034925f290a2f9288068b4192669bed1a614c4057c0c1b
[root@VM-0-9-centos ~]# docker images
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
mysql         latest    667ee8fb158e   6 days ago     521MB
hello-world   latest    feb5d9fea6a5   6 months ago   13.3kB

# 全部删除
docker rmi -f $(docker images -aq)

```

### 容器命令

> 有了镜像才能创建容器

```shell
docker pull centos
```

**docker run** 新建容器并启动

```shell
[root@VM-0-9-centos ~]# docker run [选项] images
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
hello-world   latest    feb5d9fea6a5   6 months ago   13.3kB

# 选项
--name="Name"  #给容器取个名字，用来区分容器
-d             #后台方式运作
-it            #使用容器方式，进入容器并查看内容 exit退出容器dao
	-i		   #交互式的，让容器的标准输入保持打开
	-t         #分配一个伪终端
-p             #端口映射，指定容器端口 -p 8080:8080
	-p ip:主机端口：容器端口
	-p 容器端口
	容器端口
-P             #随机指定端口
-e             #设置环境变量
```

**docker ps** 查看运行中的容器

```shell
[root@VM-0-9-centos ~]# docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES

# 选项
-a               #列出当前正在运行的容器和历史运行过的容器
-n=?             #显示最近创建的容器
-q 				 #只显示容器的ID

[root@VM-0-9-centos ~]# docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
[root@VM-0-9-centos ~]# docker ps -a
CONTAINER ID   IMAGE          COMMAND       CREATED             STATUS                         PORTS     NAMES
fa078ddf8be8   centos         "/bin/bash"   5 minutes ago       Exited (0) 3 minutes ago                 stupefied_blackburn
9dac8f49529f   feb5d9fea6a5   "/hello"      About an hour ago   Exited (0) About an hour ago             elated_noyce
[root@VM-0-9-centos ~]# docker ps -n=1
CONTAINER ID   IMAGE     COMMAND       CREATED         STATUS                     PORTS     NAMES
fa078ddf8be8   centos    "/bin/bash"   5 minutes ago   Exited (0) 3 minutes ago             stupefied_blackburn

```

#### 退出

```shell
exit #停止容器并退出
Ctrl + P + Q #不停止容器退出
```

**docker rm** 删除容器

不能删除正在运行的容器，除非使用-f

```shell
docker rm 容器id                     #删除指定容器
docker rm -f $(docker images -aq)   #删除全部容器
docker ps -a -q|xargs docker rm     #删除全部容器
```

**启动和停止容器**

不能删除正在运行的容器，除非使用-f

```shell
docker start 容器id		#启动容器
docker restart 容器id		#重启
docker stop 容器id		#停止当前正在运行的容器
docker kill 容器id		#强制停止当前容器
```

### 进阶命令

#### 后台启动容器

```shell
[root@VM-0-9-centos ~]# docker run -d centos

# 问题 docker ps 发现容器停止了
# 常见的坑：docker 容器使用后台运行，就必须要有一个前台进程，docker 发现没有应用，就会自动停止
```

#### 查看日志

```shell
[root@VM-0-9-centos ~]# docker logs -f -t --tail 10 5c4fac3e2e5d

-tf           #显示日志
--tail number #要显示number条的日志
```

#### 查看进程信息

```shell
[root@VM-0-9-centos ~]# docker top 5c4fac3e2e5d
UID                 PID                 PPID                C                   STIME               TTY                 TIME
root                29009               28990               0                   20:28               pts/0               00:00:00

```

#### 查看镜像元数据

```shell
[root@VM-0-9-centos ~]# docker inspect 5c4fac3e2e5d
[
    {
        "Id": "5c4fac3e2e5d14a9a46cf145b731933e4d26599a63454f1abf42e11190b517c4",
        "Created": "2022-04-05T12:28:26.94206886Z",
        "Path": "/bin/bash",
        "Args": [],
        "State": {
            "Status": "running",
            "Running": true,
            "Paused": false,
            "Restarting": false,
            "OOMKilled": false,
            "Dead": false,
            "Pid": 29009,
            "ExitCode": 0,
            "Error": "",
            "StartedAt": "2022-04-05T12:28:27.295131017Z",
            "FinishedAt": "0001-01-01T00:00:00Z"
        },
        "Image": "sha256:5d0da3dc976460b72c77d94c8a1ad043720b0416bfc16c52c45d4847e53fadb6",
        "ResolvConfPath": "/var/lib/docker/containers/5c4fac3e2e5d14a9a46cf145b731933e4d26599a63454f1abf42e11190b517c4/resolv.conf",
        "HostnamePath": "/var/lib/docker/containers/5c4fac3e2e5d14a9a46cf145b731933e4d26599a63454f1abf42e11190b517c4/hostname",
        "HostsPath": "/var/lib/docker/containers/5c4fac3e2e5d14a9a46cf145b731933e4d26599a63454f1abf42e11190b517c4/hosts",
        "LogPath": "/var/lib/docker/containers/5c4fac3e2e5d14a9a46cf145b731933e4d26599a63454f1abf42e11190b517c4/5c4fac3e2e5d14a9a46cf145b731933e4d26599a63454f1abf42e11190b517c4-json.log",
        "Name": "/flamboyant_heyrovsky",
        "RestartCount": 0,
        "Driver": "overlay2",
        "Platform": "linux",
        "MountLabel": "",
        "ProcessLabel": "",
        "AppArmorProfile": "",
        "ExecIDs": null,
        "HostConfig": {
            "Binds": null,
            "ContainerIDFile": "",
            "LogConfig": {
                "Type": "json-file",
                "Config": {}
            },
            "NetworkMode": "default",
            "PortBindings": {},
            "RestartPolicy": {
                "Name": "no",
                "MaximumRetryCount": 0
            },
            "AutoRemove": false,
            "VolumeDriver": "",
            "VolumesFrom": null,
            "CapAdd": null,
            "CapDrop": null,
            "CgroupnsMode": "host",
            "Dns": [],
            "DnsOptions": [],
            "DnsSearch": [],
            "ExtraHosts": null,
            "GroupAdd": null,
            "IpcMode": "private",
            "Cgroup": "",
            "Links": null,
            "OomScoreAdj": 0,
            "PidMode": "",
            "Privileged": false,
            "PublishAllPorts": false,
            "ReadonlyRootfs": false,
            "SecurityOpt": null,
            "UTSMode": "",
            "UsernsMode": "",
            "ShmSize": 67108864,
            "Runtime": "runc",
            "ConsoleSize": [
                0,
                0
            ],
            "Isolation": "",
            "CpuShares": 0,
            "Memory": 0,
            "NanoCpus": 0,
            "CgroupParent": "",
            "BlkioWeight": 0,
            "BlkioWeightDevice": [],
            "BlkioDeviceReadBps": null,
            "BlkioDeviceWriteBps": null,
            "BlkioDeviceReadIOps": null,
            "BlkioDeviceWriteIOps": null,
            "CpuPeriod": 0,
            "CpuQuota": 0,
            "CpuRealtimePeriod": 0,
            "CpuRealtimeRuntime": 0,
            "CpusetCpus": "",
            "CpusetMems": "",
            "Devices": [],
            "DeviceCgroupRules": null,
            "DeviceRequests": null,
            "KernelMemory": 0,
            "KernelMemoryTCP": 0,
            "MemoryReservation": 0,
            "MemorySwap": 0,
            "MemorySwappiness": null,
            "OomKillDisable": false,
            "PidsLimit": null,
            "Ulimits": null,
            "CpuCount": 0,
            "CpuPercent": 0,
            "IOMaximumIOps": 0,
            "IOMaximumBandwidth": 0,
            "MaskedPaths": [
                "/proc/asound",
                "/proc/acpi",
                "/proc/kcore",
                "/proc/keys",
                "/proc/latency_stats",
                "/proc/timer_list",
                "/proc/timer_stats",
                "/proc/sched_debug",
                "/proc/scsi",
                "/sys/firmware"
            ],
            "ReadonlyPaths": [
                "/proc/bus",
                "/proc/fs",
                "/proc/irq",
                "/proc/sys",
                "/proc/sysrq-trigger"
            ]
        },
        "GraphDriver": {
            "Data": {
                "LowerDir": "/var/lib/docker/overlay2/6f70909d44b65da99e432e687c0cc069391a3078b5a361ff132300fcaf873fe9-init/diff:/var/lib/docker/overlay2/7bbfbd451f26f0cb68233f94f9e88628fc417f28884a5ae28eeee0a67a7adb1a/diff",
                "MergedDir": "/var/lib/docker/overlay2/6f70909d44b65da99e432e687c0cc069391a3078b5a361ff132300fcaf873fe9/merged",
                "UpperDir": "/var/lib/docker/overlay2/6f70909d44b65da99e432e687c0cc069391a3078b5a361ff132300fcaf873fe9/diff",
                "WorkDir": "/var/lib/docker/overlay2/6f70909d44b65da99e432e687c0cc069391a3078b5a361ff132300fcaf873fe9/work"
            },
            "Name": "overlay2"
        },
        "Mounts": [],
        "Config": {
            "Hostname": "5c4fac3e2e5d",
            "Domainname": "",
            "User": "",
            "AttachStdin": true,
            "AttachStdout": true,
            "AttachStderr": true,
            "Tty": true,
            "OpenStdin": true,
            "StdinOnce": true,
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
            ],
            "Cmd": [
                "/bin/bash"
            ],
            "Image": "centos",
            "Volumes": null,
            "WorkingDir": "",
            "Entrypoint": null,
            "OnBuild": null,
            "Labels": {
                "org.label-schema.build-date": "20210915",
                "org.label-schema.license": "GPLv2",
                "org.label-schema.name": "CentOS Base Image",
                "org.label-schema.schema-version": "1.0",
                "org.label-schema.vendor": "CentOS"
            }
        },
        "NetworkSettings": {
            "Bridge": "",
            "SandboxID": "fa43081d3fbb36c039d605e28301060adc52b5e3f7baaeaecabdee69cee4993f",
            "HairpinMode": false,
            "LinkLocalIPv6Address": "",
            "LinkLocalIPv6PrefixLen": 0,
            "Ports": {},
            "SandboxKey": "/var/run/docker/netns/fa43081d3fbb",
            "SecondaryIPAddresses": null,
            "SecondaryIPv6Addresses": null,
            "EndpointID": "18700d66c9b3653baaf739aa2ae13149edae596d73f9c35af4cc6c5772f48846",
            "Gateway": "172.18.0.1",
            "GlobalIPv6Address": "",
            "GlobalIPv6PrefixLen": 0,
            "IPAddress": "172.18.0.2",
            "IPPrefixLen": 16,
            "IPv6Gateway": "",
            "MacAddress": "02:42:ac:12:00:02",
            "Networks": {
                "bridge": {
                    "IPAMConfig": null,
                    "Links": null,
                    "Aliases": null,
                    "NetworkID": "5a714081acfb09e71195bf882051d36c5f3c339f84ccc1c35ccff18d29544953",
                    "EndpointID": "18700d66c9b3653baaf739aa2ae13149edae596d73f9c35af4cc6c5772f48846",
                    "Gateway": "172.18.0.1",
                    "IPAddress": "172.18.0.2",
                    "IPPrefixLen": 16,
                    "IPv6Gateway": "",
                    "GlobalIPv6Address": "",
                    "GlobalIPv6PrefixLen": 0,
                    "MacAddress": "02:42:ac:12:00:02",
                    "DriverOpts": null
                }
            }
        }
    }
]

```

#### 进入当前正在运行的容器

```shell
# 我们通常都是使用后台方式运行的，需要进入容器，要修改一些配置
# 方式1 进入容器后打开一个新的终端，可以在里面操作
docker exec -it
[root@VM-0-9-centos ~]# docker exec -it 5c4fac3e2e5d /bin/bash
[root@5c4fac3e2e5d /]#


# 方式2 进入正在运行的命令行
docker attach 容器id
[root@VM-0-9-centos ~]# docker attach 5c4fac3e2e5d
[root@5c4fac3e2e5d /]#
```

#### 从容器内拷贝文件到主机

```shell
docker cp 容器id 主机上的目标路径
```

### 可视化

- portainer
- Rancher(CI/CD)

## 镜像详解

### 镜像是什么

是一种轻量级、可执行的独立软件包，用来打包软件运行环境和基于运行环境开发的软件，它包含运行某个软件所需要的所有内容：代码，运行时，库，环境变量和配置文件。

所有的应用，直接打包 docker 镜像，就可以直接跑起来！

如何得到镜像：

- 从远程仓库下载
- 朋友拷贝给你
- 自己做一个镜像 Dockerfile

### UnionFS 联合文件系统

它支持对文件系统的修改作为一次提交来一层层的叠加，同时可以将不同目录挂载到同一个虚拟文件系统下。UnionFS 是 Docker 镜像的基础，镜像可以通过分层来进行继承，基于基础镜像，可以制作各种具体的应用镜像。

### 镜像的分层结构

所有的 Docker 镜像都始于一个基础镜像层，当进行修改或增加新内容时，就会在当前镜像层上，创建新的镜像层。

分层结构最大好处就是资源共享。

## 容器数据卷

### 什么是容器数据卷

如果局都存在容器中，那么我们删除容器，数据就会丢失。MySQL，容器删了，删库跑路！

**需求：MySQL 数据可以存储在本地。**

容器之间可以有一个数据共享的技术，Docker 容器中产生的数据，同步到本地。

这就是卷技术，目录的挂载，将我们容器内的目录，挂载到 Linux 上。

总结：容器的持久化和同步操作，容器之间也是可以共享数据的。

### 使用数据卷

技术容器删除，挂载到主机的数据依然存在。

> 方式一： 直接使用命令来挂载 -v

```shell
[root@VM-0-9-centos /]# docker run -it -v 主机地址:Docker地址 centos /bin/bash
[root@VM-0-9-centos /]# docker run -it -v /home/test:/home centos /bin/bash

# 查看容器元数据
[root@VM-0-9-centos /]# docker inspect 151b9c96ae41
[
    {
        "Id": "151b9c96ae41e33027b09f20f64c3bd8cb0e5e7f5a09faca6ffd20ad855a58f3",
        "Mounts": [                      # 当前容器挂载的卷
            {
                "Type": "bind",
                "Source": "/home/test",  # 主机内的地址
                "Destination": "/home",  # Docker内的地址
                "Mode": "",
                "RW": true,
                "Propagation": "rprivate"
            }
        ],
]

# 主机内已自动生成同步文件存放的目录
[root@VM-0-9-centos home]# ls
test

# 进入容器并创建新的文件
[root@VM-0-9-centos test]# docker exec -it 151b9c96ae41 /bin/bash
[root@151b9c96ae41 /]# ls
bin  etc   lib	  lost+found  mnt  proc  run   srv  tmp  var
dev  home  lib64  media       opt  root  sbin  sys  usr
[root@151b9c96ae41 /]# cd home
[root@151b9c96ae41 home]# ls
[root@151b9c96ae41 home]# touch test.md
[root@151b9c96ae41 home]# read escape sequence

# 退出容器发现主机内已生成同步文件
[root@VM-0-9-centos test]# ls
test.md

# 反之，在主机中修改文件内容
[root@VM-0-9-centos test]# vim test.md
...

# 说明容器和主机已经建立同步关系，类似于双向绑定
[root@151b9c96ae41 home]# cat test.md
hello, docker

```

### 实战：MySQL 的数据持久化问题

```shell
# 获取镜像
[root@VM-0-9-centos test]# docker pull mysql:5.7

# 官方文档，配置mysql密码
docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=buzheng -d mysql:tag

# 启动容器
[root@VM-0-9-centos test]# docker run -d -p 3310:3306 -v /home/mysql/conf:/etc/mysql/conf.d -v /home/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=buzheng --name=mysql01 mysql:5.7
1e963503c1ce3d6378854f3c233ab285f22f5f4ae631f173ab39c863d9003c61

# 启动成功后 可以使用数据库连接工具来测试一下，新建一个表runoob_tbl用于测试
连接到服务器的 3310

# 进入主机查看
[root@VM-0-9-centos home]# cd /home/mysql/data
[root@VM-0-9-centos data]# cd testdb/
[root@VM-0-9-centos testdb]# ls
db.opt  runoob_tbl.frm  runoob_tbl.ibd

```

### 具名和匿名挂载

```shell
# 具名挂载，-v之后指定了卷的名字  name:map-file
[root@VM-0-9-centos /]# docker run -d -P --name nginx02 -v named-nginx:/etc/nginx nginx

# 匿名挂载，-v后只跟容器内路径
[root@VM-0-9-centos /]# docker run -d -P --name mysql02 -v mysql/data mysql:5.7

# 查看全部卷
[root@VM-0-9-centos /]# docker volume ls
DRIVER    VOLUME NAME
local     3824b4320bc30d0a797fbbe10bf2f4394cdf627a81e20e3cbc1133bb889bccc9 # 匿名
local     8618db5b63dbfd444c80d3086c686a6c8c19e00ac2c2920ff655fd99827d7851
local     named-nginx # 具名

# 查看具名卷的元数据
[root@VM-0-9-centos /]# docker volume inspect named-nginx
[
    {
        "CreatedAt": "2022-04-06T18:37:40+08:00",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/named-nginx/_data",
        "Name": "named-nginx",
        "Options": null,
        "Scope": "local"
    }
]
```

所有的 docker 容器内的卷，没有指定目录的情况下都是在 `/var/lib/docker/volumes/xxx/_data`下

> 如何确定是匿名挂载还是具名挂载，还是指定路径挂载

```shell
-v 容器内路径		# 匿名挂载
-v 卷名:容器内路径		# 具名挂载、
-v /主机路径:容器内路径		# 指定路径挂载
```

拓展：

```shell
# 通过-v容器内路径:ro/rw 改变读写权限
# 一旦设置了容器权限，容器对我们挂载出来的内容就有限定了
# ro read only 只能通过宿主机来操作，容器内部无法操作
docker run -d -P --name nginx01 -v myNginx:/etc/nginx:ro nginx
docker run -d -P --name nginx01 -v myNginx:/etc/nginx:rw nginx
```

### 初识 DockerFile

Dockerfile 就是用来构建 docker 镜像的构建文件。

通过这个脚本可以生成镜像，镜像是一层一层的，所以这个脚本就是一个个的命令，每个命令都代表一层镜像。

假设构建镜像时候没有挂载卷，就要通过方式一-v 来手动挂载。

> 方式二

```shell
[root@VM-0-9-centos /]# cd home
[root@VM-0-9-centos home]# mkdir docker-test-volume
[root@VM-0-9-centos home]# cd docker-test-volume/
# 编写dockerfile 文件
[root@VM-0-9-centos docker-test-volume]# vim dockerfile1
[root@VM-0-9-centos docker-test-volume]# cat dockerfile1
FROM centos

VOLUME ["volume1, volume2"]

CMD echo "-----end-----"
CMD /bin/bash
[root@VM-0-9-centos docker-test-volume]# docker build -f dockerfile1 -t buzhengcentos:0.1 .
Sending build context to Docker daemon  2.048kB

# 这里的每一个步骤，都是一层镜像
Step 1/4 : FROM centos
 ---> 5d0da3dc9764
Step 2/4 : VOLUME ["volume1,volume2"]
 ---> Running in 591535dac11e
Removing intermediate container 591535dac11e
 ---> fd0cb21e5135
Step 3/4 : CMD echo "-----end-----"
 ---> Running in 6f6186ad03bb
Removing intermediate container 6f6186ad03bb
 ---> 99c4aefa784c
Step 4/4 : CMD /bin/bash
 ---> Running in c34432831026
Removing intermediate container c34432831026
 ---> 65683d47144f
Successfully built 65683d47144f
Successfully tagged buzhengcentos:0.1

# 进入自己的容器内部
[root@VM-0-9-centos docker-test-volume]# docker run -it 65683d47144f /bin/bash
[root@dbe4a167417d /]# ls -l
total 52
lrwxrwxrwx  1 root root    7 Nov  3  2020  bin -> usr/bin
...
drwxr-xr-x 20 root root 4096 Sep 15  2021  var
drwxr-xr-x  2 root root 4096 Apr  6 11:06  volume1 # 这就是刚刚生成镜像时自动挂载的volume，这个卷和外部一定是有一个目录是同步的
drwxr-xr-x  2 root root 4096 Apr  6 11:06  volume2
```

### 数据卷容器

通过`--volumes-from`实现

多个容器同步数据。

可以用来实现容器之间配置信息的传递。

数据卷容器的生命周期一直持续到没有容器使用为止。数据卷容器删除了，其他容器内的数据也依然存在(双向拷贝的概念，副本)。如果持久化到本地，就一直会存在。

![数据卷容器](docker-volume-container.png)

```shell
docker run -it --name docker02 --volumes-from docker1 buzhengcentos:0.1
# 很类似于类概念里的extend
```

#### 实战：多个 MySQL 实现数据共享

```shell
[root@VM-0-9-centos /]# docker run -d -p 3310:3306 -v /var/lib/mysql -e MYSQL_ROOT_PASSWORD=buzheng --name mysql01 mysql:5.7

[root@VM-0-9-centos /]# docker run -d -P -e MYSQL_ROOT_PASSWORD=buzheng --name mysql02 --volumes-from mysql01 mysql:5.7

        "Mounts": [
            {
                "Type": "bind",
                "Source": "/home/mysql/data",
                "Destination": "/var/lib/mysql",
                "Mode": "",
                "RW": true,
                "Propagation": "rprivate"
            }
        ],
```

## DockerFile

Dockerfile 就是用来构建 docker 镜像的构建文件。是一个命令参数脚本。

> 构建步骤
>
> 1. 编写一个 Dockerfile 文件
> 2. docker build 构建成为一个镜像
> 3. docker run 运行镜像
> 4. docker push 发布镜像（DockerHub，阿里云镜像仓库...）

很多官方镜像都是基础包，很多功能没有，我们通常会自己构建镜像。

Dockerfile 是面向开发的，我们以后要发布项目，做镜像，就需要编写 Dockerfile

Dockerfile 镜像逐渐成为企业交付的标准，必须掌握的技能。

### Dockerfile 构建过程

基础知识：

1. 每个关键字（指令）都是大写
2. 执行从上到下顺序执行
3. #表示注释
4. 每一个指令都会创建一层镜像并提交

- Dockerfile：构建文件，定义了一切的步骤，源代码
- DokcerImages：通过 Dockerfile 构建生成的镜像，最终发布和运行的产品
- Docker 容器：容器就是镜像运行起来提供服务器

### Dockerfile 指令

Docker Hub 中 99%的镜像都是从`FROM:scratch`开始，然后配置需要的软件来构建。

```shell
FROM		# 基础镜像，一切从这里开始构建 centos ubuntu...
MAINTAINER	# 镜像的作者、维护者信息：姓名+邮箱
RUN			# 镜像构建的时候需要运行的命令
ADD			# 步骤 比如tomcat压缩包，要添加的内容
WORKDIR		# 镜像的工作目录
VOLUME		# 设置卷，挂载的主机目录
EXPOSE		# 指定对外的端口
CMD			# 指定这个容器启动的时候要运行的命令，只有最后一个会生效，可被替代
ENTRYPOINT	# 指定这个容器启动的时候要运行的命令，可以追加命令
ONBUILD		# 当构建一个被继承的镜像 DockerFile就会运行ONBUILD，触发指令
COPY		# 类似ADD，将文件拷贝到镜像中
ENV			# 构建的时候设置环境变量
```

### 实战：制作一个镜像

基于官方的 centos 制作一个支持 ifconfig/vim/pwd 命令的镜像。

```shell
# 1. 编写配置文件
FROM centos:centos7
MAINTAINER buzheng<bootcher.one@gmail.com>

ENV MYPATH /usr/local
WORKDIR	$MYPATH

RUN yum -y install vim
RUN yum -y install net-tools

EXPOSE 80

CMD echo $MYPATH
CMD echo "----end----"
CMD /bin/bash

# 2. 通过文件构建镜像
docker build -f dockerfile -t mycentosimage:0.1 .

Successfully built 68ab49e302ab
Successfully tagged mycentosimage:0.1

# 3. 测试运行
[root@VM-0-9-centos test]# docker images
REPOSITORY      TAG       IMAGE ID       CREATED          SIZE
mycentosimage   0.1       68ab49e302ab   56 seconds ago   580MB
<none>          <none>    ba835146a19f   7 minutes ago    231MB
buzhengcentos   0.1       65683d47144f   3 hours ago      231MB
mysql           5.7       f26e21ddd20d   7 days ago       450MB
nginx           latest    12766a6745ee   7 days ago       142MB
centos          centos7   eeb6ee3f44bd   6 months ago     204MB
centos          latest    5d0da3dc9764   6 months ago     231MB
[root@VM-0-9-centos test]# docker run -it mycentosimage:0.1
[root@2e77007613a0 local]# pwd
/usr/local
[root@2e77007613a0 local]# ifconfig
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.18.0.3  netmask 255.255.0.0  broadcast 172.18.255.255
        ether 02:42:ac:12:00:03  txqueuelen 0  (Ethernet)
        RX packets 8  bytes 656 (656.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

[root@2e77007613a0 local]# vim test

```

### 查看镜像历史

```shell
[root@VM-0-9-centos test]# docker history 68ab49e302ab
IMAGE          CREATED         CREATED BY                                      SIZE      COMMENT
68ab49e302ab   4 minutes ago   /bin/sh -c #(nop)  CMD ["/bin/sh" "-c" "/bin…   0B
0963e6c21fdf   4 minutes ago   /bin/sh -c #(nop)  CMD ["/bin/sh" "-c" "echo…   0B
bed4fb59b8ff   4 minutes ago   /bin/sh -c #(nop)  CMD ["/bin/sh" "-c" "echo…   0B
b989abd671af   4 minutes ago   /bin/sh -c #(nop)  EXPOSE 80                    0B
e5d03f490af0   4 minutes ago   /bin/sh -c yum -y install net-tools             161MB
e7fd36289006   4 minutes ago   /bin/sh -c yum -y install vim                   216MB
33d036186c24   4 minutes ago   /bin/sh -c #(nop) WORKDIR /usr/local            0B
c964db7d4be4   4 minutes ago   /bin/sh -c #(nop)  ENV MYPATH=/usr/local        0B
e74f5f60158f   4 minutes ago   /bin/sh -c #(nop)  MAINTAINER blcher<bootche…   0B
eeb6ee3f44bd   6 months ago    /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B
<missing>      6 months ago    /bin/sh -c #(nop)  LABEL org.label-schema.sc…   0B
<missing>      6 months ago    /bin/sh -c #(nop) ADD file:b3ebbe8bd304723d4…   204MB
```

### 实战：制作一个 Tomcat 镜像

1、准备镜像文件 tomcat 压缩包，jdk 的压缩包

2、编写 dockerfile 文件

3、docker tag 添加标签

```shell
FROM centos
MAINTAINER xxx
COPY read.txt /usr/local/readme.txt

ADD jdk-8u11-linux-x64.tar.gz /usr/local # ADD会自动解压
ADD apache-tomcat-9.0.22.tar.gz /usr/local

RUN yum -y install vim
RUN yum -y install net-tools

ENV MYPATH /usr/local
WORKDIR $MYPATH

ENV JAVA_HOME /usr/local/jdk7.8.0_11
ENV CLASSPATH $JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
ENV CATALINA_HOME /usr/local/apache-tomcat-9.0.22
ENV CATALINA_BASH /usr/local/apache-tomcat-9.0.22
ENV PATH $PATH:$JAVA_HOME/bin:$CATALINA_HOME/lib:$CATALINA_HOME/bin

EXPOSE 8080

CMD /usr/local/apache-tomcat-9.0.22/bin/startup.sh && tail -F /usr/local/apache-tomact-9.0.22/bin/logs/catalina.out
```

### 发布自己的镜像

#### Docker Hub

```shell
# 登录
docker login -p [password] -u [username]

[root@VM-0-9-centos test]# docker login -u blcher
Password:
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded


# 提交
docker push blcher/diyimage:1.0

# 提交的时候也会一层一层提交镜像
```

#### 阿里云

1、创建命名空间

2、创建容器镜像 - 选择本地仓库

3、阿里云里有详细的步骤

## 小结

![Docker概览](docker-map.png)



## Docker 网络

`ip addr` 查看本机ip信息

- 每启动一个容器，都会生成一个网卡
- evth-pair 就是一对虚拟设备接口，他们都是成对出现的，一端连着协议，另一端彼此相连，evth-pair 充当一个桥梁，连接各种虚拟网络设备
- Openstack, Docker 容器之间的连接，OVS 的连接，都是使用 evth-pair 技术

结论：Docker 容器之间可以互相 ping 通，Docker 中的所有网络接口都是虚拟的，虚拟的转发效率高(内网传文件)。只要容器删除，对应的网桥一对就没了。



### Dokcer 容器互联

--link
其实就是在 hosts 中增加一个映射
我们现在已经不建议用--link 了，因为 docker 0 是官方的，我们希望自定义网络。



### 自定义网络

> 查看所有的 docker 网络

```shell
[root@VM-0-9-centos /]# docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
45b4a6c4f8f4   bridge    bridge    local
73b6bb2bceb4   host      host      local
d6066c357881   none      null      local

```

#### 网络模式

- bridge: 桥接docker（默认）
- none：不配置网络
- host：和宿主机共享网络
- container：容器网络连通（用得少，局限性很大）



#### 测试

```shell
# 我们直接启动的命令 --net bridge，这个就是我们的docker0
docker run -P --name tomcat01 tomcat
docker run -P --name tomcat02 --net bridge tomcat
```



#### 创建网络

```shell
[root@VM-0-9-centos /]# docker network create --driver bridge --subnet 192.168.0.0/16 --gateway 192.168.0.1 mynet

# --driver bridge
# --subnet 192.168.0.0/16 子网
# --gateway 192.168.0.1 网关
# mynet 网络名称
5efd1a4bc96cf9c631f9c68e6956195f5bd0892a4ddf44652880391e77c9e577

[root@VM-0-9-centos /]# docker network inspect mynet
[
    {
        "Name": "mynet",
        "Id": "5efd1a4bc96cf9c631f9c68e6956195f5bd0892a4ddf44652880391e77c9e577",
        "Created": "2022-04-14T22:04:46.32875633+08:00",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "192.168.0.0/16",
                    "Gateway": "192.168.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {},
        "Options": {},
        "Labels": {}
    }
]

```



#### 为什么要自定义网络

```shell
# 不使用 --link 也可以ping的通
# 自定义的网络docker都已经帮我们维护好了对应的关系，推荐我们平时这样使用网络。
```

redis/mysql： 不同的集群使用不同的网络，保证集群是安全和健康的



#### 网络连通

```shell
# 测试 打通docker0的容器 连通 mynet
[root@VM-0-9-centos /]# docker network connect mynet tomcat02
[root@VM-0-9-centos /]# docker network inspect mynet
[
    {
        "Name": "mynet",
        "Containers": {
            "28b569933ea6ff08c52f10c42bf6e8afbaf44ee6c1db6e1354fe8f52dfb8dc4b": {
                "Name": "tomcat-net-2",
                "EndpointID": "cfda030598599d72473b393d689086c88d992b10e026f432778e05cca1ad384f",
                "MacAddress": "02:42:c0:a8:00:02",
                "IPv4Address": "192.168.0.2/16",
                "IPv6Address": ""
            },
            "4eee2c17ee2050bcb0148e7d0d559325ed4deb51bbe74fce93633e51b3574771": {
                "Name": "tomcat02",
                "EndpointID": "b56abb729ca1fedb5d9a97ba9e15b1382d2d51124f2e34c0cb88e793668625e3",
                "MacAddress": "02:42:c0:a8:00:03",
                "IPv4Address": "192.168.0.3/16",
                "IPv6Address": ""
            }
        },
        "Options": {},
        "Labels": {}
    }
]
# 连通之后将tomcat02放到了mynet网络下
# 也就是一个容器 两个ip地址
```

**结论：假设要跨网络去操作别人，就需要用docker network connect 连通！**







