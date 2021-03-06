import * as crypto from "crypto";
import { RemovalPolicy, Stack } from "aws-cdk-lib";
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";

export interface Tag {
  /**
   * The key of the tag.
   *
   * Constraints: Tag keys are case-sensitive and accept a maximum of 127 Unicode characters. May not begin with aws:.
   */
  readonly key: string;
  /**
   * The value of the tag.
   *
   * Constraints: Tag values are case-sensitive and accept a maximum of 256 Unicode characters.
   */
  readonly value: string;
}

/**
 * Adds or overwrites only the specified tags for the specified Amazon EC2 resource or resources. When you specify an existing tag key, the value is overwritten with the new value. Each resource can have a maximum of 50 tags. Each tag consists of a key and optional value. Tag keys must be unique per resource.
 *
 * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html
 * @see https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateTags.html
 *
 * @experimental
 */
export interface CreateTagsProps {
  /**
   * The IDs of the ec2 resources, separated by spaces. Constraints: Up to 1000 resource IDs. We recommend breaking up this request into smaller batches.
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html#tag-resources
   */
  readonly resourceIds: string[];

  /**
   * The tags. The value parameter is required, but if you don't want the tag to have a value, specify the parameter with no value, and we set the value to an empty string.
   */
  readonly tags: Tag[];

  readonly removalPolicy?: RemovalPolicy;
}

export class CreateTags extends Construct {
  public constructor(scope: Construct, id: string, props: CreateTagsProps) {
    super(scope, id);

    const { resourceIds, tags } = props;
    const removalPolicy = props.removalPolicy ?? RemovalPolicy.RETAIN;

    new AwsCustomResource(this, "CreateTags", {
      onCreate: {
        service: "EC2",
        action: "createTags", // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createTags-property
        region: Stack.of(this).region,
        parameters: {
          Resources: resourceIds,
          Tags: tags.map((tag) => {
            return { Key: tag.key, Value: tag.value };
          }),
        },
        physicalResourceId: PhysicalResourceId.of(this.makeUniqueId(resourceIds)),
      },
      onDelete:
        removalPolicy != RemovalPolicy.DESTROY
          ? undefined
          : {
              service: "EC2",
              action: "createTags", // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteTags-property
              region: Stack.of(this).region,
              parameters: {
                Resources: resourceIds,
                Tags: tags.map((tag) => {
                  return { Key: tag.key, Value: tag.value };
                }),
              },
              physicalResourceId: PhysicalResourceId.of(this.makeUniqueId(resourceIds)),
            },
      installLatestAwsSdk: false,
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });
  }

  private makeUniqueId(resourceIds: string[]) {
    const human = resourceIds
      .map((s) => {
        return s.replace(/[^A-Za-z0-9]/g, "");
      })
      .join("")
      .slice(0, 240);

    const md5 = crypto.createHash("md5").update(resourceIds.join("")).digest("hex");
    const hash = md5.slice(0, 8).toUpperCase();

    return human + hash;
  }
}
