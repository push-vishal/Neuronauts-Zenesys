<div align="center">

# 🚀 FINOVA
### *by Neuronauts*

**AI-Powered Procurement, Invoice, Expense & Project Cost Intelligence Platform**

[![Hackathon](https://img.shields.io/badge/ZENESIS-12hr%20Hackathon-blueviolet?style=for-the-badge)](#)
[![Status](https://img.shields.io/badge/status-MVP%20in%20progress-orange?style=for-the-badge)](#)
[![Stack](https://img.shields.io/badge/stack-FastAPI%20%7C%20Supabase%20%7C%20Gemini-38bdf8?style=for-the-badge)](#)

*Finance + Innovation + Intelligence*

</div>

---

FINOVA is an AI-powered financial operations platform that helps organizations manage **vendors, procurement, invoices, employee expenses, reimbursements, project costs, and payments** in one centralized system.

Unlike traditional financial management systems, which primarily record and report transactions, FINOVA goes further — analyzing historical financial data, detecting anomalies, surfacing cost-saving opportunities, forecasting future expenses, and delivering explainable recommendations to support better business decisions.

<br>

## 📑 Table of Contents

- 🎯 [Problem Statement](#problem-statement)
- 💡 [Our Core Idea](#our-core-idea)
- 🔬 [Research Gap](#research-gap)
- ⭐ [Unique Selling Proposition](#unique-selling-proposition)
- 🧩 [Minimum Viable Product](#minimum-viable-product)
- 🏢 [Target Users](#target-users)
- 🏗️ [System Architecture](#system-architecture)
- 🔄 [Core Business Workflow](#core-business-workflow)
- 🏢 [Enterprise-Grade ERP & NetSuite Modules](#enterprise-grade-erp--netsuite-modules)
- 🔒 [Security & Authentication](#security--authentication)
- 🌟 [Vision](#vision)

<br>

---

<br>

<a id="problem-statement"></a>
## 🎯 Problem Statement

> ### Invoice and Expense Management

Organizations often manage procurement, invoices, employee expenses, reimbursements, and project costs through disconnected systems, spreadsheets, emails, and manual workflows. This creates several recurring challenges:

| ⚠️ Challenge | Impact |
|---|---|
| Lack of centralized financial visibility | Slower, riskier decisions |
| Manual invoice and expense processing | Wasted time, human error |
| Duplicate or incorrect invoices | Overpayment, lost money |
| Mismatches between PO, GRN, and invoices | Reconciliation headaches |
| Difficult employee reimbursement management | Employee frustration |
| Poor visibility into actual project costs | Budget surprises |
| Vendor price increases going unnoticed | Silent margin erosion |
| Unexpected project budget overruns | Missed targets |
| Limited financial forecasting | Reactive, not proactive |
| Decisions based on hindsight, not insight | Missed opportunities |

FINOVA addresses these challenges by combining **financial management, procurement workflows, automation, analytics, and AI-driven intelligence** into a single platform.

<br>

---

<br>

<a id="our-core-idea"></a>
## 💡 Our Core Idea

Traditional financial systems primarily answer:

> **"What happened?"**

FINOVA is built to answer:

> **"What happened, why did it happen, what is likely to happen next, and what should the organization do about it?"**

FINOVA analyzes:

`Historical purchases` · `Vendor behavior` · `Invoice data` · `Employee expenses` · `Project expenses` · `Payment history` · `Procurement patterns` · `Subscription spending`

...and converts this information into **actionable, explainable recommendations**.

<br>

---

<br>

<a id="research-gap"></a>
## 🔬 Research Gap

Platforms such as **Zoho, SAP Concur, and Coupa** already offer extensive capabilities across invoice management, expense management, vendor management, procurement, approvals, automation, and analytics.

FINOVA is **not intended to replicate these existing features**. Instead, it focuses on an intelligence layer that uses an organization's **own historical financial and procurement data** to support proactive decision-making.

### 🧭 Key Research Direction

> **Historical Procurement Intelligence and Explainable Recommendations**

FINOVA compares current transactions against historical organizational data to identify:

`Price increases` · `Unusual spending` · `Vendor performance changes` · `Repeated purchases` · `Duplicate procurement` · `Cost anomalies` · `Subscription duplication` · `Budget risks`

The system then generates evidence-based recommendations grounded in this analysis.

<table>
<tr><td>

**📌 Example**

Vendor A's laptop price increased by **14%** compared to the organization's six-month purchasing history.

Similar products were previously purchased from Vendor B at a lower price.

**✅ Recommendation:** Request a quotation from Vendor B, or renegotiate pricing with Vendor A.

</td></tr>
</table>

Every recommendation is backed by **historical data and measurable evidence** — not a generic AI response.

<br>

---

<br>

<a id="unique-selling-proposition"></a>
## ⭐ Unique Selling Proposition (USP)

| | |
|---|---|
| 🎯 **Evidence-based, not generic AI** | Every recommendation is backed by an organization's own historical purchase, vendor, and expense data rather than a generic AI response. |
| 🔗 **Unified financial intelligence layer** | Brings procurement, invoicing, expenses, reimbursements, and project costs together, instead of leaving them siloed across spreadsheets, emails, and disconnected tools. |
| 📈 **Proactive, not just reporting** | Moves beyond "what happened" dashboards to explain *why* it happened, forecast *what's next*, and recommend *what to do*. |
| 🚨 **Anomaly and price-drift detection** | Automatically flags vendor price increases, duplicate invoices, PO/GRN/invoice mismatches, and duplicate subscriptions before they become costly. |
| 🔍 **Explainability at the core** | Recommendations are traceable to specific historical transactions and measurable evidence, building trust in AI-driven decisions. |
| 👥 **Built for real organizational roles** | Purpose-built workflows for procurement managers, finance teams, project managers, employees, CFOs, and vendors, rather than a one-size-fits-all interface. |

<br>

---

<br>

<a id="minimum-viable-product"></a>
## 🧩 Minimum Viable Product (MVP)

The MVP focuses on proving the core intelligence loop — **capture data → detect patterns → generate explainable recommendations** — before expanding into the full platform.

### ✅ Core MVP Features

- 🏢 **Vendor Management** — Add and manage vendor profiles and basic performance data
- 📋 **Procurement Workflow** — Create Purchase Orders (PO), record Goods Received Notes (GRN), and match them against invoices
- 🧾 **Invoice Management** — Upload, store, and track invoice status
- 💳 **Employee Expense & Reimbursement** — Submit expenses/receipts and track reimbursement status
- 📊 **Project Cost Tracking** — Assign expenses to projects and monitor budget vs. actual spend
- 🔎 **Historical Comparison Engine** — Compare current purchases/invoices against historical data
- 🚨 **Anomaly Detection (v1)** — Flag price increases, duplicate invoices, and duplicate subscriptions
- 💡 **Explainable Recommendations** — Generate a basic recommendation report with supporting evidence (e.g., *"Vendor A price increased X% — compare with Vendor B"*)
- 🖥️ **Role-Based Dashboards** — Simple views for Procurement Manager, Finance Team, Project Manager, Employee, and CFO/Management

<details>
<summary><b>🔭 Out of Scope for MVP (Future Phases)</b></summary>
<br>

- Advanced forecasting models
- Multi-currency and multi-entity support
- Deep ERP/accounting software integrations
- Automated approval workflows with custom rules engines
- Vendor self-service portal (beyond basic invoice submission)

</details>

<br>

---

<br>

<a id="target-users"></a>
## 🏢 Target Users

<div align="center">

`Startups` · `SMBs` · `Educational Institutions` · `Manufacturing` · `Healthcare` · `Construction` · `Retail` · `Service-Based Companies` · `Project-Based Teams` · `Large Enterprises`

</div>
<br>

### 👤 Primary Users

<table>
<tr>
<td width="33%" valign="top">

**👨‍💼 Procurement Manager**
- Manage vendors
- Create purchase orders
- Analyze vendor performance
- Compare historical prices
- Identify cost-saving opportunities

</td>
<td width="33%" valign="top">

**💰 Finance / Accounts Team**
- Manage invoices
- Verify expenses
- Track accounts payable
- Process reimbursements
- Monitor payments

</td>
<td width="33%" valign="top">

**📊 Project Manager**
- Track project budgets
- Monitor project expenses
- View actual project cost
- Detect budget overruns

</td>
</tr>
<tr>
<td width="33%" valign="top">

**👨‍💻 Employee**
- Submit expenses
- Upload receipts/invoices
- Request reimbursement
- Track reimbursement status

</td>
<td width="33%" valign="top">

**🧑‍💼 Management / CFO**
- Monitor org-wide spending
- Analyze vendor performance
- Review financial trends
- Identify cost-saving opportunities
- Monitor financial risks

</td>
<td width="33%" valign="top">

**🏢 Vendor**
- Submit invoices
- Track invoice status
- Monitor payment status

</td>
</tr>
</table>

<br>

---

<br>

<a id="system-architecture"></a>
## 🏗️ System Architecture

```mermaid
flowchart TD
    A["🖥️ Web Client<br/>HTML / CSS / JS"] --> B["⚡ FastAPI<br/>Backend / REST APIs"]
    B --> C["🗄️ PostgreSQL<br/>Database"]
    B --> D["🔐 Supabase Auth"]
    B --> E["📦 Supabase Storage"]
    C --> F["🔁 n8n<br/>Automation"]
    D --> F
    E --> F
    F --> G["🤖 AI / Gemini"]
    F --> H["📈 Analytics<br/>Python / SQL"]
    F --> I["🔔 Notifications /<br/>Alerts"]

    style A fill:#1e293b,stroke:#38bdf8,color:#fff
    style B fill:#1e293b,stroke:#38bdf8,color:#fff
    style C fill:#0f172a,stroke:#22c55e,color:#fff
    style D fill:#0f172a,stroke:#22c55e,color:#fff
    style E fill:#0f172a,stroke:#22c55e,color:#fff
    style F fill:#1e293b,stroke:#facc15,color:#fff
    style G fill:#0f172a,stroke:#a855f7,color:#fff
    style H fill:#0f172a,stroke:#a855f7,color:#fff
    style I fill:#0f172a,stroke:#a855f7,color:#fff
```

**Automation flow:**

```mermaid
flowchart LR
    A["Invoice / Expense<br/>Event"] --> B["n8n"] --> C["Validation"] --> D["Database"] --> E["AI Analysis"] --> F["Action /<br/>Notification"]

    style A fill:#1e293b,stroke:#38bdf8,color:#fff
    style B fill:#1e293b,stroke:#facc15,color:#fff
    style C fill:#0f172a,stroke:#22c55e,color:#fff
    style D fill:#0f172a,stroke:#22c55e,color:#fff
    style E fill:#0f172a,stroke:#a855f7,color:#fff
    style F fill:#0f172a,stroke:#f97316,color:#fff
```

### ⚙️ Stack Overview

| Layer | Technology |
|---|---|
| 🖥️ **Frontend** | HTML, CSS, JavaScript |
| ⚡ **Backend** | FastAPI (REST APIs) |
| 🗄️ **Data layer** | PostgreSQL, Supabase (Auth + Storage) |
| 🔁 **Automation layer** | n8n |
| 🤖 **Intelligence layer** | Gemini AI, Python/SQL analytics |
| 🔔 **Output layer** | Notifications / Alerts |

<br>

---

<br>

<a id="core-business-workflow"></a>
## 🔄 Core Business Workflow

```mermaid
flowchart TD
    ORG["🏢 Organisation"] --> V["🏭 Vendors"]
    ORG --> P["📁 Projects"]
    ORG --> EMP["👥 Employees"]

    V --> PROC["📋 Procurement"]
    P --> BUD["💰 Project Budget"]
    EMP --> EXP["🧾 Employee Expense"]

    PROC --> PO["📄 PO"] --> COST["📊 Project Cost"]
    BUD --> COST
    EXP --> REC["🧾 Receipt"] --> COST

    PO --> GRN["📦 GRN"] --> INV["🧾 Invoice"]
    REC --> REIMB["💳 Reimbursement"]

    INV --> AI["🤖 Analytics + AI"]
    COST --> AI
    REIMB --> AI

    AI --> HIST["📈 Historical Analysis"]
    AI --> REC2["💡 Recommendations"]

    style ORG fill:#1e293b,stroke:#38bdf8,color:#fff
    style AI fill:#1e293b,stroke:#facc15,color:#fff
    style HIST fill:#0f172a,stroke:#22c55e,color:#fff
    style REC2 fill:#0f172a,stroke:#a855f7,color:#fff
```

<br>

---

<br>

<a id="enterprise-grade-erp--netsuite-modules"></a>
## 🏢 Enterprise-Grade ERP & NetSuite Modules

```mermaid
flowchart TD
    A["🧠 FINOVA AI Layer"] --> B["📄 Gemini 2.0 Vision<br/>Invoice Extraction"]
    A --> C["✅ 3-Way PO / GRN<br/>Matching"]
    A --> D["📈 Price-Drift<br/>Detection"]
    B --> E["🔗 Oracle NetSuite /<br/>ERP Integration"]
    C --> E
    D --> E

    style A fill:#1e293b,stroke:#facc15,color:#fff
    style B fill:#0f172a,stroke:#a855f7,color:#fff
    style C fill:#0f172a,stroke:#22c55e,color:#fff
    style D fill:#0f172a,stroke:#f97316,color:#fff
    style E fill:#1e293b,stroke:#38bdf8,color:#fff
```

### 🔄 ERP Integration Mapping

| FINOVA | NetSuite |
|---|---|
| Invoice | Vendor Bill |
| Purchase Order | Purchase Order |
| Receipt / GRN | Item Receipt |
| Expense | Expense Report |

### ✨ Enterprise Features

- 🔄 Bi-directional SuiteTalk REST API sync
- 📑 Automatic double-entry GL mapping (Debit / Credit)
- 🏢 Auto allocation for Department, Class & Location
- 📊 Real-time budget commitment & encumbrance checks

<br>

---

<br>

<a id="security--authentication"></a>
## 🔒 Security & Authentication

```mermaid
flowchart TD
    A["🌐 Browser Client"] -->|"JWT Bearer Token (Supabase Auth)"| B["⚡ FastAPI Backend<br/>🔑 API Secrets in Server Memory (.env)"]
    B --> C["🗄️ Supabase PostgreSQL"]
    B --> D["🤖 Gemini 2.0 AI"]
    B --> E["📊 Oracle NetSuite"]

    C -.->|"Row-Level Security (RLS)"| C1["Token-Based Auth &<br/>Encrypted Storage"]
    D -.->|"Google GenAI SDK"| D1["Encrypted Transit"]
    E -.->|"OAuth 1.0a"| E1["HMAC-SHA256"]

    style A fill:#1e293b,stroke:#38bdf8,color:#fff
    style B fill:#1e293b,stroke:#38bdf8,color:#fff
    style C fill:#0f172a,stroke:#22c55e,color:#fff
    style D fill:#0f172a,stroke:#a855f7,color:#fff
    style E fill:#0f172a,stroke:#f97316,color:#fff
```

<br>

---

<br>

<a id="vision"></a>
<div align="center">

## 🌟 Vision

**FINOVA transforms organizational financial data into intelligent, explainable and actionable decisions.**

Built with ❤️ by **Neuronauts** in the ZENESIS 12-hour Hackathon

### 🚀 FINOVA
*Finance + Innovation + Intelligence*

</div>
