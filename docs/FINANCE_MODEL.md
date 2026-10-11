# Finance model

Everything on screen is derived from the raw state by `computeMetrics()` in `src/lib/finance.js`. The constants live in `src/data/constants.js`.

| Constant               | Value   | Meaning                                                     |
| ---------------------- | ------- | ----------------------------------------------------------- |
| `STARTING_BUDGET`      | ₹10,000 | Opening balance                                             |
| `TOTAL_DAYS`           | 30      | Length of the month                                         |
| `BASELINE_DAILY_SPEND` | ₹180    | Assumed spend per day, used to smooth early-month forecasts |
| `SMOOTHING_DAYS`       | 2       | Weight of that assumption (as if 2 days had already passed) |

## Formulas

```
daysLeft       = 30 − day + 1
upcomingBills  = Σ amount of commitments + active subscriptions whose due day > today
freeCash       = balance − upcomingBills
dailyAllowance = max(0, freeCash) ÷ daysLeft

avgDaily       = (Σ everyday spend + 180 × 2) ÷ (day + 2) + habitPerDay
forecast       = freeCash − avgDaily × daysLeft
cover          = freeCash ÷ max(1, avgDaily × daysLeft)

risk   = round(clamp(100 × (1.5 − cover) ÷ 1.1, 0, 100))
```

`habitPerDay` is the sum of simulated weekly habits divided by 7.

### Health score (0–100)

| Part              | Max | Points                                                                  |
| ----------------- | --: | ----------------------------------------------------------------------- |
| Cash runway       |  40 | `40 × min(cover, 1.5) ÷ 1.5`                                            |
| Savings progress  |  25 | `25 × min(totalSaved ÷ 2000, 1)`                                        |
| Subscription load |  15 | `15 × (1 − clamp(subscriptionLoad ÷ 1500, 0, 1))`                       |
| Month-end outlook |  20 | `20` if forecast ≥ 0, otherwise `20 × clamp(1 + forecast ÷ 2000, 0, 1)` |

### Levels

| Score            | Risk label | Health label |
| ---------------- | ---------- | ------------ |
| risk < 30        | Low        |              |
| 30 ≤ risk < 60   | Medium     |              |
| risk ≥ 60        | High       |              |
| health ≥ 70      |            | Thriving     |
| 45 ≤ health < 70 |            | Okay         |
| health < 45      |            | Fragile      |

### Simulator verdict

`Not now` if risk ≥ 60 or the forecast is negative; `Tight` if risk ≥ 30; otherwise `Safe`.

## Worked example: day 1, nothing spent

- Commitments: rent 3,000 + recharge 299 + study 500 = 3,799. Subscriptions: 119 + 199 + 129 + 75 = 522. `upcomingBills` = **4,321**.
- `freeCash` = 10,000 − 4,321 = **5,679**; `dailyAllowance` = 5,679 ÷ 30 ≈ **₹189**.
- `avgDaily` = (0 + 360) ÷ 3 = **120**; `forecast` = 5,679 − 120 × 30 = **₹2,079**.
- `cover` = 5,679 ÷ 3,600 ≈ 1.58, so `risk` = **0** (Low).
- Health: runway 40 + savings 0 + subscriptions 15 × (1 − 522/1500) ≈ 9.8 + outlook 20 ≈ **70** (Thriving).

These numbers match the first screen you see in the app.

## Time and bills

`ADVANCE_DAYS` moves one day at a time. When a new day starts, every bill due that day is charged (a `bill` transaction) and the day's closing balance is stored in `history` (used by the forecast chart).

## Decisions

| Type           | Effect                                                                |
| -------------- | --------------------------------------------------------------------- |
| `once`         | Subtracts the amount from the balance                                 |
| `subscription` | Adds an active subscription due tomorrow (counts as an upcoming bill) |
| `habit`        | Adds `amount ÷ 7` to `habitPerDay` (lowers the forecast every day)    |
| `goal`         | Moves money from the balance into a goal                              |

## Limitations

This is a teaching model: no interest, tax or inflation, and spending is assumed to be steady. It is not financial advice.
