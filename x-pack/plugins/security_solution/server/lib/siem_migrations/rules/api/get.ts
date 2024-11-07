/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { IKibanaResponse, Logger } from '@kbn/core/server';
import { buildRouteValidationWithZod } from '@kbn/zod-helpers';
import type { GetRuleMigrationResponse } from '../../../../../common/siem_migrations/model/api/rules/rules_migration.gen';
import { GetRuleMigrationRequestParams } from '../../../../../common/siem_migrations/model/api/rules/rules_migration.gen';
import { SIEM_RULE_MIGRATIONS_GET_PATH } from '../../../../../common/siem_migrations/constants';
import type { SecuritySolutionPluginRouter } from '../../../../types';

export const registerSiemRuleMigrationsGetRoute = (
  router: SecuritySolutionPluginRouter,
  logger: Logger
) => {
  router.versioned
    .get({
      path: SIEM_RULE_MIGRATIONS_GET_PATH,
      access: 'internal',
      security: { authz: { requiredPrivileges: ['securitySolution'] } },
    })
    .addVersion(
      {
        version: '1',
        validate: {
          request: { params: buildRouteValidationWithZod(GetRuleMigrationRequestParams) },
        },
      },
      async (context, req, res): Promise<IKibanaResponse<GetRuleMigrationResponse>> => {
        const migrationId = req.params.migration_id;
        try {
          const ctx = await context.resolve(['securitySolution']);
          const ruleMigrationsClient = ctx.securitySolution.getSiemRuleMigrationsClient();

          const migrationRules = await ruleMigrationsClient.data.getRules(migrationId);

          return res.ok({ body: migrationRules });
        } catch (err) {
          logger.error(err);
          return res.badRequest({ body: err.message });
        }
      }
    );
};
