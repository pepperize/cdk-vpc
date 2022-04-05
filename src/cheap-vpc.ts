import { aws_ec2 } from "aws-cdk-lib";
import { VpcProps } from "aws-cdk-lib/aws-ec2/lib/vpc";
import { Construct } from "constructs";

export class CheapVpc extends aws_ec2.Vpc {
  public constructor(scope: Construct, id: string, props?: VpcProps) {
    const natInstanceProvider = aws_ec2.NatProvider.instance({
      instanceType: aws_ec2.InstanceType.of(aws_ec2.InstanceClass.T3, aws_ec2.InstanceSize.NANO),
    });

    super(scope, id, {
      natGatewayProvider: natInstanceProvider,
      natGateways: 1,
      maxAzs: 2,
      ...props,
    });
  }
}
