import { createFileRoute } from '@tanstack/react-router';
import { PLATFORM_CORE_CONTRACT, validateConsumerManifest } from '@/shared/platform-core';
import upstream from '@/shared/platform-core/upstream.json';
import consumer from '@/shared/platform-core/consumer.json';

export const Route = createFileRoute('/api/platform-core-status')({
  server: {
    handlers: {
      GET: async () => {
        const validation = validateConsumerManifest(consumer as never);
        const synchronized =
          consumer.coreCommit === upstream.commit &&
          consumer.packageVersion === upstream.version &&
          consumer.apiVersion === upstream.apiVersion &&
          upstream.version === PLATFORM_CORE_CONTRACT.packageVersion &&
          upstream.apiVersion === PLATFORM_CORE_CONTRACT.apiVersion;
        const healthy = validation.valid && synchronized;
        return Response.json({
          healthy,
          consumer: consumer.consumer,
          repository: consumer.repository,
          core: {
            repository: upstream.repository,
            commit: upstream.commit,
            packageVersion: upstream.version,
            apiVersion: upstream.apiVersion,
          },
          capabilities: consumer.capabilities,
          localExtensions: consumer.localExtensions,
          excludedDomains: consumer.excludedDomains,
          reviewedAt: consumer.reviewedAt,
          errors: validation.errors,
        }, {
          status: healthy ? 200 : 503,
          headers: {
            'cache-control': 'no-store',
            'x-robots-tag': 'noindex, nofollow',
          },
        });
      },
    },
  },
});
