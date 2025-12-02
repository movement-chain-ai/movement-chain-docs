# Open Source License Comparison Guide 开源许可证对比指南

**Status 状态:** Decision Pending 决策待定
**Date 日期:** 2025-12-01
**Purpose 目的:** Help team evaluate license options for Movement Chain AI repositories 帮助团队评估Movement Chain AI仓库的许可证选项

---

## Executive Summary 执行摘要

This guide compares the most common open source licenses used in hardware and software startups. Use this document to make an informed decision about which license to apply to the Movement Chain AI project.

本指南对比了硬件和软件初创公司中最常用的开源许可证。使用本文档为Movement Chain AI项目选择合适的许可证做出明智决策。

**Quick Recommendation Matrix 快速推荐矩阵:**

| Your Priority 您的优先事项 | Recommended License 推荐许可证 |
|---------------|---------------------|
| Maximum contributor adoption 最大化贡献者采用 | MIT |
| Patent protection + adoption 专利保护+采用 | Apache 2.0 |
| Force competitors to open source 强制竞争对手开源 | GPL v3 |
| Academic/research use 学术/研究用途 | BSD 3-Clause |
| Simplicity above all 简洁至上 | Unlicense or MIT |

---

## The 7 Most Common Open Source Licenses 7种最常见的开源许可证

### 1. MIT License MIT许可证

**Market Share 市场份额:** ~33% of GitHub repositories GitHub仓库的约33%（most popular 最流行）

**Summary 摘要:** Maximum freedom, minimal restrictions. "Do whatever you want, just keep the copyright notice." 最大自由，最小限制。"做任何您想做的事，只需保留版权声明。"

#### Full License Text (109 words) 完整许可证文本（109个单词）

