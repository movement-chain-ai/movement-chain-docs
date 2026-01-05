# Claude Agent SDK 资源指南

> 从 Claude Code CLI 到可编程 Agent 的进阶路径

---

## 概述

Anthropic 提供三种使用 Claude 的方式：

| SDK | 本质 | 工具执行 |
|-----|------|----------|
| **Client SDK** | 原始 API 访问 | 你自己实现 tool loop |
| **Agent SDK** | Claude + 内置工具 | Claude 自主执行 |
| **Claude Code CLI** | 交互式终端 | Claude 自主执行 |

**关键关系**:

- **Agent SDK = CLI 的可编程版本** (Same capabilities, different interface)
- **Agent SDK ≠ Client SDK** (Agent SDK 内置工具执行)

```python
# Client SDK: 你实现 tool loop
response = client.messages.create(...)
while response.stop_reason == "tool_use":
    result = your_tool_executor(response.tool_use)  # ← 你实现
    response = client.messages.create(tool_result=result, ...)

# Agent SDK: Claude 自主执行工具
async for message in query(prompt="Fix the bug in auth.py"):
    print(message)  # ← Claude 自己调用 Read, Edit, Bash...
```

### 官方推荐用途

| Use Case | Best Choice |
|----------|-------------|
| Interactive development | CLI |
| CI/CD pipelines | Agent SDK |
| Custom applications | Agent SDK |
| One-off tasks | CLI |
| Production automation | Agent SDK |

> "Many teams use both: CLI for daily development, SDK for production."

---

## 核心概念

### 1. Workflow vs Agent

两种使用 LLM 的方式：

```text
┌─────────────────────────────────────────────────────────────────┐
│                    Workflow (工作流)                             │
│  预定义的代码路径，LLM 在特定节点做特定任务                          │
│  Example: 提示链、路由、并行处理                                   │
│  ✅ 可预测、可测试                                               │
│  ❌ 不够灵活                                                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      Agent (代理)                               │
│  LLM 自主决定下一步，动态调用工具                                  │
│  Example: 研究 Agent、编程 Agent                                 │
│  ✅ 灵活、能处理未知情况                                          │
│  ❌ 不可预测、需要更多 guardrails                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Agent Loop (代理循环)

Agent 的核心运行模式：

```text
┌────────────────────────────────────────────────────────────────┐
│                   Agentic Loop 核心循环                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│    ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐      │
│    │ Gather  │──▶│  Take   │──▶│ Verify  │──▶│ Repeat  │──┐   │
│    │ Context │   │ Action  │   │  Work   │   │ or Stop │  │   │
│    └─────────┘   └─────────┘   └─────────┘   └────┬────┘  │   │
│         ▲                                         │       │   │
│         └─────────────────────────────────────────┘       │   │
│                                                           │   │
│    直到任务完成或达到停止条件 ◀───────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 3. Multi-Agent / Orchestrator-Workers Pattern

复杂任务分解给多个专门化 Agent：

