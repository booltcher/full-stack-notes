可以参考：

[AngularJS commit规范](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.greljkmo14y0)



## 规范(git-cz)

### type

表示本次commit的类型，常见类型如下

- **feat**：新特性，新功能
- **fix**：修复bug
- **docs**：更新文档
- **style**：代码样式优化
- **refactor**：代码重构
- **test**：实现测试
- **chore**：工具，依赖，构建相关更新
- **perf**：优化功能
- **release**：版本发布
- **ci**：持续集成相关改动



### subject

本次改动的简洁描述

- 使用祈使语气，现在时态: “change”不是“changed”也不是“changes”
- 结尾没有(**.**)



### body

本次改动的详细描述，使用祈使语气，现在时态。

body的内容应该包括改变的动机，并与之前的行为进行对比。



### footer

- **breaking** 表示本次commit有破坏性修改
- **issues** 关闭的issues，针对于某个issue的改动



## commit规范实现

所用到的依赖：

### [git-cz](https://github.com/streamich/git-cz)

用`git-cz`命令代替`git commit`，每次提交可以选择commit的类型，这个命令提供一个可交互的提示框，可以对commit规范中的每一个部分进行顺序设置，自动生成规范的commit信息

![image-20220423004642936](C:/Users/bootcher/AppData/Roaming/Typora/typora-user-images/image-20220423004642936.png)

![image-20220423005743907](C:/Users/bootcher/AppData/Roaming/Typora/typora-user-images/image-20220423005743907.png)

```bash
npm i --save-dev git-cz
```





### [standard-version](https://github.com/conventional-changelog/standard-version)

自动生成CHANGELOG.md

自动git tag

```bash
npm i --save-dev standard-version
```

默认只会在changlog中记录feat和fix类型的记录，如果想记录其他类型的提交，可以在根目录下创建.versionrc的文件

```bash
{
  "types": [
    {"type": "chore", "section":"Others", "hidden": false},
    {"type": "revert", "section":"Reverts", "hidden": false},
    {"type": "feat", "section": "Features", "hidden": false},
    {"type": "fix", "section": "Bug Fixes", "hidden": false},
    {"type": "improvement", "section": "Feature Improvements", "hidden": false},
    {"type": "docs", "section":"Docs", "hidden": false},
    {"type": "style", "section":"Styling", "hidden": false},
    {"type": "refactor", "section":"Code Refactoring", "hidden": false},
    {"type": "perf", "section":"Performance Improvements", "hidden": false},
    {"type": "test", "section":"Tests", "hidden": false},
    {"type": "build", "section":"Build System", "hidden": false},
    {"type": "ci", "section":"CI", "hidden":false}
  ]
}
```





### 自定义交互

在repo中创建文件`changelog.config.js`，可以在子目录下，git-cz会自动查找，文件内容：

```bash
module.exports = {
  disableEmoji: false,
  format: '{type}{scope}: {emoji}{subject}',
  list: ['test', 'feat', 'fix', 'chore', 'docs', 'refactor', 'style', 'ci', 'perf'],
  maxMessageLength: 64,
  minMessageLength: 3,
  questions: ['type', 'scope', 'subject', 'body', 'breaking', 'issues', 'lerna'],
  scopes: [],
  types: {
    chore: {
      description: 'Build process or auxiliary tool changes',
      emoji: '🤖',
      value: 'chore'
    },
    ci: {
      description: 'CI related changes',
      emoji: '🎡',
      value: 'ci'
    },
    docs: {
      description: 'Documentation only changes',
      emoji: '✏️',
      value: 'docs'
    },
    feat: {
      description: 'A new feature',
      emoji: '🎸',
      value: 'feat'
    },
    fix: {
      description: 'A bug fix',
      emoji: '🐛',
      value: 'fix'
    },
    perf: {
      description: 'A code change that improves performance',
      emoji: '⚡️',
      value: 'perf'
    },
    refactor: {
      description: 'A code change that neither fixes a bug or adds a feature',
      emoji: '💡',
      value: 'refactor'
    },
    release: {
      description: 'Create a release commit',
      emoji: '🏹',
      value: 'release'
    },
    style: {
      description: 'Markup, white-space, formatting, missing semi-colons...',
      emoji: '💄',
      value: 'style'
    },
    test: {
      description: 'Adding missing tests',
      emoji: '💍',
      value: 'test'
    }
  }
};
```







## 命令

在package.json中定义命令

```json
"scripts": {
    "commit": "git-cz",
    "release": "standard-version"
}
```





## 使用

1. [**feature-branch**] stage 更改的文件：

```bash
git add 
```

1. [**feature-branch**] 用 `git-cz` 来提交文件：

```bash
npm run commit
```

- 选择提交类型（feat, refactor, fix, 等等）
- 提供简短描述
- （可选）提供长描述
- 确定本次提交是否为 *BREAKING CHANGES*
- （可选）提供 JIRA issue

1. [**feature-branch**]  推送远端

```bash
git push
```

1. 向`main`分支提交 Pull Request

2. 成功合并后：

   - 执行命令 `npm run release` (自动更新版本号，自动更新 *CHANGELOG.md*, 自动创建 `git tag`)
   - 将更改和 `git tags` 推送至远端:

   ```
   git push --follow-tags origin master
   ```
