```
MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

#### Pros 优点 ✅

- **Simplest license 最简单的许可证** - Everyone understands it (109 words) 所有人都能理解（109个单词）
- **Maximum adoption 最大采用度** - Most popular on GitHub (33% market share) GitHub上最流行（33%市场份额）
- **No patent issues 无专利问题** - Simple enough to avoid patent complications 足够简单以避免专利复杂性
- **Corporate-friendly 企业友好** - Companies love it (no viral requirements) 公司喜欢（无病毒式要求）
- **Compatible with everything 与所有许可证兼容** - Works with GPL, Apache, BSD 适用于GPL、Apache、BSD
- **Developer trust 开发者信任** - Most recognized and trusted by open source community 开源社区最认可和信任
- **Fast approval 快速批准** - Legal teams approve in minutes, not days 法律团队几分钟即可批准，而非几天

#### Cons 缺点 ❌

- **No explicit patent grant 无明确的专利授权** - Silent on patent rights (legal ambiguity) 对专利权保持沉默（法律模糊性）
- **No trademark protection 无商标保护** - Doesn't address trademark usage 不涉及商标使用
- **No contribution terms 无贡献条款** - Doesn't specify contributor rights 未指定贡献者权利
- **Minimal legal protection 最低法律保护** - Very brief, doesn't cover edge cases 非常简短，不涵盖边缘情况
- **Patent trolls 专利流氓** - No protection against patent lawsuits 无法防止专利诉讼

#### Best For 最适合

- Public libraries and frameworks 公共库和框架
- Projects prioritizing maximum adoption 优先考虑最大采用度的项目
- Developer tools and SDKs 开发者工具和SDK
- Startups wanting fast community growth 希望快速社区增长的初创公司
- Projects where simplicity > legal protection 简洁性大于法律保护的项目

#### Used By 使用者

- React (Facebook/Meta)
- Node.js
- jQuery
- Ruby on Rails
- .NET Core (Microsoft - switched from Apache to MIT 从Apache切换到MIT)

---

### 2. Apache License 2.0 Apache 2.0许可证

**Market Share 市场份额:** ~15-20% of GitHub repositories GitHub仓库的约15-20%

**Summary 摘要:** Permissive like MIT, but with explicit patent protection. "Do whatever you want, but with clear patent terms." 像MIT一样宽松，但有明确的专利保护。"做任何您想做的事，但有明确的专利条款。"

#### License Length 许可证长度

~4,000 words (comprehensive legal document 综合法律文件)

#### Key Clauses 关键条款

1. **Patent Grant 专利授权:** Contributors grant you patent rights to their contributions 贡献者授予您其贡献的专利权
2. **Patent Retaliation 专利报复:** If you sue for patent infringement, your license terminates 如果您起诉专利侵权，您的许可证终止
3. **Trademark Protection 商标保护:** Doesn't grant trademark rights 不授予商标权
4. **Contribution Terms 贡献条款:** Clear terms for accepting contributions 接受贡献的明确条款
5. **Warranty Disclaimer 免责声明:** No warranties provided 不提供任何保证

#### Pros 优点 ✅

- **Explicit patent protection 明确的专利保护** - Clear patent grant from contributors 贡献者的明确专利授权
- **Patent retaliation clause 专利报复条款** - Deters patent trolls 威慑专利流氓
- **Contribution clarity 贡献明确性** - Defines how contributions are handled 定义如何处理贡献
- **Corporate-friendly 企业友好** - Preferred by large tech companies 大型科技公司的首选
- **Comprehensive 全面** - Covers edge cases MIT doesn't 涵盖MIT未涵盖的边缘情况
- **File patents later 稍后申请专利** - Doesn't prevent you from filing your own patents 不阻止您申请自己的专利
- **Better for hardware 更适合硬件** - Important for projects with patent implications 对有专利影响的项目很重要

#### Cons 缺点 ❌

- **Longer license 更长的许可证** - 4,000+ words (intimidating for some developers) 4000+单词（对某些开发者有威慑力）
- **GPL v2 incompatibility GPL v2不兼容** - Cannot combine with GPL v2 code 不能与GPL v2代码结合
- **Slower legal approval 法律批准较慢** - Takes longer for legal teams to review 法律团队审查需要更长时间
- **Less familiar 不太熟悉** - Some developers don't read/understand it 一些开发者不阅读/理解它
- **Overkill for simple projects 对简单项目过于复杂** - More complex than needed for basic software 对基础软件而言过于复杂

#### Best For 最适合

- Projects with patent considerations 有专利考虑的项目
- Hardware + software combinations 硬件+软件组合
- Enterprise-focused projects 以企业为重点的项目
- Projects accepting contributions from corporations 接受来自企业贡献的项目
- Startups planning to file patents 计划申请专利的初创公司

#### Used By 使用者

- Android (Google)
- TensorFlow (Google)
- Kubernetes (Cloud Native Computing Foundation)
- Apache projects (Hadoop, Spark, Cassandra)
- Swift (Apple)

---

### 3. GNU General Public License v3 (GPL v3) GNU通用公共许可证v3

**Market Share 市场份额:** ~10-15% of GitHub repositories GitHub仓库的约10-15%

**Summary 摘要:** Copyleft/viral license. "You can use this, but any modifications must also be open source under GPL." Copyleft/病毒式许可证。"您可以使用它，但任何修改也必须在GPL下开源。"

#### License Length 许可证长度

~5,000 words (very comprehensive 非常全面)

#### Key Clauses 关键条款

1. **Copyleft Requirement Copyleft要求:** Modified versions must be GPL v3 修改版本必须是GPL v3
2. **Source Code Requirement 源代码要求:** Must provide source code to users 必须向用户提供源代码
3. **Patent Grant 专利授权:** Contributors grant patent rights 贡献者授予专利权
4. **Anti-Tivoization 反Tivo化:** Prevents hardware lockdown (must allow user modifications) 防止硬件锁定（必须允许用户修改）
5. **Network Use Clause 网络使用条款:** Server-side use triggers obligations (AGPL variant AGPL变体) 服务器端使用触发义务

#### Pros 优点 ✅

- **Prevents proprietary forks 防止专有分支** - Competitors must open source their changes 竞争对手必须开源其更改
- **Community protection 社区保护** - Ensures improvements stay open source 确保改进保持开源
- **Patent protection 专利保护** - Explicit patent grant 明确的专利授权
- **Strong copyleft 强copyleft** - Forces ecosystem to stay open 迫使生态系统保持开放
- **Ideological alignment 意识形态一致** - Aligns with Free Software Foundation values 与自由软件基金会价值观一致
- **Prevents "embrace and extend" 防止"拥抱和扩展"** - Big tech can't close-source your project 大型科技公司无法将您的项目闭源

#### Cons 缺点 ❌

- **Limits commercial use 限制商业使用** - Companies avoid GPL (legal risk) 公司避免GPL（法律风险）
- **Reduces adoption 减少采用** - Developers skip GPL projects when possible 开发者尽可能跳过GPL项目
- **Incompatible with MIT/Apache 与MIT/Apache不兼容** - Can't combine with permissive code easily 不能轻易与宽松代码结合
- **Investor-unfriendly 投资者不友好** - VCs dislike GPL (limits monetization) 风险投资不喜欢GPL（限制盈利）
- **Complex compliance 复杂的合规性** - Hard to use GPL correctly 难以正确使用GPL
- **Talent pool smaller 人才库更小** - Many developers avoid GPL projects 许多开发者避免GPL项目
- **Corporate blacklist 企业黑名单** - Many companies ban GPL dependencies 许多公司禁止GPL依赖

#### Best For 最适合

- Ideological projects (Free Software movement) 意识形态项目（自由软件运动）
- Projects wanting to prevent proprietary forks 希望防止专有分支的项目
- Academic research (force publication of derivatives) 学术研究（强制发布衍生品）
- Projects not seeking VC funding 不寻求风险投资的项目
- Developer tools (GCC, Linux kernel) 开发者工具（GCC、Linux内核）

#### Used By 使用者

- Linux kernel Linux内核
- GCC (GNU Compiler Collection)
- GIMP
- WordPress (GPL v2, not v3)
- Bash

---

### 4. BSD 3-Clause License ("BSD License Modified") BSD 3条款许可证（"修改的BSD许可证"）

**Market Share 市场份额:** ~5-10% of GitHub repositories GitHub仓库的约5-10%

**Summary 摘要:** Like MIT, but with an additional clause about endorsements. "Do whatever you want, but don't use our name to promote your product." 像MIT，但增加了关于背书的条款。"做任何您想做的事，但不要用我们的名字推广您的产品。"

#### Full License Text (~300 words) 完整许可证文本（约300个单词）

```
BSD 3-Clause License

