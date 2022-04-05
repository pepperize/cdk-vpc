import { App, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { CheapVpc } from "../src";

describe("CheapVpc", () => {
  it("Should match snapshot", () => {
    // Given
    const app = new App();
    const stack = new Stack(app, "Network", { env: { region: "us-east-1", account: "123456789012" } });
    new CheapVpc(stack, "CheapVpc");

    // When
    const template = Template.fromStack(stack);

    // Then
    expect(template).toMatchSnapshot();
  });

  it("Should have NatInstance", () => {
    // Given
    const app = new App();
    const stack = new Stack(app, "Network", { env: { region: "us-east-1", account: "123456789012" } });
    new CheapVpc(stack, "CheapVpc");

    // When
    const template = Template.fromStack(stack);

    // Then
    template.hasResourceProperties("AWS::EC2::Instance", {
      ImageId: "ami-1234",
      InstanceType: "t3.nano",
    });
  });
});
