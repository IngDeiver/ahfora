# Architecture profiles and tradeoffs

These are options, not mandatory scaffolds. Folder names alone do not establish an
architecture; responsibility and dependency rules do.

| Profile | Useful when | Main tradeoff | Boundary to verify |
| --- | --- | --- | --- |
| Simple modular design | Small tools and narrow domains | Low ceremony; boundaries need deliberate care as scope grows | Cohesive modules, explicit I/O, no accidental cycles |
| Layered architecture | Clear presentation/application/data responsibilities | Familiar structure; layers can leak business policy | Allowed dependency directions and business logic ownership |
| Modular monolith | Several capabilities share one deployable application | Strong domain boundaries without distributed operations; needs disciplined module APIs | No direct access to another module's internals/data |
| Clean architecture | Long-lived policies must survive framework/storage changes | More boundaries and mapping code | Policy does not depend on external frameworks/infrastructure |
| Hexagonal architecture | A core needs multiple input/output adapters or isolated testing | Explicit ports/adapters add ceremony | Core speaks ports; infrastructure implements adapters |

Clean and hexagonal ideas overlap; avoid creating duplicate layers just to claim
both. Domain-driven design can clarify complex domains within several profiles;
simple projects do not need aggregates and bounded contexts by default. Distributed
services need evidence of independent scaling/ownership/availability requirements,
not just a desire to appear scalable.

For each candidate, discuss testability, change cost, operational complexity, team
familiarity, migration effort and delivery scope. Prefer a short justified design
over an elaborate structure with no requirement driving it.