Copyright (c) [year], [fullname]
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

#### Pros 优点 ✅

- **Simple like MIT 像MIT一样简单** - Easy to understand (300 words) 易于理解（300个单词）
- **Endorsement protection 背书保护** - Prevents misuse of your name 防止滥用您的名字
- **Academic-friendly 学术友好** - Popular in universities 在大学中流行
- **Permissive 宽松** - Allows commercial use 允许商业使用
- **Well-understood 易于理解** - Established license (since 1988) 已确立的许可证（自1988年起）

#### Cons 缺点 ❌

- **Less popular than MIT 不如MIT流行** - Smaller community recognition 社区认可度较低
- **Redundant clause 冗余条款** - Clause 3 is often legally unnecessary (trademark law covers this) 第3条通常在法律上不必要（商标法涵盖此内容）
- **No patent clause 无专利条款** - Same issue as MIT 与MIT相同的问题
- **Slightly longer 稍长** - More text than MIT (minor) 比MIT文本更多（轻微）

#### Best For 最适合

- Academic projects 学术项目
- Research software 研究软件
- Projects concerned about name misuse 担心名称滥用的项目
- University spin-offs 大学衍生项目

#### Used By 使用者

- FreeBSD
- Django (web framework Web框架)
- Flask (web framework Web框架)
- Redis (later switched to custom license 后来切换到自定义许可证)

---

### 5. BSD 2-Clause License ("Simplified BSD" / "FreeBSD License") BSD 2条款许可证（"简化BSD"/"FreeBSD许可证"）

**Market Share 市场份额:** ~3-5% of GitHub repositories GitHub仓库的约3-5%

**Summary 摘要:** BSD 3-Clause without the endorsement clause. Nearly identical to MIT. BSD 3条款去除背书条款。几乎与MIT相同。

#### Full License Text (~200 words) 完整许可证文本（约200个单词）

Same as BSD 3-Clause, but removes Clause 3 (endorsement restriction). 与BSD 3条款相同，但删除第3条（背书限制）。

#### Pros 优点 ✅

