import { App, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { CreateTags } from "../src";

describe("PolicyAttachment", () => {
  it("Should match snapshot", () => {
    // Given
    const app = new App();
    const stack = new Stack(app, "Stack");
    new CreateTags(stack, "CreateTags", {
      resourceIds: ["subnet-0a4b64097b272baeD"],
      tags: [
        {
          key: "kubernetes.io/role/internal-elb",
          value: "1",
        },
      ],
    });

    // When
    const template = Template.fromStack(stack);

    // Then
    expect(template).toMatchSnapshot();
  });
});
