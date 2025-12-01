# Open Source License Comparison Guide

**Status:** Decision Pending
**Date:** 2025-12-01
**Purpose:** Help team evaluate license options for Movement Chain AI repositories

---

## Executive Summary

This guide compares the most common open source licenses used in hardware and software startups. Use this document to make an informed decision about which license to apply to the Movement Chain AI project.

**Quick Recommendation Matrix:**

| Your Priority | Recommended License |
|---------------|---------------------|
| Maximum contributor adoption | MIT |
| Patent protection + adoption | Apache 2.0 |
| Force competitors to open source | GPL v3 |
| Academic/research use | BSD 3-Clause |
| Simplicity above all | Unlicense or MIT |

---

## The 7 Most Common Open Source Licenses

### 1. MIT License

**Market Share:** ~33% of GitHub repositories (most popular)

**Summary:** Maximum freedom, minimal restrictions. "Do whatever you want, just keep the copyright notice."

#### Full License Text (109 words)
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

#### Pros ✅
- **Simplest license** - Everyone understands it (109 words)
- **Maximum adoption** - Most popular on GitHub (33% market share)
- **No patent issues** - Simple enough to avoid patent complications
- **Corporate-friendly** - Companies love it (no viral requirements)
- **Compatible with everything** - Works with GPL, Apache, BSD
- **Developer trust** - Most recognized and trusted by open source community
- **Fast approval** - Legal teams approve in minutes, not days

#### Cons ❌
- **No explicit patent grant** - Silent on patent rights (legal ambiguity)
- **No trademark protection** - Doesn't address trademark usage
- **No contribution terms** - Doesn't specify contributor rights
- **Minimal legal protection** - Very brief, doesn't cover edge cases
- **Patent trolls** - No protection against patent lawsuits

#### Best For
- Public libraries and frameworks
- Projects prioritizing maximum adoption
- Developer tools and SDKs
- Startups wanting fast community growth
- Projects where simplicity > legal protection

#### Used By
- React (Facebook/Meta)
- Node.js
- jQuery
- Ruby on Rails
- .NET Core (Microsoft - switched from Apache to MIT)

---

### 2. Apache License 2.0

**Market Share:** ~15-20% of GitHub repositories

**Summary:** Permissive like MIT, but with explicit patent protection. "Do whatever you want, but with clear patent terms."

#### License Length
~4,000 words (comprehensive legal document)

#### Key Clauses
1. **Patent Grant:** Contributors grant you patent rights to their contributions
2. **Patent Retaliation:** If you sue for patent infringement, your license terminates
3. **Trademark Protection:** Doesn't grant trademark rights
4. **Contribution Terms:** Clear terms for accepting contributions
5. **Warranty Disclaimer:** No warranties provided

#### Pros ✅
- **Explicit patent protection** - Clear patent grant from contributors
- **Patent retaliation clause** - Deters patent trolls
- **Contribution clarity** - Defines how contributions are handled
- **Corporate-friendly** - Preferred by large tech companies
- **Comprehensive** - Covers edge cases MIT doesn't
- **File patents later** - Doesn't prevent you from filing your own patents
- **Better for hardware** - Important for projects with patent implications

#### Cons ❌
- **Longer license** - 4,000+ words (intimidating for some developers)
- **GPL v2 incompatibility** - Cannot combine with GPL v2 code
- **Slower legal approval** - Takes longer for legal teams to review
- **Less familiar** - Some developers don't read/understand it
- **Overkill for simple projects** - More complex than needed for basic software

#### Best For
- Projects with patent considerations
- Hardware + software combinations
- Enterprise-focused projects
- Projects accepting contributions from corporations
- Startups planning to file patents

#### Used By
- Android (Google)
- TensorFlow (Google)
- Kubernetes (Cloud Native Computing Foundation)
- Apache projects (Hadoop, Spark, Cassandra)
- Swift (Apple)

---

### 3. GNU General Public License v3 (GPL v3)

**Market Share:** ~10-15% of GitHub repositories

**Summary:** Copyleft/viral license. "You can use this, but any modifications must also be open source under GPL."

#### License Length
~5,000 words (very comprehensive)

