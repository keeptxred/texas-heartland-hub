# Calculator browser and accessibility QA

Run this checklist against the deployment preview before PR #12 is marked ready.

## Every public route

- Direct navigation and browser refresh return the calculator, not a 404.
- Page title, H1, description, last-reviewed date, assumptions, methodology, model version, and disclaimer are visible.
- Keyboard focus is visible and follows visual order.
- Every input has an associated label, unit, help text where needed, and an announced error.
- Results update without exposing `NaN`, `Infinity`, negative impossible values, or raw JavaScript errors.
- Results are announced through the live region without moving keyboard focus.
- Minimum, maximum, zero, blank, decimal, and out-of-range values behave predictably.
- Reset, clear, example, save, load, copy, and print controls work.
- Saved scenarios remain local to the browser and survive a refresh.
- Copied summaries contain results but omit private input values.
- Print view hides interactive controls and remains readable.
- Mobile widths of 320, 375, 390, and 768 pixels have no horizontal scrolling.
- Number inputs open an appropriate mobile keyboard and retain readable units.

## Journey hub

- Each goal button reaches the intended starting calculator.
- All 19 calculators appear exactly once in the four journey groups.
- Buying, owning, moving/comparing, and household-finance headings are keyboard and screen-reader navigable.

## Cross-tool handoffs

- Insurance and utilities link to Homeownership Cost.
- Moving Cost links to Cost of Living.
- Property Tax Increase links to Budget Planner.
- Down Payment Assistance links to Down Payment.
- Salary Comparison links to Home Affordability.
- Handoffs never place salary, debt, savings, or other private values in the public URL.

## Calculator-specific boundary cases

- Mortgage: 0% interest, 0% down, 100% down, down payment over price, identical comparison rate, and extra payment.
- Property tax: no exemption, homestead cap on/off, declining value, lower tax rate, and zero taxable value.
- Utilities: zero occupants is rejected; pool/EV additions and seasonal outputs remain finite.
- Moving: optional storage and vehicle shipping at zero; low estimate never exceeds expected; expected never exceeds high.
- Assistance: assistance exceeding cash required never produces a negative remaining need and never claims eligibility.
- Salary: each filing status and pay frequency; retirement and deductions cannot exceed plausible limits.

## Privacy and analytics

- Inspect network requests while changing inputs.
- Confirm user-entered calculator values are not sent to analytics, logs, query strings, or third-party services.
- Confirm only non-sensitive events such as calculator opened, reset clicked, or result section viewed are eligible for analytics.