- **Simpler than BSD 3-Clause 比BSD 3条款更简单** - Removes unnecessary clause 删除不必要的条款
- **Permissive 宽松** - Maximum freedom 最大自由
- **Academic legacy 学术传统** - Historical trust from BSD Unix 来自BSD Unix的历史信任

#### Cons 缺点 ❌

- **Less popular than MIT 不如MIT流行** - Why use this when MIT is more recognized? 为什么在MIT更被认可时使用这个？
- **No advantages over MIT 相对MIT无优势** - Functionally equivalent 功能上等同
- **Confusing 令人困惑** - People ask "Why BSD 2-Clause instead of MIT?" 人们会问"为什么用BSD 2条款而不是MIT？"

#### Best For 最适合

- Situations where BSD brand is important (legacy projects) BSD品牌重要的情况（传统项目）
- When MIT seems "too corporate" 当MIT看起来"太企业化"时

#### Used By 使用者

- Nginx
- dnsmasq

---

### 6. Mozilla Public License 2.0 (MPL 2.0) Mozilla公共许可证2.0

**Market Share 市场份额:** ~2-3% of GitHub repositories GitHub仓库的约2-3%

**Summary 摘要:** "Weak copyleft" - File-level copyleft, not project-level. "Modified files must stay open, but you can combine with proprietary code." "弱copyleft" - 文件级copyleft，而非项目级。"修改的文件必须保持开放，但您可以与专有代码结合。"

#### License Length 许可证长度

~1,500 words 约1500个单词

#### Key Clauses 关键条款

1. **File-level copyleft 文件级copyleft:** Modified MPL files must stay MPL 修改的MPL文件必须保持MPL
2. **Linking exception 链接例外:** Can link with proprietary code 可以与专有代码链接
3. **Patent grant 专利授权:** Explicit patent protection 明确的专利保护
4. **Secondary licensing 次级许可:** Can be combined with GPL 可以与GPL结合

#### Pros 优点 ✅

- **Balanced approach 平衡方法** - Middle ground between MIT and GPL MIT和GPL之间的中间地带
- **Patent protection 专利保护** - Explicit grant like Apache 2.0 像Apache 2.0一样的明确授权
- **Corporate-friendly 企业友好** - Allows proprietary combinations 允许专有组合
- **Prevents embrace-and-extend 防止拥抱和扩展** - Core files stay open 核心文件保持开放

#### Cons 缺点 ❌

- **Rare 罕见** - Less than 3% adoption (unfamiliar to many developers) 采用率不到3%（许多开发者不熟悉）
- **Complex compliance 复杂的合规性** - File-level tracking is hard 文件级跟踪很困难
- **Confusing 令人困惑** - People don't understand "weak copyleft" 人们不理解"弱copyleft"
- **Niche 小众** - Only makes sense for specific use cases 仅对特定用例有意义

#### Best For 最适合

- Libraries that want to stay open but allow proprietary use 希望保持开放但允许专有使用的库
- Projects from Mozilla ecosystem 来自Mozilla生态系统的项目
- When you want some protection but not full GPL 当您想要一些保护但不是完整的GPL时

#### Used By 使用者

- Firefox
- Thunderbird
- LibreOffice

---

### 7. Unlicense (Public Domain) Unlicense（公共领域）

**Market Share 市场份额:** <1% of GitHub repositories GitHub仓库的<1%

**Summary 摘要:** "Do literally anything. No restrictions. No attribution required." "做任何事。无限制。无需署名。"

#### Full License Text (~150 words) 完整许可证文本（约150个单词）

```
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
```

#### Pros 优点 ✅

- **Maximum freedom 最大自由** - True public domain 真正的公共领域
- **No attribution 无需署名** - Not even copyright notice required 甚至不需要版权声明
- **Simple 简单** - Shorter than MIT 比MIT更短

#### Cons 缺点 ❌

- **Legal uncertainty 法律不确定性** - "Public domain" doesn't exist in all countries "公共领域"并非在所有国家都存在
- **No protection 无保护** - Zero legal protection for you 对您零法律保护
- **No branding 无品牌** - People can claim they wrote it 人们可以声称是他们写的
- **Rare 罕见** - Almost no projects use this 几乎没有项目使用

#### Best For 最适合

- Tiny utilities, snippets, examples 小型实用程序、代码片段、示例
- When you truly don't care about credit 当您真的不在乎署名时