#### Key Clauses
1. **Copyleft Requirement:** Modified versions must be GPL v3
2. **Source Code Requirement:** Must provide source code to users
3. **Patent Grant:** Contributors grant patent rights
4. **Anti-Tivoization:** Prevents hardware lockdown (must allow user modifications)
5. **Network Use Clause:** Server-side use triggers obligations (AGPL variant)

#### Pros ✅
- **Prevents proprietary forks** - Competitors must open source their changes
- **Community protection** - Ensures improvements stay open source
- **Patent protection** - Explicit patent grant
- **Strong copyleft** - Forces ecosystem to stay open
- **Ideological alignment** - Aligns with Free Software Foundation values
- **Prevents "embrace and extend"** - Big tech can't close-source your project

#### Cons ❌
- **Limits commercial use** - Companies avoid GPL (legal risk)
- **Reduces adoption** - Developers skip GPL projects when possible
- **Incompatible with MIT/Apache** - Can't combine with permissive code easily
- **Investor-unfriendly** - VCs dislike GPL (limits monetization)
- **Complex compliance** - Hard to use GPL correctly
- **Talent pool smaller** - Many developers avoid GPL projects
- **Corporate blacklist** - Many companies ban GPL dependencies

#### Best For
- Ideological projects (Free Software movement)
- Projects wanting to prevent proprietary forks
- Academic research (force publication of derivatives)
- Projects not seeking VC funding
- Developer tools (GCC, Linux kernel)

#### Used By
- Linux kernel
- GCC (GNU Compiler Collection)
- GIMP
- WordPress (GPL v2, not v3)
- Bash

---

### 4. BSD 3-Clause License ("BSD License Modified")

**Market Share:** ~5-10% of GitHub repositories

**Summary:** Like MIT, but with an additional clause about endorsements. "Do whatever you want, but don't use our name to promote your product."

#### Full License Text (~300 words)
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

#### Pros ✅
- **Simple like MIT** - Easy to understand (300 words)
- **Endorsement protection** - Prevents misuse of your name
- **Academic-friendly** - Popular in universities
- **Permissive** - Allows commercial use
- **Well-understood** - Established license (since 1988)

#### Cons ❌
- **Less popular than MIT** - Smaller community recognition
- **Redundant clause** - Clause 3 is often legally unnecessary (trademark law covers this)
- **No patent clause** - Same issue as MIT
- **Slightly longer** - More text than MIT (minor)

#### Best For
- Academic projects
- Research software
- Projects concerned about name misuse
- University spin-offs

#### Used By
- FreeBSD
- Django (web framework)
- Flask (web framework)
- Redis (later switched to custom license)

---

### 5. BSD 2-Clause License ("Simplified BSD" / "FreeBSD License")

**Market Share:** ~3-5% of GitHub repositories

**Summary:** BSD 3-Clause without the endorsement clause. Nearly identical to MIT.

#### Full License Text (~200 words)
Same as BSD 3-Clause, but removes Clause 3 (endorsement restriction).

#### Pros ✅
- **Simpler than BSD 3-Clause** - Removes unnecessary clause
- **Permissive** - Maximum freedom
- **Academic legacy** - Historical trust from BSD Unix

#### Cons ❌
- **Less popular than MIT** - Why use this when MIT is more recognized?
- **No advantages over MIT** - Functionally equivalent
- **Confusing** - People ask "Why BSD 2-Clause instead of MIT?"

#### Best For
- Situations where BSD brand is important (legacy projects)
- When MIT seems "too corporate"

#### Used By
- Nginx
- dnsmasq

---

### 6. Mozilla Public License 2.0 (MPL 2.0)

**Market Share:** ~2-3% of GitHub repositories

**Summary:** "Weak copyleft" - File-level copyleft, not project-level. "Modified files must stay open, but you can combine with proprietary code."

#### License Length
~1,500 words

#### Key Clauses
1. **File-level copyleft:** Modified MPL files must stay MPL
2. **Linking exception:** Can link with proprietary code
3. **Patent grant:** Explicit patent protection
4. **Secondary licensing:** Can be combined with GPL

