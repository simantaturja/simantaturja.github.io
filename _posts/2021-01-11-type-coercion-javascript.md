---
title: "What is type coercion in Javascript?"
categories:
  - Javascript
tags:
  - javascript
  - coercion
---

JavaScript will quietly convert that value to the type it needs, using a set of rules that often aren’t what you want or expect.
This is called type coercion.

Let's see some console log examples-

1. console.log("7" + 1) → 71
2. console.log("7" - 1) → 6
3. console.log(null \* 7) → 0
4. console.log(7 \* "five") → NaN
5. console.log(false == 0) → true

The null in the first expression becomes 0, and the "5" in the second expression becomes 5 (from string to number). Yet in the third expression, + tries string concatenation before numeric addition, so the 1 is converted to "1" (from number to string). When something that doesn’t map to a number in an obvious way (such as "five" or undefined) is converted to a number, you get the value NaN.

source: Eloquent Javascript
