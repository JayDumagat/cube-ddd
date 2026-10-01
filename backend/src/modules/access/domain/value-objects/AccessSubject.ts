import { ValueObject } from "../../../../shared/domain/value-objects/ValueObject";

interface AccessSubjectProps {
  tenantId: string;
  objectId: string;
}

export class AccessSubject extends ValueObject<AccessSubjectProps> {
  private constructor(props: AccessSubjectProps) {
    super(props);
  }

  public static create(
    tenantId: string,
    objectId: string,
  ): AccessSubject {
    const normalizedTenantId = tenantId.trim();
    const normalizedObjectId = objectId.trim();

    if (!normalizedTenantId) {
      throw new Error("Tenant ID cannot be empty.");
    }

    if (!normalizedObjectId) {
      throw new Error("Object ID cannot be empty.");
    }

    return new AccessSubject({
      tenantId: normalizedTenantId,
      objectId: normalizedObjectId,
    });
  }

  public get tenantId(): string {
    return this.props.tenantId;
  }

  public get objectId(): string {
    return this.props.objectId;
  }

  public toString(): string {
    return `${this.props.tenantId}:${this.props.objectId}`;
  }
}