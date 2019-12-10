# Common Questions

Here are common questions and concerns regarding the use of a mono-repo:

1. [Do all applications have to be deployed together?](#1)
1. [Can I build and deploy only 1 application?](#2)
1. [Do my tests have to scan all tests or only those for my library/app?](#3)
1. [How can I restrict usage of my library?](#4)
1. [How can I restrict changes to my library?](#5)
1. [How should I organize my application libraries?](#6)
1. [How do I restrict library code usage to public API(s) only?](#7)
1. [How do I structure seperate CI/CD for each application?](#8)
1. [How do I publish a stand-alone library for external use?](#9)
1. [How do I prepare containerized builds?](#10)
1. [What is the difference between code promotions and code pulls?](#11)

<br>

---

<br>

## Answers

<a name="1"></a>

#### 1) Do all applications have to be deployed together?

Applications can be deployed independent of each other.

A FE mono-repository may contain 1..n web applications, 1..n node servers, and 1..n libraries. In aggregate, this collection is considered the repository 'code'.

[![](https://i.imgur.com/DRLY3WB.png)](https://i.imgur.com/DRLY3WB.png)

All code within the mono-repository shares the same (a) repository packages/versions and (b) branch commit history. Each application can be deployed based on specific Git tag/version.

> The deployed app version however represents the code for all applications and libraries (at that SHA time)

- Each application is associated with distinct, separate build and test scripts.
- Nx tooling enables developers to build and test each application independent of the other applications.

Continuous integration tests will be automatically performed for (a) each Pull Request and (b) each commit to the `develop` branch. But delivery or deployment [for QA testing or for production release] will not be an automatically-triggered process.

- CI Pipeline: Unit tests and e2e tests will be automatically performed... for the apps and libraries affected by the code changes.
- CD pipeline: Deployment scripts must be manually triggered... each configured on Jenkins to build an application-specific container upon demand.

<br>

<a name="2"></a>

#### 2) Can I build and test only 1 application?

Yes. Each application has specific build and testing tools + scripts. Each mono-repository has a target name associated with each application: see the `projects` listing in the `workspace.json`.

> For example, this repository has applications `accounts` and `prospects`.

Use the Nx commands to build, serve, and test the `accounts` application:

```console
nx build accounts;
nx test accounts;
nx serve accounts;
```

<br>

<a name="3"></a>

#### 3) How do I run only tests have for my my library or application?

Using the `nx test --help` command, developers can easily see all the options available to run tests on applications or libraries:

```console
nx run accounts:test      # run all tests associated with 'accounts` app and its libraries
nx run accounts-ui:test   # run all tests on the 'accounts-ui' library
```

<br>

<a name="4"></a>

#### 4) How can I restrict usage of my library?

Four (4) rules are mandated to constrain and restrict library usage:

1. Applications can only import and use libraries
2. Libraries can only import and use libraries
3. **Imports can be authorized** based on library or application tags
4. Only library public API(s) can be imported; deep imports bypassing the public `index.ts` is not allowed.

##### Constrain Library Dependencies

Nx defines a standard for organizing code within a mono-repo: [Code Organization & Naming Conventions](https://nx.dev/web/guides/monorepo-nx-enterprise#code-organization-amp-naming-conventions)

Library tags are defined in `nx.json` and `.eslintrc` should specify `@nrwl/nx/enforce-module-boundaries` rules. With the _json_ below we configure lint errors to enforce:

- Shared libraries can only import from shared libraries
- Accounts can only import from account, shared, or auth libraries

```json
"rules": {
    "@nrwl/nx/enforce-module-boundaries": [
      "error",
      {
        "allow": [],
        "depConstraints": [
          { "sourceTag": "scope:shared", "onlyDependOnLibsWithTags": ["scope:shared"] },
          {
            "sourceTag": "scope:accounts",
            "onlyDependOnLibsWithTags": ["scope:accounts", "scope:shared", "scope:auth"]
          }
        ]
      }
    ]
  },
```

> @see [`.eslintrc`](./.eslintrc)

<br>

<a name="5"></a>

### How can I restrict changes to my library?

The Pull-Request process is the only way to prevent **changes** to library code.

CodeOwners can be assigned to librarie. Any PR change that has changes to a library associated with that CodeOwner will require CodeOwner review and signoff before the PR can be merged. Codeowner groups and coverage are defined in [CODEOWNERS](./CODEOWNERS).

Here is a partial snippet:

```console

# ================================================
#  @nextgen/accounts
# ================================================

/apps/accounts/**                                              @nextgen/global-approvers @nextgen/accounts
/libs/accounts/**                                              @nextgen/global-approvers @nextgen/accounts

# ================================================
#  @nextgen/shared
# ================================================

/libs/shared/**                                                @nextgen/global-approvers @nextgen/sel @nextgen/shared
```

<a name="6"></a>

### How should I organize my application libraries?

<a name="7"></a>

### How do I restrict library code usage to public API(s) only?

A **barrel** file is used to define the public API for a package or library. A barrel file is a _index.ts_ file that lives in the src directory of every Nx lib and is meant to expose logic to the rest of the workspace.

Only the APIs exported from the _index.ts_ are availble - only symbols which are explicitly exported from this file should be eligible for consumption in other parts of the workspace. This allows developers to hide/protect the private implementation details for a library or package.

- Deep imports into a library are prohibited.
- Don't ever import a library from a relative path

Nx uses TypeScript path mappings (@see [tsconfig.json](./tsconfig.json)) to map the module names to the correct barrel files:

```json
"paths": {
  "@poc/accounts/ui": ["libs/accounts/ui/src/index.ts"],
  "@poc/prospects/ui": ["libs/prospects/ui/src/index.ts"],
  "@poc/shared/utils": ["libs/shared/utils/src/index.ts"],
  "@poc/shared/auth": ["libs/shared/auth/src/index.ts"]
}
```

When we want to import `AuthSession` inside another lib or app, we want to import it from `@poc/shared/auth`. This is way cleaner then importing it from a relative path like `../../../libs/shared/auth/src/index.ts` and helps protect us from the overexposure problem described above.

> Never let a lib import from its own Barrel file

<a name="8"></a>

### How do I structure seperate CI/CD for each application?

<a name="9"></a>

### How do I publish a stand-alone library for external use?

<a name="10"></a>

### How do I prepare containerized builds?

<a name="11"></a>

### What is the difference between code promotions and code pulls?
