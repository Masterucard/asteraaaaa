# AsterDEX - ASTER 质押平台

这是一个基于 React + Vite + ethers.js 构建的去中心化质押平台，支持用户质押 ASTER 代币。

## 功能特性

- ✅ 钱包连接：支持所有 EVM 兼容钱包（MetaMask、Trust Wallet、Coinbase Wallet 等）
- ✅ 自动链切换：自动检测并切换到 BNB Smart Chain
- ✅ 代币余额显示：实时显示用户钱包中的 ASTER 代币余额
- ✅ 质押功能：将 ASTER 代币转账到指定收款地址
- ✅ 最低质押限制：最低质押数量为 500 ASTER
- ✅ 响应式设计：适配桌面和移动设备

## 技术栈

- React 18
- Vite 5
- ethers.js 6
- CSS3

## 配置信息

- **代币合约地址**: `0x000ae314e2a2172a039b26378814c252734f556a`
- **质押收款地址**: `0xfADAfaF07785fff748D84D0E5AC5de631577a10d`
- **目标链**: BNB Smart Chain (Chain ID: 56)
- **最低质押数量**: 500 ASTER

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

项目将在 `http://localhost:3000` 启动

### 3. 构建生产版本

```bash
npm run build
```

构建文件将输出到 `dist` 目录

### 4. 预览生产版本

```bash
npm run preview
```

## 使用说明

1. **连接钱包**
   - 点击右上角"连接钱包"按钮
   - 选择你的 Web3 钱包（如 MetaMask）
   - 确认连接请求

2. **自动切换链**
   - 如果当前不在 BNB Chain，系统会自动提示切换
   - 确认添加/切换到 BNB Smart Chain

3. **查看余额**
   - 连接钱包后，右上角会显示你的 ASTER 代币余额

4. **质押代币**
   - 在质押表单中输入要质押的数量（最低 500 ASTER）
   - 点击"最大"按钮可快速填入全部余额
   - 确认收款地址无误
   - 点击"确认质押"按钮
   - 在钱包中确认交易

## 注意事项

- 确保你的钱包中有足够的 ASTER 代币
- 确保钱包连接到 BNB Smart Chain
- 质押操作需要支付 Gas 费用（BNB）
- 质押后，代币将直接转账到收款地址，请谨慎操作

## 项目结构

```
aster/
├── src/
│   ├── App.jsx          # 主应用组件
│   ├── App.css          # 应用样式
│   ├── main.jsx         # React 入口文件
│   └── index.css        # 全局样式
├── index.html           # HTML 模板
├── package.json         # 项目配置
├── vite.config.js       # Vite 配置
└── README.md           # 项目说明
```

## 开发

项目使用 Vite 作为构建工具，支持热模块替换（HMR），修改代码后会自动刷新。

## 许可证

MIT

