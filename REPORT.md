# Exploratory Test Report — Swag Labs (saucedemo.com)

**Tester:** Bolin Yu · **Date:** 2026-11-01 · **Build:** public demo at https://www.saucedemo.com · **Browser:** Chromium 1.64 (Playwright), Linux, 1280×800

> Swag Labs is a public demo store built for test practice. Several of its test accounts ship with deliberate defects. Every finding below was reproduced during this session (screenshots are in `evidence/`).

## 1. Summary
| Metric | Value |
|---|---|
| Test cases executed | 21 |
| Passed | 12 |
| Failed (defects) | 7 |
| Observations / not measured | 2 |
| Automated checks | 13 Playwright tests, all green |

The core purchase flow for `standard_user` works. The defects are concentrated in the `problem_user`, `error_user` and `visual_user` accounts, plus one logic gap for every user: an order can be completed with an empty cart.

## 2. Test plan
- **Scope:** login, session protection, inventory, sorting, cart, the 3-step checkout, and the visual consistency of prices.
- **Out of scope:** payment processing (mocked by the site), API and load testing, accessibility audit.
- **Approach:** session-based exploratory testing (about 60 minutes) driven by charters, plus scripted regression checks with Playwright.
- **Test data:** the site's published accounts (`standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user`, `error_user`, `visual_user`; password `secret_sauce`). Customer data: Ann / Lee / 100085.
- **Entry and exit criteria:** the site is reachable; every charter has been executed and every defect reproduced at least twice.

## 3. Defects
| ID | Severity | Account | Summary | Steps to reproduce | Expected | Actual |
|---|---|---|---|---|---|---|
| BUG-01 | Major | problem_user | Every product shows the same broken image | Log in and view the inventory | Each product has its own image | All 6 images use `/assets/sl-404-*.jpg` (a dog placeholder). See `evidence/problem_user_images.png` |
| BUG-02 | Major | problem_user | Sorting has no effect | Sort by Price (low to high) | Prices ascending | Order unchanged ($29.99, $9.99, $15.99, …) |
| BUG-03 | Critical | problem_user | Typing in Last Name overwrites First Name, so checkout cannot be completed | Checkout, type "Ann" in First and "Lee" in Last, then Continue | Both fields keep their values | First = "Lee", Last = "" → "Error: Last Name is required". See `evidence/problem_user_checkout.png` |
| BUG-04 | Major | error_user | Sorting throws an alert | Sort by Name (Z to A) | List reorders | Alert "Sorting is broken! This error has been reported to Backtrace."; list unchanged |
| BUG-05 | Major | problem_user, error_user | Only some items can be added to the cart | Click every "Add to cart" | Badge shows 6 | Badge shows 3; the other buttons do nothing |
| BUG-06 | Major | all (verified with standard_user) | An order can be placed with an empty cart | Open an empty cart → Checkout → fill the form → Continue → Finish | Checkout disabled or a warning | Reaches checkout-complete ("Thank you for your order!"). See `evidence/standard_empty_cart_checkout.png` |
| BUG-07 | Major | visual_user | Inventory prices differ from the real prices | Log in and compare with standard_user | $29.99, $9.99, … | Random values, e.g. $2.73, $90.98, $83.74. See `evidence/visual_user.png` |

## 4. Observations (not confirmed as defects)
- **OBS-01:** the checkout form accepts whitespace-only names and a non-numeric postal code ("abc"), then proceeds to step 2. This may be intended for a demo, but in production it would be a validation gap.
- **OBS-02:** `performance_glitch_user` is documented as slow to log in. My quick timing measurement was not precise enough to confirm a difference, so this is left unverified.

## 5. Automation
`tests/` contains 13 Playwright tests: auth (4), shop and checkout (6), and known defects (3). The known-defect tests use `test.fail()`, so they pass while the bug is present and alert when it gets fixed. Run with `npm install && npx playwright install chromium && npm test`.

## 6. Recommendations
1. Fix BUG-03 and BUG-06 first, because they block or corrupt orders.
2. Add a server-side cart-not-empty guard and form validation rules (trim names, check the postal code format).
3. Add visual regression snapshots to catch issues like BUG-01 and BUG-07.

Full test case list: `test-cases.csv` (21 cases).

## License
MIT © 2026 Bolin Yu
