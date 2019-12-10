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

# Answers

<a name="1"></a>

#### > Do all applications have to be deployed together?

<br>

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

---

<a name="2"></a>

#### > Can I build and test only 1 application?

<br>

Yes. Each application has specific build and testing tools + scripts. Each mono-repository has a target name associated with each application: see the `projects` listing in the `workspace.json`.

> For example, this repository has applications `accounts` and `prospects`.

Use the Nx commands to build, serve, and test the `accounts` application:

```console
nx build accounts;
nx test accounts;
nx serve accounts;
```

<br>

---

<a name="3"></a>

#### > How do I run only tests have for my my library or application?

<br>

Using the `nx test --help` command, developers can easily see all the options available to run tests on applications or libraries:

```console
nx run accounts:test      # run all tests associated with 'accounts` app and its libraries
nx run accounts-ui:test   # run all tests on the 'accounts-ui' library
```

> Note: `account` and `accounts-ui` are projects defined in [`workspace.json`](../workspace.json): each project configures builders, testers, and linters for that specific React library or application.

<br>

---

<a name="4"></a>

#### > How can I restrict usage of my library?

<br>

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

---

<a name="5"></a>

#### > How can I restrict changes to my library?

<br>

'Pull-Requests + CodeOwners' are the only way to prevent **changes** to library code.

![image](https://user-images.githubusercontent.com/210413/70566524-d9e62780-1b59-11ea-8b48-147dbbc8d1df.png)

> @see [Code Owners for Bitbucket Server](https://marketplace.atlassian.com/apps/1218598/code-owners-for-bitbucket-server?hosting=server&tab=overview)

CodeOwners can be assigned responsibility for sections of the repository. Any PR change [with changes to a part of the repo associated with that CodeOwner] will require the CodeOwner to review and signoff before the PR can be merged. Codeowner groups and coverage are defined in [CODEOWNERS](../.github/CODEOWNERS) using notations like:

```text
 # ==========================================
 # Associated with: <team name>
 # ==========================================
 <repo path>    <organization>/<team> <organization>/<team>
```

- Multiple code owners can be assigned to a single code path (space delimited): `<team name>` |`<user name>` | `<email>`.
- When a file matches multiple entries in the CODEOWNERS file, the last entry takes precedence.

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

<br>

---

<a name="6"></a>

#### > How should I organize my application libraries?

<br>

Applications and libraries are two fundamental building blocks in a monorepo.

An application:

- can be built into (a) a deployable artifact, or (b) an e2e testing artifact
- contains configurations for its build process, running its tests and lint checks
- can consume code from libraries

A library:

- contains code that can be consumed by applications or other libraries
- contains a configuration for runnings its tests
- can consume code from other libraries

A monorepo can contain multiple applications and multiple libraries. Developers are encouraged to read the following resources for more details:

- [Organizing Code in Nx monorepo for immediate team-wide benefits](https://medium.com/showpad-engineering/how-to-organize-and-name-applications-and-libraries-in-an-nx-monorepo-for-immediate-team-wide-9876510dbe28)
- [Opinionated Guidelines for Large Nx Projects](https://blog.strongbrew.io/opinionated-guidelines-for-large-nx-angular-projects/)
- [Advanced Nx Workspaces](https://nxplaybook.com/p/advanced-nx-workspaces)

<br>

---

Traditionally code is organized in folders (aka packages) contained in the sub directories within the application directory; eg `/apps/accounts/src/app/banking`. To encourage code sharing, code reuse, and to **optimize build and test speeds**, code be organized in _libraries_ inside the `/libs` directory.

For small to medium sized monorepos, it makes sense to **group libraries** in a folder for the application that they belong to. In the Accounts application, we have a folder for the accounts UI in `libs/acounts/ui`. It's also useful to have a shared directory for libraries that can be used in more than one application.

If the Accounts application were to grow larger and larger, it might make sense to add a folder for each subsection of the application. For instance, a folder for searching for accounts, one for cancellations, and one for browsing transactions.

The existing libraries would need to be moved into the appropriate area and you would also need to make a shared folder inside of your application-specific folder for libraries like the ui-formatters library that could be used across sub-sections of that application: `/libs/accounts/shared/<lib-XYZ>`.

When you move a library, remember to update references to it in your codebase, and in your **`nx.json`** and **`workspace.json`** files.

Developers should read the following posts for more details:

- https://blog.strongbrew.io/opinionated-guidelines-for-large-nx-angular-projects/

<br>

<a name="7"></a>

#### > How do I restrict library code usage to public API(s) only?

<br>

A **barrel** file is used to define the public API for a package or library. A barrel file is an **_index.ts_** file that lives in the src directory of every Nx lib and is meant to expose logic to the rest of the workspace.

Only the APIs exported from the _index.ts_ are availble - only symbols which are explicitly exported from this file should be eligible for consumption in other parts of the workspace. This allows developers to hide/protect the private implementation details for a library or package.

- Deep imports into a library are prohibited.
- Don't ever import a library from a relative path.

Nx uses TypeScript path mappings (@see [tsconfig.json](./tsconfig.json)) to map the module names to the correct barrel files:

```json
"paths": {
  "@poc/accounts/ui": ["libs/accounts/ui/src/index.ts"],
  "@poc/prospects/ui": ["libs/prospects/ui/src/index.ts"],
  "@poc/shared/utils": ["libs/shared/utils/src/index.ts"],
  "@poc/shared/auth": ["libs/shared/auth/src/index.ts"]
}
```

Consider the following examples:

- `@poc/shared/utils/lib/shared-auth` is **not allowed** since this skips the barrel file and attempts to load a _deep_ module.
- `import { AuthSession } from '../../../../../shared/auth/src'` is **not allowed**.`
- `import { AuthSession } from '@poc/shared/auth'` is **allowed** from other libraries or applications.
- `import { AuthSession } from '@poc/shared/auth'` is **not allowed** inside the same library. Instead use relative paths.
  > Never let a lib import from its own Barrel file

When we want to import `AuthSession` inside another lib or app, we want to import it from `@poc/shared/auth`. This is way cleaner then importing it from a relative path like `../../../libs/shared/auth/src/index.ts` and helps protect us from the overexposure problem described above.

<br>

---

<a name="8"></a>

#### > How do I structure seperate Continuous Integration (CI) for each application?

<br>

Continous integration (CI) requires tasks for lint, builds, and tests to be automatically run for each PR and each commits to `develop`. The specific CI tasks that will be run are configured in a [`nodejs.yml`](../.github/workflows/nodejs.yml) script file; which can configure lint, build, and test tasks for:

- the default application,
- all applications,
- only the libs/applications **affected by** the changes... [recommended]

```yml
run: |
  npm ci
  npm run affected:lint
  npm run affected:build --if-present
  npm run affected:test
```

<br>

---

<a name="9"></a>

#### > How do I publish a stand-alone library for external use?

<br>

---

<a name="10"></a>

#### > How do I prepare containerized builds?

<br>

---

<a name="11"></a>

<br>

#### > What is the difference between code promotions and code pulls?