```text
┌────────────────────────────────────────────────────────────────┐
│                   Orchestrator-Workers 模式                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                    ┌───────────────────┐                       │
│                    │   Orchestrator    │ ← 理解任务、分配工作   │
│                    │   (Lead Agent)    │   合并结果、质量把控   │
│                    └─────────┬─────────┘                       │
│                              │                                 │
│              ┌───────────────┼───────────────┐                 │
│              │               │               │                 │
│              ▼               ▼               ▼                 │
│     ┌────────────┐   ┌────────────┐   ┌────────────┐          │
│     │  Worker 1  │   │  Worker 2  │   │  Worker 3  │          │
│     │  (Analyst) │   │ (Coder)    │   │ (Reviewer) │          │
│     └────────────┘   └────────────┘   └────────────┘          │
│              │               │               │                 │
│              └───────────────┴───────────────┘                 │
│                              │                                 │
│                              ▼                                 │
│                    ┌───────────────────┐                       │
│                    │   Final Output    │                       │
│                    └───────────────────┘                       │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 5 种 Workflow 模式

基于 Anthropic 的 [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) 研究：

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| **Prompt Chaining** | 一个 LLM 调用的输出成为下一个的输入 | 多步骤处理、渐进式细化 |
| **Routing** | 根据输入类型分发到不同处理器 | 客服分类、意图识别 |
| **Parallelization** | 同时执行多个 LLM 任务，合并结果 | 并行分析、投票机制 |
| **Orchestrator-Workers** | 主 Agent 动态分配子任务给专门 Agent | 复杂研究、代码生成 |
| **Evaluator-Optimizer** | 一个 LLM 生成，另一个评估并优化 | 代码审查、写作改进 |

---

## Movement Chain 应用分析

### 你的产品流程

```text
┌─────────────────────────────────────────────────────────────────────────┐
│              Movement Chain 高尔夫分析系统 - 完整数据流                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     1. 传感器数据采集                            │   │
│  │  ┌──────────┐   ┌──────────┐   ┌──────────┐                     │   │
│  │  │ Vision   │   │  IMU     │   │  EMG     │                     │   │
│  │  │ 30 fps   │   │ 1666 Hz  │   │ 1000 Hz  │                     │   │
│  │  └────┬─────┘   └────┬─────┘   └────┬─────┘                     │   │
│  │       └──────────────┴──────────────┘                           │   │
│  │                       │                                          │   │
│  │                       ▼                                          │   │
│  │           ┌──────────────────────┐                              │   │
│  │           │  Sensor Hub          │ ← 时间同步 <10ms              │   │
│  │           │  (融合 + 对齐)       │                              │   │
│  │           └──────────┬───────────┘                              │   │
│  └──────────────────────┼──────────────────────────────────────────┘   │
│                         │                                               │
│                         ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     2. 算法处理 (确定性)                         │   │
│  │                                                                  │   │
│  │  Assessment → Diagnosis → Correction → Tracking                  │   │
│  │  (12 指标)    (6 规则)    (优先反馈)   (进度记录)                │   │
│  │                                                                  │   │
│  │  关键算法:                                                       │   │
│  │  - X-Factor: 髋肩分离角 = θ_shoulders - θ_hips                   │   │
│  │  - Kinematic Sequence: 峰值速度顺序检测                          │   │
│  │  - Tempo Ratio: 上杆/下杆时间比                                  │   │
│  │                                                                  │   │
│  └──────────────────────┬──────────────────────────────────────────┘   │
│                         │                                               │
│                         ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     3. 规则引擎 (确定性)                         │   │
│  │                                                                  │   │
│  │  P0: 身体伤害风险 (优先级最高)                                   │   │
│  │  P1: 挥杆效率问题                                                │   │
│  │  P2: 优化建议                                                    │   │
│  │                                                                  │   │
│  │  输出: 结构化诊断数据 (JSON)                                     │   │
│  │  {                                                               │   │
│  │    "x_factor": 45.2,                                             │   │
│  │    "x_factor_status": "optimal",                                 │   │
│  │    "correction": "P2_MAINTAIN_SEPARATION",                       │   │
│  │    "priority": 2                                                 │   │
│  │  }                                                               │   │
│  └──────────────────────┬──────────────────────────────────────────┘   │
│                         │                                               │
│                         ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     4. LLM 翻译层                                │   │
│  │                                                                  │   │
│  │  ┌─────────────────┐     ┌─────────────────┐                    │   │
│  │  │  结构化数据     │ ──▶ │  自然语言反馈   │                    │   │
│  │  │  (JSON)         │     │  (人话)         │                    │   │
│  │  └─────────────────┘     └─────────────────┘                    │   │
│  │                                                                  │   │
│  │  "你的髋肩分离角是 45.2°，非常好！保持下杆时的转体顺序..."       │   │
│  │                                                                  │   │
│  │  ⚠️ 这是简单的 API 调用，不需要 Agent 能力                       │   │
│  │     Claude 只是把数据翻译成人话，不需要调用工具                  │   │
│  │                                                                  │   │
│  └──────────────────────┬──────────────────────────────────────────┘   │
│                         │                                               │
│                         ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     5. 用户界面                                  │   │
│  │                                                                  │   │
│  │  Flutter App: 视觉反馈 + 语音提示 + 进度追踪                     │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 关键结论

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                          SDK 选择决策                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   你的产品功能 (高尔夫分析) → 用 Client SDK ✅                           │
│   ────────────────────────────────────────                              │
│                                                                         │
│   为什么？                                                               │
│   - LLM 只是 "翻译器"，把结构化数据变成自然语言                          │
│   - 不需要 Claude 调用工具 (Read, Write, Bash)                          │
│   - 这是确定性 Workflow，不是 Agent                                      │
│                                                                         │
│   代码示例:                                                              │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  import anthropic                                                │   │
│   │                                                                  │   │
│   │  client = anthropic.Anthropic()                                  │   │
│   │                                                                  │   │
│   │  # 你的诊断数据                                                  │   │
│   │  diagnosis = {                                                   │   │
│   │      "x_factor": 45.2,                                           │   │
│   │      "tempo_ratio": 3.1,                                         │   │
│   │      "corrections": ["P2_MAINTAIN_SEPARATION"]                   │   │
│   │  }                                                               │   │
│   │                                                                  │   │
│   │  # 简单 API 调用                                                 │   │
│   │  response = client.messages.create(                              │   │
│   │      model="claude-sonnet-4-20250514",                           │   │
│   │      max_tokens=500,                                             │   │
│   │      messages=[{                                                 │   │
│   │          "role": "user",                                         │   │
│   │          "content": f"作为高尔夫教练，用简洁的语言解释这个       │   │
│   │                       诊断结果给用户: {diagnosis}"               │   │
│   │      }]                                                          │   │
│   │  )                                                               │   │
│   │                                                                  │   │
│   │  feedback = response.content[0].text                             │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│   你的开发工作 (文档维护、CI/CD) → 可用 Agent SDK 🔧                     │
│   ──────────────────────────────────────────                            │
│                                                                         │
│   场景:                                                                  │
│   - 每周自动生成设计文档健康报告                                         │
│   - PR 自动检查文档完整性                                                │
│   - 批量重构文档结构                                                     │
│                                                                         │
│   为什么？                                                               │
│   - 需要 Claude 读取、分析、修改文件                                     │
│   - 需要自主决定下一步操作                                               │
│   - 这是 Agent 行为                                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### SDK 选择决策树

