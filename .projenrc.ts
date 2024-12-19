import { AwsCdkConstructLibrary } from "@pepperize/projen-awscdk-construct";
import { javascript } from "projen";
const project = new AwsCdkConstructLibrary({
  author: "Patrick Florek",
  authorAddress: "patrick.florek@gmail.com",
  cdkVersion: "2.1.0",
  name: "@pepperize/cdk-vpc",
  description: "Utility constructs for tagging subnets or creating a cheaper vpc.",
  keywords: ["AWS", "CDK", "EC2", "VPC", "NatGateway", "NatInstance", "Tag", "Subnet", "Utilities"],
  repositoryUrl: "https://github.com/pepperize/cdk-vpc.git",

  projenrcTs: true,

  devDeps: [
    "@pepperize/projen-awscdk-construct@~0.0.730",
    "@types/aws-lambda",
    "@types/jest",
    "@types/sinon",
    "aws-lambda",
    "aws-sdk",
    "aws-sdk-mock",
    "sinon",
  ],

  defaultReleaseBranch: "main",
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
  publishToMaven: {
    mavenEndpoint: "https://s01.oss.sonatype.org",
    mavenGroupId: "com.pepperize",
    mavenArtifactId: "cdk-vpc",
    javaPackage: "com.pepperize.cdk.vpc",
  },

  gitpod: true,
});

project.tasks.tryFind("package:python")?.prependExec("pip3 install packaging");

project.gitpod?.addCustomTask({
  name: "setup",
  init: "yarn install && npx projen build",
  command: "npx projen watch",
});

project.gitpod?.addVscodeExtensions("dbaeumer.vscode-eslint");

project.synth();