#### Pros ✅
- **Balanced approach** - Middle ground between MIT and GPL
- **Patent protection** - Explicit grant like Apache 2.0
- **Corporate-friendly** - Allows proprietary combinations
- **Prevents embrace-and-extend** - Core files stay open

#### Cons ❌
- **Rare** - Less than 3% adoption (unfamiliar to many developers)
- **Complex compliance** - File-level tracking is hard
- **Confusing** - People don't understand "weak copyleft"
- **Niche** - Only makes sense for specific use cases

#### Best For
- Libraries that want to stay open but allow proprietary use
- Projects from Mozilla ecosystem
- When you want some protection but not full GPL

#### Used By
- Firefox
- Thunderbird
- LibreOffice

---

### 7. Unlicense (Public Domain)

**Market Share:** <1% of GitHub repositories

**Summary:** "Do literally anything. No restrictions. No attribution required."

#### Full License Text (~150 words)
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

#### Pros ✅
- **Maximum freedom** - True public domain
- **No attribution** - Not even copyright notice required
- **Simple** - Shorter than MIT

#### Cons ❌
- **Legal uncertainty** - "Public domain" doesn't exist in all countries
- **No protection** - Zero legal protection for you
- **No branding** - People can claim they wrote it
- **Rare** - Almost no projects use this

#### Best For
- Tiny utilities, snippets, examples
- When you truly don't care about credit

#### Used By
- Some SQLite components
- Small code snippets and gists

---

## Side-by-Side Comparison Table

| Feature | MIT | Apache 2.0 | GPL v3 | BSD 3-Clause | MPL 2.0 |
|---------|-----|-----------|--------|--------------|---------|
| **Popularity** | 🏆 33% | 🥈 18% | 🥉 12% | 6% | 2% |
| **Length** | 109 words | 4,000 words | 5,000 words | 300 words | 1,500 words |
| **Simplicity** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Commercial Use** | ✅ Yes | ✅ Yes | ⚠️ Restricted | ✅ Yes | ✅ Yes |
| **Patent Protection** | ❌ No | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| **Copyleft (Viral)** | ❌ No | ❌ No | ✅ Strong | ❌ No | ⚠️ Weak |
| **Corporate Friendly** | ✅✅✅ | ✅✅✅ | ❌❌ | ✅✅ | ✅✅ |
| **VC Friendly** | ✅✅✅ | ✅✅✅ | ❌ | ✅✅ | ✅✅ |
| **Developer Trust** | ✅✅✅ | ✅✅ | ✅ | ✅✅ | ⭐ |
| **Can File Patents?** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Contributor Clarity** | ❌ Vague | ✅ Clear | ✅ Clear | ❌ Vague | ✅ Clear |

**Legend:**
- ✅ = Supported/Good
- ❌ = Not supported/Bad
- ⚠️ = Partial/Conditional
- ⭐ = Rating (1-5 stars)

---

## Decision Framework for Movement Chain AI

### Questions to Ask Your Team

**1. What's your primary goal?**
- [ ] Maximum contributor adoption → **MIT** or **Apache 2.0**
- [ ] Prevent proprietary forks → **GPL v3**
- [ ] Patent protection important → **Apache 2.0** or **GPL v3**
- [ ] Keep it simple → **MIT**

**2. Will you file patents?**
- [ ] Yes, definitely → **Apache 2.0** (explicit patent protection)
- [ ] Maybe later → **MIT** or **Apache 2.0** (both allow this)
- [ ] No → **MIT** (simpler)

**3. Do you want corporate adoption?**
- [ ] Yes (Nike, Adidas, Peloton using your tech) → **MIT** or **Apache 2.0**
- [ ] No (community-driven only) → **GPL v3**

**4. How important is preventing competition?**
- [ ] Very (force competitors to open source) → **GPL v3**
- [ ] Not important (let them use it) → **MIT** or **Apache 2.0**

**5. Are you seeking VC funding?**
- [ ] Yes → **MIT** or **Apache 2.0** (investor-friendly)
- [ ] No (bootstrapped, grants, crowdfunding) → Any license

