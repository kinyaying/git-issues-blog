#### shero-cli 使用说明

### shero-cli 是什么？

很多程序员平时喜欢使用 git 的 issue 来编写博客，因为 issue 里的 comment 部分能够提供一个作者和读者之间沟通讨论的平台。但是使用 issue 编写博客的话，涉及到博客内容和 issue 直接的关系需要维护，作者需要自己维护一个博客仓库，然后在博客完成后再复制到 issue。
为了让利用 github 的 issue 来开发博客变得更加愉快，就开发了 shero-cli 这款工具。主要提供的功能有：

- 命令行式创建博客
- 命令行式发布博客
- 将仓库里的 md 文件生成目录列表，降低维护成本

有兴趣的可进入 github 查看项目源码： [shero-cli github 地址](https://github.com/kinyaying/git-issues-blog)

### 项目设计图

![项目设计图](https://raw.githubusercontent.com/kinyaying/git-issues-blog/master/img/1.png)

### 怎么用

**1. shero-cli 安装**

```shell
npm install shero-cli -g
```

**2. 进入本地的博客仓库**

因为创建博客仓库是低频操作，shero-cli 暂时不支持命令行创建 github 的博客仓库，请先在 github 上创建下。

**3. shero-cli 初始化**

```shell
shero-cli init
```

需要根据提示输入用户名(github 的用户名)，仓库名(博客的仓库名)和 token。
由于 shero-cli 需要去创建 github 仓库的 issue，需要 token 才能有权限。token 的获取方式如下：
![项目设计图](https://raw.githubusercontent.com/kinyaying/git-issues-blog/master/img/2.png)
![项目设计图](https://raw.githubusercontent.com/kinyaying/git-issues-blog/master/img/3.png)
![项目设计图](https://raw.githubusercontent.com/kinyaying/git-issues-blog/master/img/4.png)
这个 token 只会出现一次,请点击复制保存下来.

想了解 token 更多的内容可以参考这篇文章[关于获取 git 的 token](https://dev.to/gr2m/github-api-authentication-personal-access-tokens-53kd)。

**4. 创建一篇博客**

```shell
shero-cli create <blogName>
```

- 注意 blogName 就是博客名称，也会作为 issue 的标题展示
- blogName 是必填项，.md 后缀可不填，默认生成 md 文件

**5. 发布或更新一篇博客**

```shell
shero-cli publish <blogName>
```

**shero-cli**自动识别 publish 的博客对应的 issue 是否存在，存在的话就是更新 issue，不存在就新建 issue。

### TODO list

这个工具我是先开发一个版本，有的功能还要继续的新增和完善。也欢迎 rd 朋友提出自己的想法和建议，甚至参与到这个工具的开发中。

- [ ] shero-cli close [blogName] (issue 的关闭)
- [ ] shero-cli delete [blogName] (博客的删除)
- [ ] 支持博客头部和尾部使用模板
- [ ] 支持博客分类
- [ ] 探索打通掘金，简书等博客平台，实现一键 publish

### 参考文章

[nodejs api 官网](http://nodejs.cn/api/fs.html#fs_fs_readfile_path_options_callback)

[关于获取 git 的 token](https://dev.to/gr2m/github-api-authentication-personal-access-tokens-53kd)

封装好了的 github api 库：[octokit](https://octokit.github.io/rest.js/v18#issues-create)
