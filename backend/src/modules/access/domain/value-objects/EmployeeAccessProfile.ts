import { ValueObject } from "../../../../shared/domain/value-objects/ValueObject";

interface EmployeeAccessProfileProps {
  department?: string;
  employeeLevel?: string;
  jobFunction?: string;
  office?: string;
  employmentStatus?: string;
}

export class EmployeeAccessProfile extends ValueObject<EmployeeAccessProfileProps> {
  private constructor(props: EmployeeAccessProfileProps) {
    super(props);
  }

  public static create(
    props: EmployeeAccessProfileProps,
  ): EmployeeAccessProfile {
    return new EmployeeAccessProfile({
      department: props.department?.trim(),
      employeeLevel: props.employeeLevel?.trim(),
      jobFunction: props.jobFunction?.trim(),
      office: props.office?.trim(),
      employmentStatus: props.employmentStatus?.trim(),
    });
  }

  public get department(): string | undefined {
    return this.props.department;
  }

  public get employeeLevel(): string | undefined {
    return this.props.employeeLevel;
  }

  public get jobFunction(): string | undefined {
    return this.props.jobFunction;
  }

  public get office(): string | undefined {
    return this.props.office;
  }

  public get employmentStatus(): string | undefined {
    return this.props.employmentStatus;
  }
}