#### Used By 使用者

- Some SQLite components 一些SQLite组件
- Small code snippets and gists 小型代码片段和gists

---

## Side-by-Side Comparison Table 并排对比表

| Feature 特性 | MIT | Apache 2.0 | GPL v3 | BSD 3-Clause | MPL 2.0 |
|---------|-----|-----------|--------|--------------|---------|
| **Popularity 流行度** | 🏆 33% | 🥈 18% | 🥉 12% | 6% | 2% |
| **Length 长度** | 109 words 单词 | 4,000 words 单词 | 5,000 words 单词 | 300 words 单词 | 1,500 words 单词 |
| **Simplicity 简洁性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Commercial Use 商业使用** | ✅ Yes | ✅ Yes | ⚠️ Restricted 受限 | ✅ Yes | ✅ Yes |
| **Patent Protection 专利保护** | ❌ No | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| **Copyleft (Viral) Copyleft（病毒式）** | ❌ No | ❌ No | ✅ Strong 强 | ❌ No | ⚠️ Weak 弱 |
| **Corporate Friendly 企业友好** | ✅✅✅ | ✅✅✅ | ❌❌ | ✅✅ | ✅✅ |
| **VC Friendly 风险投资友好** | ✅✅✅ | ✅✅✅ | ❌ | ✅✅ | ✅✅ |
| **Developer Trust 开发者信任** | ✅✅✅ | ✅✅ | ✅ | ✅✅ | ⭐ |
| **Can File Patents? 可以申请专利？** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Contributor Clarity 贡献者明确性** | ❌ Vague 模糊 | ✅ Clear 明确 | ✅ Clear 明确 | ❌ Vague 模糊 | ✅ Clear 明确 |

**Legend 图例:**

- ✅ = Supported/Good 支持/良好
- ❌ = Not supported/Bad 不支持/差
- ⚠️ = Partial/Conditional 部分/有条件
- ⭐ = Rating (1-5 stars) 评级（1-5星）

---

## Decision Framework for Movement Chain AI Movement Chain AI的决策框架

### Questions to Ask Your Team 向团队提出的问题

**1. What's your primary goal? 您的主要目标是什么？**

- [ ] Maximum contributor adoption 最大化贡献者采用 → **MIT** or **Apache 2.0**
- [ ] Prevent proprietary forks 防止专有分支 → **GPL v3**
- [ ] Patent protection important 专利保护重要 → **Apache 2.0** or **GPL v3**
- [ ] Keep it simple 保持简单 → **MIT**

**2. Will you file patents? 您会申请专利吗？**

- [ ] Yes, definitely 是的，肯定 → **Apache 2.0** (explicit patent protection 明确的专利保护)
- [ ] Maybe later 可能稍后 → **MIT** or **Apache 2.0** (both allow this 两者都允许)
- [ ] No 否 → **MIT** (simpler 更简单)

**3. Do you want corporate adoption? 您希望企业采用吗？**

- [ ] Yes (Nike, Adidas, Peloton using your tech 使用您的技术) → **MIT** or **Apache 2.0**
- [ ] No (community-driven only 仅社区驱动) → **GPL v3**

**4. How important is preventing competition? 防止竞争有多重要？**

- [ ] Very (force competitors to open source 强制竞争对手开源) → **GPL v3**
- [ ] Not important (let them use it 让他们使用) → **MIT** or **Apache 2.0**

**5. Are you seeking VC funding? 您在寻求风险投资吗？**

- [ ] Yes → **MIT** or **Apache 2.0** (investor-friendly 投资者友好)
- [ ] No (bootstrapped, grants, crowdfunding 自筹资金、赠款、众筹) → Any license 任何许可证

**6. What's your team's legal budget? 您团队的法律预算是多少？**

