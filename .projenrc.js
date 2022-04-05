const { AwsCdkConstructLibrary } = require("@pepperize/projen-awscdk-construct");
const { awscdk, javascript } = require("projen");
const project = new AwsCdkConstructLibrary({
  author: "Patrick Florek",
  authorAddress: "patrick.florek@gmail.com",
  cdkVersion: "2.1.0",
  defaultReleaseBranch: "main",
  name: "@pepperize/cdk-vpc",
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  repositoryUrl: "https://github.com/pepperize/cdk-vpc.git",

  keywords: ["AWS", "CDK", "EC2", "VPC", "NatGateway", "NatInstance", "Utilities"],

  devDeps: [
    "@pepperize/projen-awscdk-construct@latest",
    "@types/aws-lambda",
    "@types/jest",
    "@types/sinon",
    "aws-lambda",
    "aws-sdk",
    "aws-sdk-mock",
    "cdk-nag@^2.0.0",
    "sinon",
  ],

  lambdaOptions: {
    runtime: awscdk.LambdaRuntime.NODEJS_14_X,
    bundlingOptions: {
      sourcemap: true,
    },
  },

  autoApproveUpgrades: true,
  autoApproveOptions: { allowedUsernames: ["pflorek", "dependabot[bot]"], secret: "GITHUB_TOKEN" },
  depsUpgradeOptions: {
    workflowOptions: {
      secret: "PROJEN_GITHUB_TOKEN",
    },
  },

  releaseToNpm: true,
  npmAccess: javascript.NpmAccess.PUBLIC,
  publishToNuget: {
    dotNetNamespace: "Pepperize.CDK",
    packageId: "Pepperize.CDK.Vpc",
  },
  publishToPypi: {
    distName: "pepperize.cdk-vpc",
    module: "pepperize_cdk_vpc",
  },

  gitpod: true,
});

project.gitpod.addCustomTask({
  name: "setup",
  init: "yarn install && npx projen build",
  command: "npx projen watch",
});

project.gitpod.addVscodeExtensions("dbaeumer.vscode-eslint");

project.synth();
