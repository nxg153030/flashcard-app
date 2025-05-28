---
title: JavaScript Concepts
---

What is closure in JavaScript?

???

A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned. It helps in data privacy and maintaining state.

---

What is the difference between let, const, and var?

???

var is function-scoped and can be redeclared, let is block-scoped and can be reassigned but not redeclared, const is block-scoped and cannot be reassigned or redeclared.

---

What is the event loop in JavaScript?

???

The event loop is a mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded. It handles the execution of multiple chunks of code by maintaining a queue and executing them sequentially.

---

What is Promise in JavaScript?

???

A Promise is an object representing the eventual completion (or failure) of an asynchronous operation. It can be in one of three states: pending, fulfilled, or rejected.

---

What is the difference between == and === in JavaScript?

???

== performs type coercion before comparison (loose equality), while === checks both value and type without coercion (strict equality). Example: 5 == '5' is true, but 5 === '5' is false.

---

What is destructuring in JavaScript?

???

Destructuring is a way to extract values from objects or arrays into distinct variables. Example: const { name, age } = person or const [first, second] = array.

---

What are arrow functions?

???

Arrow functions are a concise way to write function expressions. They have a lexical this binding and cannot be used as constructors. Example: const add = (a, b) => a + b

---

What is the spread operator?

???

The spread operator (...) allows an array or object to be expanded into individual elements. It's useful for array/object copying, concatenation, and passing multiple arguments to functions. 