```text
                    你的任务需要 Claude 调用工具吗？
                    (Read, Write, Edit, Bash, etc.)
                                │
                ┌───────────────┴───────────────┐
                │                               │
               否                              是
                │                               │
                ▼                               ▼
        ┌───────────────┐               需要交互式开发吗？
        │ Client SDK    │                       │
        │ 简单 API 调用 │           ┌───────────┴───────────┐
        └───────────────┘           │                       │
                                   是                      否
                                    │                       │
                                    ▼                       ▼
                            ┌───────────────┐       ┌───────────────┐
                            │ Claude Code   │       │ Agent SDK     │
                            │ CLI           │       │ 可编程自动化  │
                            └───────────────┘       └───────────────┘
```

### 开发工具场景示例

用 Multi-Agent 做文档分析 (开发工具，非产品功能):

```text
┌──────────────────────────────────────────────────────────────────┐
│              Movement Chain 设计 Orchestrator                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   User: "分析 swing-phases.md 的设计缺陷"                         │
│                        │                                         │
│                        ▼                                         │
│         ┌────────────────────────────┐                          │
│         │   Design Orchestrator       │                          │
│         │   - 理解设计目标            │                          │
│         │   - 分配分析任务            │                          │
│         │   - 合并发现                │                          │
│         └─────────────┬──────────────┘                          │
│                       │                                          │
│     ┌─────────────────┼─────────────────┐                        │
│     │                 │                 │                        │
│     ▼                 ▼                 ▼                        │
│ ┌─────────┐     ┌─────────┐     ┌─────────┐                     │
│ │ Gap     │     │ Consist │     │ Cross-  │                     │
│ │ Finder  │     │ Checker │     │ Ref     │                     │
│ │         │     │         │     │ Validator│                    │
│ └─────────┘     └─────────┘     └─────────┘                     │
│     │                 │                 │                        │
│     └─────────────────┴─────────────────┘                        │
│                       │                                          │
│                       ▼                                          │
│         ┌────────────────────────────┐                          │
│         │   Design Health Report      │                          │
│         │   - 缺失的定义              │                          │
│         │   - 不一致的术语            │                          │
│         │   - 断开的引用链接          │                          │
│         └────────────────────────────┘                          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 学习资源

### 官方文档

| 资源 | 链接 | 说明 |
|------|------|------|
| Agent SDK Overview | [platform.claude.com/docs/en/agent-sdk/overview](https://platform.claude.com/docs/en/agent-sdk/overview) | SDK 概述 |
| Quickstart | [platform.claude.com/docs/en/agent-sdk/quickstart](https://platform.claude.com/docs/en/agent-sdk/quickstart) | 快速入门 |
| Skills | [platform.claude.com/docs/en/agent-sdk/skills](https://platform.claude.com/docs/en/agent-sdk/skills) | 技能开发 |
| Plugins | [platform.claude.com/docs/en/agent-sdk/plugins](https://platform.claude.com/docs/en/agent-sdk/plugins) | 插件系统 |
| Subagents | [platform.claude.com/docs/en/agent-sdk/subagents](https://platform.claude.com/docs/en/agent-sdk/subagents) | 子 Agent |

### 工程博客

| 文章 | 链接 | 重点 |
|------|------|------|
| Building Effective Agents | [anthropic.com/research/building-effective-agents](https://www.anthropic.com/research/building-effective-agents) | 5 种 Workflow 模式 |
| Claude Code Best Practices | [anthropic.com/engineering/claude-code-best-practices](https://www.anthropic.com/engineering/claude-code-best-practices) | 实用技巧 |
| Multi-Agent Research System | [anthropic.com/engineering/multi-agent-research-system](https://www.anthropic.com/engineering/multi-agent-research-system) | Orchestrator-Workers 实战 |
| Agent Skills | [anthropic.com/engineering/agent-skills](https://www.anthropic.com/engineering/agent-skills) | Skill 设计理念 |
| Context Engineering | [anthropic.com/engineering/context-engineering](https://www.anthropic.com/engineering/context-engineering) | Token 优化策略 |

### GitHub 仓库

| 仓库 | 链接 | 内容 |
|------|------|------|
| claude-code | [github.com/anthropics/claude-code](https://github.com/anthropics/claude-code) | Claude Code 主仓库 |
| claude-code-sdk-python | [github.com/anthropics/claude-code-sdk-python](https://github.com/anthropics/claude-code-sdk-python) | Python SDK |
| claude-code-sdk-typescript | [github.com/anthropics/claude-code-sdk-typescript](https://github.com/anthropics/claude-code-sdk-typescript) | TypeScript SDK |
| skills | [github.com/anthropics/skills](https://github.com/anthropics/skills) | 官方 Skills 集合 |
| claude-cookbooks | [github.com/anthropics/claude-cookbooks](https://github.com/anthropics/claude-cookbooks) | 示例代码 |
| courses | [github.com/anthropics/courses](https://github.com/anthropics/courses) | 官方课程 |

---

## 3 种使用方式

### 方式一: Per-Project (每项目配置)

在项目根目录配置 `.claude/` 文件夹：

```text
movement-chain-docs/
├── .claude/
│   ├── CLAUDE.md           # 项目级指令
│   ├── skills/             # 项目技能
│   │   ├── adr-writer/
│   │   ├── docs-health-checker/
│   │   └── design-gap-analyzer/  ← 新增
│   └── rules/              # 上下文规则
│       ├── design.md
│       └── business-plan.md
└── docs/
```

**优点**: 简单、版本控制、团队共享
**缺点**: 每个项目需单独配置

### 方式二: Central Agent Service (中央服务)

用 Agent SDK 构建一个中央 API 服务：

```python
from claude_code_sdk import ClaudeCode

