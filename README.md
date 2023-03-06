[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com)
[![GitHub](https://img.shields.io/github/license/pepperize/cdk-vpc?style=flat-square)](https://github.com/pepperize/cdk-vpc/blob/main/LICENSE)
[![npm (scoped)](https://img.shields.io/npm/v/@pepperize/cdk-vpc?style=flat-square)](https://www.npmjs.com/package/@pepperize/cdk-vpc)
[![PyPI](https://img.shields.io/pypi/v/pepperize.cdk-vpc?style=flat-square)](https://pypi.org/project/pepperize.cdk-vpc/)
[![Nuget](https://img.shields.io/nuget/v/Pepperize.CDK.Vpc?style=flat-square)](https://www.nuget.org/packages/Pepperize.CDK.Vpc/)
[![Sonatype Nexus (Releases)](https://img.shields.io/nexus/r/com.pepperize/cdk-vpc?server=https%3A%2F%2Fs01.oss.sonatype.org%2F&style=flat-square)](https://s01.oss.sonatype.org/content/repositories/releases/com/pepperize/cdk-vpc/)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/pepperize/cdk-vpc/release.yml?branch=main&label=release&style=flat-square)](https://github.com/pepperize/cdk-vpc/actions/workflows/release.yml)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/pepperize/cdk-vpc?sort=semver&style=flat-square)](https://github.com/pepperize/cdk-vpc/releases)
[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod&style=flat-square)](https://gitpod.io/#https://github.com/pepperize/cdk-vpc)

# CDK Vpc

Utility constructs for tagging subnets or creating a cheaper vpc.

- [Cheaper Vpc](#create-a-cheaper-vpc)
- [Tagging subnets](#tag-your-imported-subnets)

## Install

### TypeScript

```shell
npm install @pepperize/cdk-vpc
```

or

```shell
yarn add @pepperize/cdk-vpc
```

### Python

```shell
pip install pepperize.cdk-vpc
```

### C\# / .Net

```shell
dotnet add package Pepperize.CDK.Vpc
```

### Java

```xml
<dependency>
  <groupId>com.pepperize</groupId>
  <artifactId>cdk-vpc</artifactId>
  <version>${cdkVpc.version}</version>
</dependency>
```

## Getting Started

1. Create a new CDK TypeScript App project with [projen](https://github.com/projen/projen)

   ```shell
   mkdir my-project
   cd my-project
   git init -b main
   npx projen new awscdk-app-ts
   ```

2. Add `@pepperize/cdk-vpc` to your dependencies in `.projenrc.js`

   ```typescript
   const project = new awscdk.AwsCdkTypeScriptApp({
     //...
     deps: ["@pepperize/cdk-vpc"],
   });
   ```

3. Install the dependency

   ```shell
   npx projen
   ```

# Usage

## Create a cheaper Vpc

Use this as a cheaper drop-in replacement to create a vpc with 2 AvailabilityZones and a `t3.nano` NatInstance.

```typescript
import { App, Stack } from "aws-cdk-lib";
import { CheapVpc } from "@pepperize/cdk-vpc";

const app = new App();
const stack = new Stack(app, "MyCheapVpcStack");

new CheapVpc(stack, "MyCheapVpc");
```

## Tag your imported subnets

Subnets imported by `Vpc.fromLookup` wouldn't be tagged by `Tags.of` automatically. To tag them (or any other imported vpc resource) use:

```typescript
import { CheapVpc } from "@pepperize/cdk-vpc";
import * as ec2 from "aws-cdk-lib/aws-ec2";

const app = new App();
const stack = new Stack(app, "VpcStack");
const vpc = ec2.Vpc.fromLookup(stack, "VpcLookup", {
  vpcId: "vpc-1234567890",
  region: env.region,
});

new CreateTags(vpcStack, "TagPrivateSubnets", {
  resourceIds: vpc.privateSubnets.map((subnet) => {
    return subnet.subnetId;
  }),
  tags: [
    {
      key: "kubernetes.io/role/internal-elb",
      value: "1",
    },
  ],
});
```

# Contributing

Contributions of all kinds are welcome :rocket: Check out our [contributor's guide](https://github.com/pepperize/cdk-vpc/blob/main/CONTRIBUTING.md).

For a quick start, check out a development environment:

```shell
git clone git@github.com:pepperize/cdk-vpc
cd cdk-vpc
 # install dependencies
yarn
# build with projen
yarn build
```
