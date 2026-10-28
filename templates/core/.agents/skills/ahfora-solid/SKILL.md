---
name: ahfora-solid
description: "Applies SOLID and practical dependency design without speculative abstraction. Use while planning responsibilities, implementing modules, or reviewing coupling and maintainability."
license: MIT
metadata:
  author: Deiver
  version: "1.0.0"
---

# Proportionate SOLID design

## Critical patterns

SOLID is guidance about responsibilities, extension and contracts, not a requirement
to write classes or create an interface for every function. Adapt to the project's
paradigm and approved architecture. Favor evidence over pattern counts.

| Principle | Practical question | Avoid |
| --- | --- | --- |
| Single responsibility | Does this unit serve one cohesive policy/actor and reason to change? | Splitting every line into a new abstraction |
| Open/closed | Can an actual expected variation be added behind a stable boundary? | Building a plugin platform for hypothetical variations |
| Liskov substitution | Does each implementation preserve the promised inputs, outputs, errors and invariants? | Subtypes/adapters with surprise preconditions or side effects |
| Interface segregation | Does a consumer depend only on the capabilities it needs? | Huge contracts or a maze of one-method interfaces without value |
| Dependency inversion | Does policy depend on a stable capability rather than a volatile implementation detail? | Service locators, global hidden dependencies and unnecessary DI containers |

## Example

Instead of embedding database/network calls inside a pricing policy, pass the needed
capability at a boundary:

```text
quote(order, priceLookup):
    prices = priceLookup(order.itemIds)
    return applyPricingRules(order, prices)
```

This can be a function parameter, module interface or port. The useful property is
an explicit dependency and testable behavior, not the number of classes. Preserve
the price lookup's documented errors and semantics in every implementation.

## Review procedure

1. Identify responsibilities and real change pressures.
2. Trace dependency direction and hidden I/O/state.
3. Check contracts, invariants and substitution behavior.
4. Propose the smallest refactor that serves the approved task.
5. Test behavior at boundaries; do not test private implementation structure merely
   to preserve a pattern. Escalate architecture/scope changes for approval.

## Commands

Use the project's approved static analysis and tests when relevant. Do not invent
universal commands or install a framework to enforce this guidance.

## Resources

- [Architecture profiles](../ahfora-architecture/references/profiles.md)
- [Project constitution](../../../docs/constitution.md)
