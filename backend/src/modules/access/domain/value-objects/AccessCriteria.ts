import { ValueObject } from "../../../../shared/domain/value-objects/ValueObject";

interface AccessCriteriaProps {
  departments?: string[];
  employeeLevels?: string[];
  jobFunctions?: string[];
  offices?: string[];
  employmentStatuses?: string[];
}

export class AccessCriteria extends ValueObject<AccessCriteriaProps> {
  private constructor(props: AccessCriteriaProps) {
    super(props);
  }

  public static create(
    props: AccessCriteriaProps,
  ): AccessCriteria {
    return new AccessCriteria({
      departments: props.departments?.map((value) =>
        value.trim(),
      ),
      employeeLevels: props.employeeLevels?.map((value) =>
        value.trim(),
      ),
      jobFunctions: props.jobFunctions?.map((value) =>
        value.trim(),
      ),
      offices: props.offices?.map((value) =>
        value.trim(),
      ),
      employmentStatuses:
        props.employmentStatuses?.map((value) =>
          value.trim(),
        ),
    });
  }

  public get departments(): readonly string[] {
    return this.props.departments ?? [];
  }

  public get employeeLevels(): readonly string[] {
    return this.props.employeeLevels ?? [];
  }

  public get jobFunctions(): readonly string[] {
    return this.props.jobFunctions ?? [];
  }

  public get offices(): readonly string[] {
    return this.props.offices ?? [];
  }

  public get employmentStatuses(): readonly string[] {
    return this.props.employmentStatuses ?? [];
  }
}