**6. What's your team's legal budget?**
- [ ] $0 (can't afford legal review) → **MIT** (simplest)
- [ ] $5,000+ (can get legal advice) → **Apache 2.0** (comprehensive)

---

## Industry Benchmarks

### Hardware Startups
- **Arduino:** GPL v2 (hardware) + LGPL (software)
- **Raspberry Pi:** Mix of proprietary (hardware) + BSD (software)
- **Adafruit:** MIT (most projects)
- **SparkFun:** CC BY-SA (hardware) + Beerware/MIT (software)

**Trend:** Hardware = Permissive (MIT/BSD), Firmware = Mixed

### Wearable Tech Companies
- **Fitbit:** Proprietary (closed source)
- **Pebble:** Mix of Apache 2.0 and proprietary
- **OpenBCI:** MIT license

**Trend:** Consumer wearables = Proprietary, Developer wearables = MIT/Apache

### ML/AI Startups
- **Hugging Face:** Apache 2.0
- **OpenAI:** MIT (for released code)
- **Stability AI:** Various (CreativeML for Stable Diffusion)
- **TensorFlow (Google):** Apache 2.0

**Trend:** ML/AI = Apache 2.0 (patent protection important)

### Mobile App Frameworks
- **Flutter (Google):** BSD 3-Clause
- **React Native (Meta):** MIT
- **Ionic:** MIT

**Trend:** Developer frameworks = MIT/BSD (maximum adoption)

---

## Switching Licenses Later

### Can You Change Licenses?

**Yes, BUT it's complicated:**

#### Permissive → More Permissive (EASY)
```
Apache 2.0 → MIT ✅ Easy
BSD → MIT ✅ Easy
```

#### Permissive → Copyleft (HARD)
```
MIT → GPL v3 ⚠️ Requires permission from ALL contributors
Apache → GPL v3 ⚠️ Very difficult
```

#### Copyleft → Permissive (IMPOSSIBLE)
```
GPL v3 → MIT ❌ Cannot relicense without unanimous consent
GPL v3 → Apache ❌ Nearly impossible
```

**Lesson:** Start permissive (MIT/Apache). You can always add restrictions later, but you can NEVER remove them.

---

## Recommendations by Scenario

### Scenario 1: "We want maximum GitHub stars and contributors"
**→ MIT License**
- Simplest, most trusted
- 33% of GitHub uses it
- No barriers to contribution

### Scenario 2: "We might file patents in 6-12 months"
**→ Apache 2.0**
- Explicit patent protection
- Still permissive enough for adoption
- Corporate-friendly

### Scenario 3: "We want to prevent big tech from stealing our work"
**→ GPL v3**
- Forces derivatives to open source
- Prevents proprietary forks
- BUT: Limits adoption significantly

### Scenario 4: "We're an academic research project"
**→ BSD 3-Clause** or **MIT**
- Academic tradition (BSD)
- Simple and permissive

### Scenario 5: "We want to build a business with open core model"
**→ MIT or Apache 2.0**
- Open source core (MIT/Apache)
- Proprietary premium features (closed source)
- This is the Supabase/GitLab model

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Choosing GPL for a startup
**Problem:** Limits commercial adoption, scares investors
**Solution:** Use MIT or Apache 2.0

### ❌ Mistake 2: Not choosing a license at all
**Problem:** All rights reserved by default (proprietary)
**Solution:** Pick ANY license (MIT is safe default)

### ❌ Mistake 3: Mixing incompatible licenses
**Problem:** GPL + Apache in same project = legal nightmare
**Solution:** Check compatibility before combining code

### ❌ Mistake 4: Changing licenses without contributor consent
**Problem:** Illegal, lawsuit risk
**Solution:** Get written permission from ALL contributors OR rewrite all code

### ❌ Mistake 5: Thinking license = patent
**Problem:** Licenses and patents are separate legal protections
**Solution:** Understand you can have BOTH (open source + patents)

---

## License Compatibility Matrix

Can you combine code from different licenses?

| Your Project | Can Include MIT? | Can Include Apache 2.0? | Can Include BSD? | Can Include GPL v3? | Can Include MPL 2.0? |
|--------------|------------------|------------------------|------------------|---------------------|----------------------|
| **MIT** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No* | ✅ Yes |
| **Apache 2.0** | ✅ Yes | ✅ Yes | ✅ Yes | ⚠️ Maybe** | ✅ Yes |
| **BSD 3-Clause** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No* | ✅ Yes |
| **GPL v3** | ✅ Yes*** | ⚠️ Maybe** | ✅ Yes*** | ✅ Yes | ✅ Yes |
| **MPL 2.0** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |

**Notes:**
- *Cannot include GPL in permissive project (GPL is viral)
- **Apache 2.0 + GPL v3 is compatible, but Apache + GPL v2 is NOT
- ***GPL can include permissive code, but overall project becomes GPL

---

## Resources & Further Reading

### Official License Texts
- [MIT License](https://opensource.org/licenses/MIT)
- [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)
- [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html)
- [BSD 3-Clause](https://opensource.org/licenses/BSD-3-Clause)
- [Mozilla Public License 2.0](https://www.mozilla.org/en-US/MPL/2.0/)

### License Selection Tools
- [Choose a License](https://choosealicense.com/) - GitHub's guide
- [TLDRLegal](https://tldrlegal.com/) - Plain English license summaries
- [FOSSA](https://fossa.com/blog/open-source-licenses-101-apache-license-2-0/) - License compliance

### Legal Resources
- [Open Source Initiative](https://opensource.org/) - Approved licenses
- [Software Freedom Law Center](https://softwarefreedom.org/)

### Research & Data
- [GitHub 2025 Innovation Graph](https://opensource.org/blog/top-open-source-licenses-in-2024) - License usage statistics
- [Open Source License Trends 2024](https://www.mend.io/blog/open-source-licenses-trends-and-predictions/)

---

## Next Steps

1. **Review this guide** with your team
2. **Discuss priorities** (adoption vs protection vs simplicity)
3. **Answer the decision framework questions** (see above)
4. **Choose a license** (MIT or Apache 2.0 recommended)
5. **Document decision** in an ADR (Architecture Decision Record)
6. **Apply license** to all repositories
7. **Add LICENSE file** to each repo root
8. **Update README** with license badge

---

## Questions for Team Discussion

Copy these to your meeting notes:

- [ ] What's more important: maximum adoption or patent protection?
- [ ] Will we file patents in the next 12 months?
- [ ] Do we want corporations (Nike, Adidas, Peloton) to use our tech?
- [ ] Are we seeking VC funding? (If yes, avoid GPL)
- [ ] Do we want to prevent proprietary forks? (If yes, consider GPL)
- [ ] What's our legal budget? ($0 = MIT, $5k+ = Apache)
- [ ] Which licenses do our dependencies use? (check compatibility)
- [ ] Do we want to build an open core business model later?

---

## Appendix: License Comparison by Length

| License | Word Count | Reading Time |
|---------|-----------|--------------|
| Unlicense | ~150 words | 1 minute |
| MIT | 109 words | 30 seconds |
| BSD 2-Clause | ~200 words | 1 minute |
| BSD 3-Clause | ~300 words | 2 minutes |
| MPL 2.0 | ~1,500 words | 8 minutes |
| Apache 2.0 | ~4,000 words | 20 minutes |
| GPL v3 | ~5,000 words | 25 minutes |

**Insight:** Simpler licenses = faster adoption (developers actually read MIT, skip GPL)

---

## When to Get Legal Advice

**You DON'T need a lawyer for:**
- ✅ Choosing MIT or BSD (simple, well-understood)
- ✅ Hobby projects, learning projects
- ✅ Small open source libraries

**You SHOULD consult a lawyer for:**
- ⚠️ Choosing Apache 2.0 with patent strategy
- ⚠️ Choosing GPL (complex compliance)
- ⚠️ Mixing multiple licenses
- ⚠️ Accepting contributions from corporations
- ⚠️ Commercial products with open source components
- ⚠️ When raising VC funding (investors may require specific licenses)

**Cost:** $200-$500 for basic license consultation, $2,000-$5,000 for comprehensive IP strategy

---

**Document Version:** 1.0
**Last Updated:** 2025-12-01
**Maintained By:** Movement Chain AI Core Team
**Status:** Living Document - Update as team makes decisions
