import type { UseCase } from "../../../../../shared/application/use-cases/UseCase";
import type { Clock } from "../../../../../shared/application/time/Clock";

import type { ApplicationRepository } from "../../../domain/repositories/ApplicationRepository";
import type { ApplicationEntitlementRepository } from "../../../domain/repositories/ApplicationEntitlementRepository";
import { AccessSubject } from "../../../domain/value-objects/AccessSubject";

interface ListAccessibleApplicationsInput {
  tenantId: string;
  objectId: string;
}

interface AccessibleApplication {
  id: string;
  code: string;
  name: string;
  description?: string;
}

type ListAccessibleApplicationsOutput =
  AccessibleApplication[];

export class ListAccessibleApplications
  implements
    UseCase<
      ListAccessibleApplicationsInput,
      ListAccessibleApplicationsOutput
    >
{
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly entitlementRepository: ApplicationEntitlementRepository,
    private readonly clock: Clock,
  ) {}

  public async execute(
    input: ListAccessibleApplicationsInput,
  ): Promise<ListAccessibleApplicationsOutput> {
    const subject = AccessSubject.create(
      input.tenantId,
      input.objectId,
    );

    const entitlements =
      await this.entitlementRepository.findActiveBySubject(
        subject,
      );

    const now = this.clock.now();

    const applicationIds = [
      ...new Map(
        entitlements
          .filter((entitlement) =>
            entitlement.isActive(now),
          )
          .map((entitlement) => [
            entitlement.applicationId.value,
            entitlement.applicationId,
          ]),
      ).values(),
    ];

    if (applicationIds.length === 0) {
      return [];
    }

    const applications =
      await this.applicationRepository.findByIds(
        applicationIds,
      );

    return applications
      .filter(
        (application) =>
          application.status === "active",
      )
      .map((application) => ({
        id: application.id.value,
        code: application.code.value,
        name: application.name,
        description: application.description,
      }));
  }
}