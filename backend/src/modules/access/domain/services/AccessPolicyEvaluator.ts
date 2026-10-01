import type { AccessPolicy } from "../entities/AccessPolicy";
import type { EmployeeAccessProfile } from "../value-objects/EmployeeAccessProfile";

export class AccessPolicyEvaluator {
  public matches(
    policy: AccessPolicy,
    profile: EmployeeAccessProfile,
  ): boolean {
    if (policy.status !== "active") {
      return false;
    }

    const criteria = policy.criteria;

    return (
      this.matchesCriterion(
        criteria.departments,
        profile.department,
      ) &&
      this.matchesCriterion(
        criteria.employeeLevels,
        profile.employeeLevel,
      ) &&
      this.matchesCriterion(
        criteria.jobFunctions,
        profile.jobFunction,
      ) &&
      this.matchesCriterion(
        criteria.offices,
        profile.office,
      ) &&
      this.matchesCriterion(
        criteria.employmentStatuses,
        profile.employmentStatus,
      )
    );
  }

  private matchesCriterion(
    allowedValues: readonly string[],
    actualValue?: string,
  ): boolean {
    if (allowedValues.length === 0) {
      return true;
    }

    if (!actualValue) {
      return false;
    }

    const normalizedActual = actualValue
      .trim()
      .toLowerCase();

    return allowedValues.some(
      (value) =>
        value.trim().toLowerCase() === normalizedActual,
    );
  }
}