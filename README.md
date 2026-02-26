# [PowerSun.vip](https://powersun.vip) — TRON Energy & Bandwidth MCP Server

> **The first TRON Energy marketplace for AI agents.**
> Buy energy, sell resources, and earn passive income — fully autonomous via MCP, REST API, or HTTP 402.
> **Only 10% commission** — the lowest on the market.

[![MCP](https://img.shields.io/badge/MCP-Streamable_HTTP-blue)](https://powersun.vip/mcp)
[![Tools](https://img.shields.io/badge/Tools-21-green)](https://powersun.vip/agents)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-orange)](https://powersun.vip/openapi.json)
[![Commission](https://img.shields.io/badge/Commission-10%25-brightgreen)](https://powersun.vip)

**MCP Endpoint:** `https://powersun.vip/mcp`
**Transport:** Streamable HTTP (remote — no installation required)
**Auth:** Optional `X-API-Key` header (public tools work without authentication)

---

## About [PowerSun.vip](https://powersun.vip)

[PowerSun.vip](https://powersun.vip) is a full-featured **TRON Energy & Bandwidth marketplace** where users and AI agents can buy and sell network resources required for TRON transactions.

### Platform Highlights

- **Only 10% commission** — competitors charge 15–30%. [PowerSun.vip](https://powersun.vip) offers the lowest fees on the market.
- **Save 20–50%** on TRON transaction fees by renting Energy instead of burning TRX.
- **Instant delegation** — Energy is delegated to your address within seconds after payment.
- **Flexible durations** — rent from 5 minutes to 30 days, pay only for what you need.
- **Autonomous selling** — AI agents can register pools, verify permissions, vote for SRs, and earn passive income entirely through MCP.
- **Human + AI friendly** — full web interface for humans, MCP + REST API + HTTP 402 for agents.
- **No registration required** — use HTTP 402 pay-per-use or x402 (USDC on Base) without creating an account.

### Why TRON Energy Matters

Every TRON transaction (USDT transfers, smart contract calls) requires Energy. Without it, TRX tokens are burned as fees. For example, a single USDT transfer burns ~27 TRX (~$7) without Energy. With [PowerSun.vip](https://powersun.vip), the same transfer costs as little as ~$1.

---

## MCP Server — Quick Start

### Connect from Claude Desktop / Cursor / any MCP client

```json
{
  "mcpServers": {
    "powersun": {
      "url": "https://powersun.vip/mcp"
    }
  }
}
```

That's it — no API keys, no npm install, no Docker. The server is hosted and always available.

### With authentication (for balance, orders & selling)

```json
{
  "mcpServers": {
    "powersun": {
      "url": "https://powersun.vip/mcp",
      "headers": {
        "X-API-Key": "ps_your_api_key_here"
      }
    }
  }
}
```

---

## MCP Tools (21 total)

### Market Tools — 4 tools (public, no auth required)

| Tool | Description |
|------|-------------|
| `get_prices` | Current Energy & Bandwidth prices for all duration tiers (5min to 30d) |
| `estimate_cost` | Calculate exact cost for a specific energy amount and duration |
| `get_available_resources` | Check available Energy & Bandwidth in the marketplace |
| `get_market_overview` | Full market snapshot — prices, availability, order stats |

### Buyer Tools — 6 tools (auth recommended)

| Tool | Description |
|------|-------------|
| `buy_energy` | Purchase Energy delegation for any TRON address |
| `get_balance` | Account balance and deposit address |
| `get_orders` | List your recent orders |
| `get_order_status` | Detailed order status with delegation progress |
| `get_deposit_info` | Get deposit address and payment instructions |
| `broadcast_transaction` | Broadcast a pre-signed TRON transaction with automatic Energy delegation |

### Seller Tools — 11 tools (auth required)

#### Pool Management
| Tool | Description |
|------|-------------|
| `register_pool` | Register a TRON address as a selling pool (autonomous onboarding) |
| `get_pool_stats` | Pool performance and delegation statistics |
| `get_earnings` | Earnings breakdown and history |
| `get_auto_selling_config` | Current auto-selling configuration |
| `configure_auto_selling` | Enable/disable auto-selling with price settings |
| `get_pool_delegations` | Active delegations from your pool |
| `withdraw_earnings` | Withdraw earned TRX to your wallet |

#### On-Chain Operations
| Tool | Description |
|------|-------------|
| `get_onchain_status` | Live blockchain state — balance, frozen TRX, energy/bandwidth, votes, claimable rewards |
| `check_pool_permissions` | Verify platform has required on-chain permissions (delegate, undelegate, vote) |
| `trigger_vote` | Vote for Super Representative to earn staking rewards |
| `get_auto_action_history` | View auto-action execution logs (stake, vote, claim) |

---

## Become a Seller — Autonomous Flow

AI agents can go from "I have a TRON wallet with TRX" to "I'm earning passive income" entirely through MCP:

### Step 1: Register Pool
```
MCP tool: register_pool
→ Creates selling pool + auto-selling config
→ Returns step-by-step guide for granting permissions
```

### Step 2: Grant Permissions
Grant 3 active permissions to the platform address (via TronLink or tronWeb):
- **DelegateResource** (57) — delegate energy to buyers
- **UnDelegateResource** (58) — reclaim delegated resources
- **VoteWitness** (4) — vote for SRs to earn rewards

> **Security:** Agent permissions are limited to delegate, undelegate, and vote only. Staking (freeze) and reward claiming are managed by the platform automatically.

### Step 3: Verify Permissions
```
MCP tool: check_pool_permissions
→ Reads on-chain permissions and shows status per operation
→ Reports missing required/optional permissions
```

### Step 4: Vote & Earn
```
MCP tool: trigger_vote
→ Votes for the highest-APY Super Representative
→ Returns SR details, vote count, and tx hash
```

### Step 5: Monitor
```
MCP tools: get_onchain_status, get_earnings, get_auto_action_history
→ Track balance, frozen TRX, energy usage, voting rewards
→ View selling earnings and auto-action execution logs
```

---

## Payment Methods

[PowerSun.vip](https://powersun.vip) supports three payment flows — choose what's most convenient:

### 1. API Key + TRX Balance
Register a TRON wallet, deposit TRX, buy from balance. Best for repeat usage.

### 2. HTTP 402 Pay-per-use (TRX)
No registration needed. Request energy → receive 402 response with platform deposit address and unique TRX amount → send exact amount to the platform wallet on TRON → poll for completion. Payment is matched by unique amount. Fully autonomous.

### 3. x402 Protocol (USDC on Base)
No registration needed. Request energy → receive 402 with x402 payment requirements → sign EIP-3009 `transferWithAuthorization` → resend with `X-PAYMENT` header → instant settlement. Cross-chain payments powered by [Coinbase x402](https://www.coinbase.com/x402).

---

## REST API

Full REST API available alongside MCP:

| Endpoint | Description |
|----------|-------------|
| `POST /api/v2/agent/register` | Start wallet registration |
| `POST /api/v2/agent/verify` | Verify signature, get API key |
| `POST /api/v2/agent/estimate` | Estimate cost |
| `POST /api/v2/agent/buy-energy` | Purchase energy (API key, 402, or x402) |
| `GET /api/v2/agent/balance` | Check balance |
| `GET /api/v2/agent/order/{id}` | Order status |
| `GET /api/v2/agent/payment-status/{id}` | 402 payment status |
| `POST /api/v2/agent/broadcast` | Broadcast transaction |

---

## Pricing

### Energy Prices

| Duration | Min Price (SUN/unit) |
|----------|---------------------|
| 5 min | 80 |
| 10 min | 75 |
| 15 min | 70 |
| 30 min | 65 |
| 1 hour | 60 |
| 6 hours | 57 |
| 1 day | 55 |
| 7 days | 52 |
| 30 days | 50 |

Bandwidth prices follow a 10x ratio (e.g. 800 SUN for 5 min, 500 SUN for 30 days).

| | |
|----------|---------|
| Commission | **Only 10%** — lowest on the market |
| Savings | **20–50%** vs TRX burn |

**Available durations:** 5min, 10min, 15min, 30min, 1h, 6h, 1d, 7d, 30d

### Commission Comparison

| Platform | Commission |
|----------|-----------|
| **[PowerSun.vip](https://powersun.vip)** | **10%** |
| Competitor A | 15–20% |
| Competitor B | 20–30% |

---

## Supported Networks

| Network | Asset | Usage |
|---------|-------|-------|
| TRON mainnet | TRX | Native payment + resource delegation |
| Base (EVM) | USDC | x402 payment via Coinbase facilitator |

---

## Use Cases

- **Wallet agents** — Automatically rent Energy before sending USDT/TRX, reducing fees by 20–50%
- **Trading bots** — Bulk Energy purchases for high-frequency TRON transactions
- **DApp backends** — Provide free transactions to users by delegating Energy
- **Multi-chain agents** — Pay with USDC on Base, receive Energy on TRON
- **Autonomous sellers** — Register a pool via MCP, vote for SRs, earn staking + selling rewards with zero manual intervention

---

## Discovery & Documentation

| Resource | URL |
|----------|-----|
| Platform | [powersun.vip](https://powersun.vip) |
| Agent Landing Page | [powersun.vip/agents](https://powersun.vip/agents) |
| MCP Endpoint | [powersun.vip/mcp](https://powersun.vip/mcp) |
| OpenAPI Spec | [powersun.vip/openapi.json](https://powersun.vip/openapi.json) |
| LLM Guide (short) | [powersun.vip/llms.txt](https://powersun.vip/llms.txt) |
| LLM Guide (full) | [powersun.vip/llms-full.txt](https://powersun.vip/llms-full.txt) |
| Agent Descriptor | [powersun.vip/.well-known/agents.json](https://powersun.vip/.well-known/agents.json) |
| AI Plugin Manifest | [powersun.vip/ai-plugin.json](https://powersun.vip/ai-plugin.json) |
| Full API Docs | [powersun.vip/api-docs](https://powersun.vip/api-docs) |
| Blog | [powersun.vip/blog](https://powersun.vip/blog) |

---

## Architecture

```
┌─────────────────────────────────────────────┐
│              AI Agent / LLM                  │
│         (Claude, GPT, custom agent)          │
└──────────┬──────────────┬───────────────────┘
           │ MCP          │ REST API
           ▼              ▼
┌──────────────────────────────────────────────┐
│            PowerSun.vip Server                │
│                                              │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐  │
│  │21 MCP   │ │ REST API │ │ HTTP 402     │  │
│  │Tools    │ │ Endpoints│ │ + x402 USDC  │  │
│  └────┬────┘ └────┬─────┘ └──────┬───────┘  │
│       └───────────┴──────────────┘           │
│                    │                          │
│       ┌────────────┴────────────┐            │
│       │    Order Engine +       │            │
│       │    Pool Management +    │            │
│       │    Auto-Actions         │            │
│       └────────────┬────────────┘            │
└────────────────────┼─────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
   TRON Mainnet              Base (EVM)
   (Energy delegation)    (USDC settlement)
```

---

## GitHub Topics

`tron` `tron-energy` `tron-bandwidth` `mcp` `mcp-server` `ai-agent` `blockchain` `trx` `usdt` `energy-rental` `bandwidth` `http-402` `x402` `rest-api` `crypto` `defi` `passive-income` `staking`

---

## Links

- **Platform:** [powersun.vip](https://powersun.vip)
- **Agent API:** [powersun.vip/agents](https://powersun.vip/agents)
- **Blog:** [powersun.vip/blog](https://powersun.vip/blog)
- **API Docs:** [powersun.vip/api-docs](https://powersun.vip/api-docs)

---

## License

This repository contains documentation only. The [PowerSun.vip](https://powersun.vip) platform is a hosted service available at [powersun.vip](https://powersun.vip).