# 初始化 Agent
agent = ClaudeCode(
    model="claude-sonnet-4-20250514",
    working_directory="/path/to/docs",
    system_prompt="You are a documentation reviewer..."
)

# 调用 Agent
result = agent.run(
    prompt="Review the design docs for gaps",
    tools=["read", "grep", "glob"]
)
```

**优点**: 多项目共用、CI/CD 集成
**缺点**: 需要 API 费用、维护成本

### 方式三: Plugins (插件)

打包成可复用的插件，跨项目共享：

```text
my-docs-plugin/
├── plugin.json
├── skills/
│   └── design-gap-analyzer/
├── agents/
│   └── docs-reviewer.md
└── hooks/
    └── pre-commit-check.sh
```

**优点**: 一次开发、到处使用
**缺点**: 需要更多设置

---

## 快速开始

### Step 1: 安装 SDK

```bash
# Python
pip install claude-code-sdk

# TypeScript
npm install @anthropic-ai/claude-code-sdk
```

### Step 2: 创建简单 Agent

```python
from claude_code_sdk import ClaudeCode

agent = ClaudeCode()
result = agent.run("Summarize the system design in 3 bullet points")
print(result.output)
```

### Step 3: 使用现有 Skills

你的项目已有 5 个技能可用：

| 技能 | 作用 |
|------|------|
| `docs-duplicate-checker` | 检查内容重复 |
| `docs-placement-advisor` | 确定内容位置 |
| `docs-content-writer` | 写入文档 |
| `docs-health-checker` | 检查文档健康度 |
| `adr-writer` | 创建 ADR |

---

## 相关文档

- [系统架构](../../design/architecture/system-design.md) - 核心架构
- [ADR-0007 Swift iOS](../../design/decisions/0007-swift-ios-native.md) - 移动端开发
- [开发指南](../index.md) - 开发入口

---

**最后更新**: 2025-12-25
