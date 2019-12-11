# Nx MonoRepo Poc

This project provides a Proof-of-Concept (PoC) playground used to explore the requirements for an Nx, front-end mono-repository; a repository that contains multiple applications and libraries using Angular, React, NestJS, GraphQL technologies.

[![](https://i.imgur.com/DRLY3WB.png)](https://i.imgur.com/DRLY3WB.png)

## Standards

This repository uses:

- TypeScript + ESLint to build FE web applications and libraries.
- [Jest](https://jestjs.io/en/) is used for Unit + Integration Testing: `nx test accounts`
- [Cypress](https://www.cypress.io/) is used for e2e Testing: `nx e2e acounts-e2e`
- [GitFlow and Best Practices](https://hackmd.io/mqAqzpKyTqmQuofFZkkHxQ)
- [Nx tooling](https://github.com/nrwl/nx) is used for building, testing, and mono-repo structures.
- `@nrwl:<xxxx>` tools are used to generate libs, apps, components, and more.
  - `@nrwl/react:lib g ui --directory=shared`

<br>

---

### Common Questions

Here are common questions and concerns regarding the use of a mono-repo:

1. Do all applications have to be deployed together?
1. Can I build and deploy only 1 application?
1. Do my tests have to scan all tests or only those for my library/app?
1. How can I restrict usage of my library?
1. How can I restrict changes to my library?
1. How should I organize my application libraries?
1. How do I restrict library code usage to public API(s) only?
1. How do I structure seperate CI/CD for each application?
1. How do I publish a stand-alone library for external use?
1. How do I prepare containerized builds?
1. What is the difference between code promotions and code pulls?

See the Answers here: [Questions & Answers](./docs/QUESTIONS.md)

---

### Tooling

Use `nx` tools to quick build, test, lint, etc... or to generate packages/files/components.

Use the command `nx help` to see all the options:

![](https://i.imgur.com/whTyyVW.png)

<br>

For the following schematics (code generators):

- `@nrwl/react`
- `@nrwl/jest`
- `@nrwl/cypress`
- `@nrwl/linter`
- `@nrwl/workspace`
- `@nrwl/storybook`

Use commands like `nx g @nrwl/react:lib --help` to see:

![](https://i.imgur.com/FIqB8Ka.png)

### Storybook

Now Storybook support can be added to UI libraries:

```console
nx g @nrwl/react:component --project=accounts-ui --directory=dashboard --name=dashboard
```

and then once the stories have been created, developers use

```
nx run accounts-ui:storybook
```

to see the storybook run locally. Finally a e2e-storybook `accounts-ui-e2e` has been created to allow UI library storybooks to be programmatically tested for workflows and snapshot regressions.
