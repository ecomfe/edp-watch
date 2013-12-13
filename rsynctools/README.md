## Rsync 工具配置及使用说明  
===

[说明]使用rsync进行同步的目的是：可以绕过公司的relay平台，从而免去了每次都要登陆relay的麻烦。并且rsync在不同平台间的兼容也较好，同样的语法基本可以通吃。


使用rsync前，首先需要将server端及client端的rsync版本保持一致，才可以保证同步稳定。  
目前开发机大部分使用了rsync 3.0.7这个版本，因此升级时需要注意.


1. 关于client端版本：

	windows系统推荐使用[cwRsync](https://www.itefix.no/i2/cwrsync)。目前cwRsync 4.0.5为免费版，且内置的就是rsync 3.0.7。

	*unix系统可以在[这里](http://rsync.samba.org/ftp/rsync/)里找到需要的版本，进行安装。或者使用其他工具安装。

2. sync.sh使用说明
	
	用于在*unix server端rsync的初始化、启动及终止。
	
	在需要同步的目录中，运行该脚本。
	
	使用方法：			
	
		$ ./sync.sh [option]
	
	命令如下：	
	
	    $ ./sync.sh init  # 初始化rsync依赖的配置文件及配置待同步的路径
	
	过程中会填入TaskName及同步的目录(相对于脚本所在路径)
	
	脚本会在init后，会在脚本所在目录创建rsyncd文件夹，其中包括rsyncd.pid、rsyncd.lock、rsyncd.log、rsyncd.conf文件。
	
	关于rsyncd.conf文件的具体配置可以参考这[这里](http://rsync.samba.org/ftp/rsync/rsyncd.conf.html)
	

		$ ./sync.sh start  # 开启rsync进程，并指定端口（默认端口8801）
	
	**注意：**办公内网对开发机开放的端口为 **8801-8999**，如果端口设置在该区间以外，将无法使用rsync同步！
	
		$ ./sync.sh stop  #	停止rsync进程
	
		$ ./sync.sh status  # 查看rsync进程
	
	
3. server端启动好rsync进程后，就可以使用rsync进行同步了。