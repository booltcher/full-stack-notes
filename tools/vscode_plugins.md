### Font

Consolas, 'Courier New', monospace



### Enhance

- auto close tag

auto import

auto rename tag

autoFileName

Beautify

Color highlight

Color info

css formatter

css peek

Live server

Prettier

code spell checker

bookmarks ctrl + alt +k

prettier

prettier-eslint

git-gragh

Gitlens

Bracket pair colorizer

dotenv

- github copilot
- esint

- open in browser



### Vue

- Vetur
- vue

- vue vscode snippets



### React

- vscode-styled-components
- ES7+ React/Redux/React-Native snippets (react代码片段)

- vscode-styled-components
- GraphQL







### Test

- jest
- jest-runner



### Markdown

- markdown all in one
- markdown preview enhance

- mermaid markdown syntax highlight



### Docker

- docker
- deploy



### Theme

- ayu
- seeding icon theme



### Vim

- 下载
- 配置文件

- - 设置忽略的键

- 设置esc映射





```json
{
  "editor.lineNumbers": "relative",
  "editor.fontSize": 14,
  "workbench.tree.indent": 30,
  "workbench.editor.untitled.hint": "hidden",
  "security.workspace.trust.untrustedFiles": "open",
  "workbench.iconTheme": "vscode-seedling-icon-theme",
  "workbench.preferredHighContrastColorTheme": "Monokai",
  "workbench.colorCustomizations": {},
  "autoComplete": true,
  "autoimport.showNotifications": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "vim.easymotion": true,
  "vim.incsearch": true,
  "vim.useSystemClipboard": true,
  "vim.useCtrlKeys": true,
  "vim.hlsearch": true,
  "vim.insertModeKeyBindings": [
    {
      "before": ["j", "j"],
      "after": ["<Esc>"]
    }
  ],
  "vim.normalModeKeyBindingsNonRecursive": [
    {
      "before": ["<leader>", "d"],
      "after": ["d", "d"]
    },
    {
      "before": ["<C-n>"],
      "commands": [":nohl"]
    },
    {
      "before": ["E"],
      "after": ["g", "T"]
    },
    {
      "before": ["R"],
      "after": ["g", "t"]
    }
  ],
  "vim.leader": "<space>",
  "vim.handleKeys": {
    "<C-a>": false,
    "<C-f>": false,
    "<C-c>": false,
    "<C-v>": false
  },
  "workbench.colorTheme": "Ayu Mirage",
  "editor.tabSize": 2,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "[sql]": {
    "editor.defaultFormatter": "adpyke.vscode-sql-formatter"
  },
  "bracketPairColorizer.depreciation-notice": false,
  "editor.inlineSuggest.enabled": true
}
```