- [ ] $0 (can't afford legal review 无力承担法律审查) → **MIT** (simplest 最简单)
- [ ] $5,000+ (can get legal advice 可以获得法律建议) → **Apache 2.0** (comprehensive 全面)

---

## Industry Benchmarks 行业基准

### Hardware Startups 硬件初创公司

- **Arduino**: GPL v2 (hardware 硬件) + LGPL (software 软件)
- **Raspberry Pi**: Mix of proprietary (hardware 硬件) + BSD (software 软件)
- **Adafruit**: MIT (most projects 大多数项目)
- **SparkFun**: CC BY-SA (hardware 硬件) + Beerware/MIT (software 软件)

**Trend 趋势:** Hardware = Permissive (MIT/BSD) 硬件=宽松许可证, Firmware = Mixed 固件=混合

### Wearable Tech Companies 可穿戴技术公司

- **Fitbit**: Proprietary (closed source 闭源)
- **Pebble**: Mix of Apache 2.0 and proprietary Apache 2.0和专有的混合
- **OpenBCI**: MIT license MIT许可证

**Trend 趋势:** Consumer wearables = Proprietary 消费级可穿戴设备=专有, Developer wearables = MIT/Apache 开发者可穿戴设备=MIT/Apache

### ML/AI Startups ML/AI初创公司

- **Hugging Face**: Apache 2.0
- **OpenAI**: MIT (for released code 对于发布的代码)
- **Stability AI**: Various (CreativeML for Stable Diffusion)
- **TensorFlow (Google)**: Apache 2.0

**Trend 趋势:** ML/AI = Apache 2.0 (patent protection important 专利保护重要)

### Mobile App Frameworks 移动应用框架

- **Flutter (Google)**: BSD 3-Clause
- **React Native (Meta)**: MIT
- **Ionic**: MIT

**Trend 趋势:** Developer frameworks = MIT/BSD (maximum adoption 最大采用度)

---

## Switching Licenses Later 稍后切换许可证

### Can You Change Licenses? 您可以更改许可证吗？

**Yes, BUT it's complicated 可以，但很复杂:**

#### Permissive → More Permissive (EASY) 宽松→更宽松（简单）

```
Apache 2.0 → MIT ✅ Easy 简单
BSD → MIT ✅ Easy 简单
```

#### Permissive → Copyleft (HARD) 宽松→Copyleft（困难）

```
MIT → GPL v3 ⚠️ Requires permission from ALL contributors 需要所有贡献者的许可
Apache → GPL v3 ⚠️ Very difficult 非常困难
```

#### Copyleft → Permissive (IMPOSSIBLE) Copyleft→宽松（不可能）

```
GPL v3 → MIT ❌ Cannot relicense without unanimous consent 未经一致同意无法重新许可
GPL v3 → Apache ❌ Nearly impossible 几乎不可能
```

**Lesson 教训:** Start permissive (MIT/Apache). You can always add restrictions later, but you can NEVER remove them. 从宽松许可证开始（MIT/Apache）。您可以随时添加限制，但永远无法删除它们。

---

## Recommendations by Scenario 按场景推荐

### Scenario 1: "We want maximum GitHub stars and contributors" 场景1："我们想要最多的GitHub星标和贡献者"

**→ MIT License MIT许可证**

- Simplest, most trusted 最简单、最受信任
- 33% of GitHub uses it GitHub的33%使用它
- No barriers to contribution 无贡献障碍

### Scenario 2: "We might file patents in 6-12 months" 场景2："我们可能在6-12个月内申请专利"

**→ Apache 2.0**

- Explicit patent protection 明确的专利保护
- Still permissive enough for adoption 仍然足够宽松以便采用
- Corporate-friendly 企业友好

### Scenario 3: "We want to prevent big tech from stealing our work" 场景3："我们想防止大型科技公司窃取我们的工作"

**→ GPL v3**

- Forces derivatives to open source 强制衍生品开源
- Prevents proprietary forks 防止专有分支
- BUT: Limits adoption significantly 但是：显著限制采用

### Scenario 4: "We're an academic research project" 场景4："我们是学术研究项目"

**→ BSD 3-Clause** or **MIT**

- Academic tradition (BSD) 学术传统（BSD）
- Simple and permissive 简单且宽松

### Scenario 5: "We want to build a business with open core model" 场景5："我们想用开源核心模式建立业务"

**→ MIT or Apache 2.0**

- Open source core (MIT/Apache) 开源核心（MIT/Apache）
- Proprietary premium features (closed source 闭源) 专有高级功能
- This is the Supabase/GitLab model 这是Supabase/GitLab模式

---

## Common Mistakes to Avoid 要避免的常见错误

### ❌ Mistake 1: Choosing GPL for a startup 错误1：为初创公司选择GPL

**Problem 问题:** Limits commercial adoption, scares investors 限制商业采用，吓跑投资者
**Solution 解决方案:** Use MIT or Apache 2.0 使用MIT或Apache 2.0

### ❌ Mistake 2: Not choosing a license at all 错误2：根本不选择许可证

**Problem 问题:** All rights reserved by default (proprietary) 默认保留所有权利（专有）
**Solution 解决方案:** Pick ANY license (MIT is safe default) 选择任何许可证（MIT是安全的默认选择）

### ❌ Mistake 3: Mixing incompatible licenses 错误3：混合不兼容的许可证

**Problem 问题:** GPL + Apache in same project = legal nightmare 同一项目中的GPL + Apache =法律噩梦
**Solution 解决方案:** Check compatibility before combining code 组合代码前检查兼容性

### ❌ Mistake 4: Changing licenses without contributor consent 错误4：未经贡献者同意更改许可证

**Problem 问题:** Illegal, lawsuit risk 非法，诉讼风险
**Solution 解决方案:** Get written permission from ALL contributors OR rewrite all code 获得所有贡献者的书面许可或重写所有代码

### ❌ Mistake 5: Thinking license = patent 错误5：认为许可证=专利

**Problem 问题:** Licenses and patents are separate legal protections 许可证和专利是独立的法律保护
**Solution 解决方案:** Understand you can have BOTH (open source + patents) 理解您可以同时拥有两者（开源+专利）

---

## License Compatibility Matrix 许可证兼容性矩阵

Can you combine code from different licenses? 您可以组合不同许可证的代码吗？

| Your Project 您的项目 | Can Include MIT? 可以包含MIT？ | Can Include Apache 2.0? 可以包含Apache 2.0？ | Can Include BSD? 可以包含BSD？ | Can Include GPL v3? 可以包含GPL v3？ | Can Include MPL 2.0? 可以包含MPL 2.0？ |
|--------------|------------------|------------------------|------------------|---------------------|----------------------|
| **MIT** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No* | ✅ Yes |
| **Apache 2.0** | ✅ Yes | ✅ Yes | ✅ Yes | ⚠️ Maybe** | ✅ Yes |
| **BSD 3-Clause** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No* | ✅ Yes |
| **GPL v3** | ✅ Yes*** | ⚠️ Maybe** | ✅ Yes*** | ✅ Yes | ✅ Yes |
| **MPL 2.0** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |

**Notes 注释:**

- *Cannot include GPL in permissive project (GPL is viral) 不能在宽松项目中包含GPL（GPL是病毒式的）
- **Apache 2.0 + GPL v3 is compatible, but Apache + GPL v2 is NOT Apache 2.0 + GPL v3兼容，但Apache + GPL v2不兼容
- ***GPL can include permissive code, but overall project becomes GPL GPL可以包含宽松代码，但整个项目变成GPL

---

## Resources & Further Reading 资源和延伸阅读

### Official License Texts 官方许可证文本

- [MIT License MIT许可证](https://opensource.org/licenses/MIT)
- [Apache License 2.0 Apache许可证2.0](https://www.apache.org/licenses/LICENSE-2.0)
- [GNU GPL v3 GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html)
- [BSD 3-Clause BSD 3条款](https://opensource.org/licenses/BSD-3-Clause)
- [Mozilla Public License 2.0 Mozilla公共许可证2.0](https://www.mozilla.org/en-US/MPL/2.0/)

### License Selection Tools 许可证选择工具

- [Choose a License](https://choosealicense.com/) - GitHub's guide GitHub指南
- [TLDRLegal](https://tldrlegal.com/) - Plain English license summaries 简明英语许可证摘要
- [FOSSA](https://fossa.com/blog/open-source-licenses-101-apache-license-2-0/) - License compliance 许可证合规性

### Legal Resources 法律资源

- [Open Source Initiative 开源倡议](https://opensource.org/) - Approved licenses 批准的许可证
- [Software Freedom Law Center 软件自由法律中心](https://softwarefreedom.org/)

### Research & Data 研究和数据

- [GitHub 2025 Innovation Graph](https://opensource.org/blog/top-open-source-licenses-in-2024) - License usage statistics 许可证使用统计
- [Open Source License Trends 2024 开源许可证趋势2024](https://www.mend.io/blog/open-source-licenses-trends-and-predictions/)

---

## Next Steps 下一步

1. **Review this guide 审查本指南** with your team 与您的团队
2. **Discuss priorities 讨论优先事项** (adoption vs protection vs simplicity 采用vs保护vs简洁性)
3. **Answer the decision framework questions 回答决策框架问题** (see above 见上文)
4. **Choose a license 选择许可证** (MIT or Apache 2.0 recommended 推荐)
5. **Document decision 记录决策** in an ADR (Architecture Decision Record 架构决策记录)
6. **Apply license 应用许可证** to all repositories 到所有仓库
7. **Add LICENSE file 添加LICENSE文件** to each repo root 到每个仓库根目录
8. **Update README 更新README** with license badge 带许可证徽章

---

## Questions for Team Discussion 团队讨论问题

Copy these to your meeting notes 将这些复制到您的会议记录:

- [ ] What's more important: maximum adoption or patent protection? 什么更重要：最大采用度还是专利保护？
- [ ] Will we file patents in the next 12 months? 我们会在接下来的12个月内申请专利吗？
- [ ] Do we want corporations (Nike, Adidas, Peloton) to use our tech? 我们希望企业（Nike、Adidas、Peloton）使用我们的技术吗？
- [ ] Are we seeking VC funding? (If yes, avoid GPL) 我们在寻求风险投资吗？（如果是，避免GPL）
- [ ] Do we want to prevent proprietary forks? (If yes, consider GPL) 我们想防止专有分支吗？（如果是，考虑GPL）
- [ ] What's our legal budget? ($0 = MIT, $5k+ = Apache) 我们的法律预算是多少？（$0 = MIT，$5k+ = Apache）
- [ ] Which licenses do our dependencies use? (check compatibility) 我们的依赖项使用哪些许可证？（检查兼容性）
- [ ] Do we want to build an open core business model later? 我们以后想建立开源核心业务模式吗？

---

## Appendix: License Comparison by Length 附录：按长度对比许可证

| License 许可证 | Word Count 字数 | Reading Time 阅读时间 |
|---------|-----------|--------------|
| Unlicense | ~150 words 单词 | 1 minute 分钟 |
| MIT | 109 words 单词 | 30 seconds 秒 |
| BSD 2-Clause | ~200 words 单词 | 1 minute 分钟 |
| BSD 3-Clause | ~300 words 单词 | 2 minutes 分钟 |
| MPL 2.0 | ~1,500 words 单词 | 8 minutes 分钟 |
| Apache 2.0 | ~4,000 words 单词 | 20 minutes 分钟 |
| GPL v3 | ~5,000 words 单词 | 25 minutes 分钟 |

**Insight 洞察:** Simpler licenses = faster adoption (developers actually read MIT, skip GPL) 更简单的许可证=更快的采用（开发者实际阅读MIT，跳过GPL）

---

## When to Get Legal Advice 何时获得法律建议

**You DON'T need a lawyer for 您不需要律师:**

- ✅ Choosing MIT or BSD (simple, well-understood 简单、易于理解)
- ✅ Hobby projects, learning projects 爱好项目、学习项目
- ✅ Small open source libraries 小型开源库

**You SHOULD consult a lawyer for 您应该咨询律师:**

- ⚠️ Choosing Apache 2.0 with patent strategy 选择Apache 2.0并有专利策略
- ⚠️ Choosing GPL (complex compliance 复杂的合规性)
- ⚠️ Mixing multiple licenses 混合多个许可证
- ⚠️ Accepting contributions from corporations 接受来自企业的贡献
- ⚠️ Commercial products with open source components 带有开源组件的商业产品
- ⚠️ When raising VC funding (investors may require specific licenses 投资者可能需要特定许可证)

**Cost 成本:** $200-$500 for basic license consultation 基本许可证咨询, $2,000-$5,000 for comprehensive IP strategy 全面的知识产权策略

---

**Document Version 文档版本:** 1.0
**Last Updated 最后更新:** 2025-12-01
**Maintained By 维护者:** Movement Chain AI Core Team
**Status 状态:** Living Document 活文档 - Update as team makes decisions 随团队决策更新
