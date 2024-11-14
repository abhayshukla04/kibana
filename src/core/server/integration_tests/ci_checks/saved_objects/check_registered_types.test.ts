/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import type { ISavedObjectTypeRegistry } from '@kbn/core-saved-objects-server';
import { getMigrationHash } from '@kbn/core-test-helpers-so-type-serializer';
import { Root } from '@kbn/core-root-server-internal';
import {
  createTestServers,
  createRootWithCorePlugins,
  type TestElasticsearchUtils,
} from '@kbn/core-test-helpers-kbn-server';

describe('checking migration metadata changes on all registered SO types', () => {
  let esServer: TestElasticsearchUtils;
  let root: Root;
  let typeRegistry: ISavedObjectTypeRegistry;

  beforeAll(async () => {
    const { startES } = createTestServers({
      adjustTimeout: (t: number) => jest.setTimeout(t),
    });

    esServer = await startES();
    root = createRootWithCorePlugins({}, { oss: false });
    await root.preboot();
    await root.setup();
    const coreStart = await root.start();
    typeRegistry = coreStart.savedObjects.getTypeRegistry();
  });

  afterAll(async () => {
    if (root) {
      await root.shutdown();
    }
    if (esServer) {
      await esServer.stop();
    }
  });

  // This test is meant to fail when any change is made in registered types that could potentially impact the SO migration.
  // Just update the snapshot by running this test file via jest_integration with `-u` and push the update.
  // The intent is to trigger a code review from the Core team to review the SO type changes.
  it('detecting migration related changes in registered types', () => {
    const allTypes = typeRegistry.getAllTypes();

    const hashMap = allTypes.reduce((map, type) => {
      map[type.name] = getMigrationHash(type);
      return map;
    }, {} as Record<string, string>);

    expect(hashMap).toMatchInlineSnapshot(`
      Object {
        "action": "0e6fc0b74c7312a8c11ff6b14437b93a997358b8",
        "action_task_params": "b50cb5c8a493881474918e8d4985e61374ca4c30",
        "ad_hoc_run_params": "d4e3c5c794151d0a4f5c71e886b2aa638da73ad2",
        "alert": "556a03378f5ee1c31593c3a37c66b54555ee14ff",
        "api_key_pending_invalidation": "8f5554d1984854011b8392d9a6f7ef985bcac03c",
        "apm-custom-dashboards": "b67128f78160c288bd7efe25b2da6e2afd5e82fc",
        "apm-indices": "8a2d68d415a4b542b26b0d292034a28ffac6fed4",
        "apm-server-schema": "58a8c6468edae3d1dc520f0134f59cf3f4fd7eff",
        "apm-service-group": "66dfc1ddd40bad8f693c873bf6002ca30079a4ae",
        "apm-telemetry": "4df255b8b022f5d160687db736b9abcd6ab173fe",
        "app_search_telemetry": "36234f19573ad397ac30197c45ac219921cc3106",
        "application_usage_daily": "20142d23fe5d05ba22b4bc46614d99883bc488f0",
        "application_usage_totals": "a29ab014edc20382b9ce22ede221b18cee5d93a6",
        "background-task-node": "e61f0ea9923fa05b3af0aae6c6baf2f0283e14b3",
        "canvas-element": "cdedc2123eb8a1506b87a56b0bcce60f4ec08bc8",
        "canvas-workpad": "9d82aafb19586b119e5c9382f938abe28c26ca5c",
        "canvas-workpad-template": "c077b0087346776bb3542b51e1385d172cb24179",
        "cases": "5433a9f1277f8f17bbc4fd20d33b1fc6d997931e",
        "cases-comments": "5cb0a421588831c2a950e50f486048b8aabbae25",
        "cases-configure": "44ed7b8e0f44df39516b8870589b89e32224d2bf",
        "cases-connector-mappings": "f9d1ac57e484e69506c36a8051e4d61f4a8cfd25",
        "cases-rules": "6d1776f5c46a99e1a0f3085c537146c1cdfbc829",
        "cases-telemetry": "f219eb7e26772884342487fc9602cfea07b3cedc",
        "cases-user-actions": "483f10db9b3bd1617948d7032a98b7791bf87414",
        "cloud-security-posture-settings": "e0f61c68bbb5e4cfa46ce8994fa001e417df51ca",
        "config": "179b3e2bc672626aafce3cf92093a113f456af38",
        "config-global": "8e8a134a2952df700d7d4ec51abb794bbd4cf6da",
        "connector_token": "79977ea2cb1530ba7e315b95c1b5a524b622a6b3",
        "core-usage-stats": "b3c04da317c957741ebcdedfea4524049fdc79ff",
        "csp-rule-template": "c151324d5f85178169395eecb12bac6b96064654",
        "dashboard": "211e9ca30f5a95d5f3c27b1bf2b58e6cfa0c9ae9",
        "dynamic-config-overrides": "eb3ec7d96a42991068eda5421eecba9349c82d2b",
        "endpoint:unified-user-artifact-manifest": "71c7fcb52c658b21ea2800a6b6a76972ae1c776e",
        "endpoint:user-artifact-manifest": "1c3533161811a58772e30cdc77bac4631da3ef2b",
        "enterprise_search_telemetry": "9ac912e1417fc8681e0cd383775382117c9e3d3d",
        "entity-definition": "1c6bff35c423d5dc5650bc806cf2899e4706a0bc",
        "entity-discovery-api-key": "c267a65c69171d1804362155c1378365f5acef88",
        "entity-engine-status": "8cb7dcb13f5e2ea8f2e08dd4af72c110e2051120",
        "epm-packages": "8042d4a1522f6c4e6f5486e791b3ffe3a22f88fd",
        "epm-packages-assets": "7a3e58efd9a14191d0d1a00b8aaed30a145fd0b1",
        "event-annotation-group": "715ba867d8c68f3c9438052210ea1c30a9362582",
        "event_loop_delays_daily": "01b967e8e043801357503de09199dfa3853bab88",
        "exception-list": "4aebc4e61fb5d608cae48eaeb0977e8db21c61a4",
        "exception-list-agnostic": "6d3262d58eee28ac381ec9654f93126a58be6f5d",
        "favorites": "a68c7c8ae22eaddcca324d8b3bfc80a94e3eec3a",
        "file": "6b65ae5899b60ebe08656fd163ea532e557d3c98",
        "file-upload-usage-collection-telemetry": "06e0a8c04f991e744e09d03ab2bd7f86b2088200",
        "fileShare": "5be52de1747d249a221b5241af2838264e19aaa1",
        "fleet-agent-policies": "f57d3b70e4175a19a18f18ee72a379ceec82e1fc",
        "fleet-fleet-server-host": "69be15f6b6f2a2875ad3c7050ddea7a87f505417",
        "fleet-message-signing-keys": "93421f43fed2526b59092a4e3c65d64bc2266c0f",
        "fleet-package-policies": "2f4d524adb49a5281d3af0b66bb3003ba0ff2e44",
        "fleet-preconfiguration-deletion-record": "c52ea1e13c919afe8a5e8e3adbb7080980ecc08e",
        "fleet-proxy": "6cb688f0d2dd856400c1dbc998b28704ff70363d",
        "fleet-setup-lock": "0dc784792c79b5af5a6e6b5dcac06b0dbaa90bde",
        "fleet-space-settings": "b278e82a33978900e53a1253884b5bdbd929c9bb",
        "fleet-uninstall-tokens": "371a691206845b364bcf6d3693ca7905ffdb71a4",
        "graph-workspace": "5cc6bb1455b078fd848c37324672163f09b5e376",
        "guided-onboarding-guide-state": "d338972ed887ac480c09a1a7fbf582d6a3827c91",
        "guided-onboarding-plugin-state": "bc109e5ef46ca594fdc179eda15f3095ca0a37a4",
        "index-pattern": "997108a9ea1e8076e22231e1c95517cdb192b9c5",
        "infra-custom-dashboards": "1a5994f2e05bb8a1609825ddbf5012f77c5c67f3",
        "infrastructure-monitoring-log-view": "5f86709d3c27aed7a8379153b08ee5d3d90d77f5",
        "infrastructure-ui-source": "113182d6895764378dfe7fa9fa027244f3a457c4",
        "ingest-agent-policies": "5e95e539826a40ad08fd0c1d161da0a4d86ffc6d",
        "ingest-download-sources": "279a68147e62e4d8858c09ad1cf03bd5551ce58d",
        "ingest-outputs": "55988d5f778bbe0e76caa7e6468707a0a056bdd8",
        "ingest-package-policies": "53a94064674835fdb35e5186233bcd7052eabd22",
        "ingest_manager_settings": "111a616eb72627c002029c19feb9e6c439a10505",
        "inventory-view": "b8683c8e352a286b4aca1ab21003115a4800af83",
        "kql-telemetry": "93c1d16c1a0dfca9c8842062cf5ef8f62ae401ad",
        "legacy-url-alias": "9b8cca3fbb2da46fd12823d3cd38fdf1c9f24bc8",
        "lens": "5cfa2c52b979b4f8df56dd13c477e152183468b9",
        "lens-ui-telemetry": "8c47a9e393861f76e268345ecbadfc8a5fb1e0bd",
        "links": "1dd432cc94619a513b75cec43660a50be7aadc90",
        "maintenance-window": "bf36863f5577c2d22625258bdad906eeb4cccccc",
        "map": "76c71023bd198fb6b1163b31bafd926fe2ceb9da",
        "metrics-data-source": "81b69dc9830699d9ead5ac8dcb9264612e2a3c89",
        "metrics-explorer-view": "98cf395d0e87b89ab63f173eae16735584a8ff42",
        "ml-job": "150e1ab260e87f9963cc99e013304b9c54703dab",
        "ml-module": "94f210e60504fe0cc8241d867af97f8130250359",
        "ml-trained-model": "482195cefd6b04920e539d34d7356d22cb68e4f3",
        "monitoring-telemetry": "5d91bf75787d9d4dd2fae954d0b3f76d33d2e559",
        "observability-onboarding-state": "34eef666124a9e4ad1c607d0097cc25128764681",
        "osquery-manager-usage-metric": "983bcbc3b7dda0aad29b20907db233abba709bcc",
        "osquery-pack": "702e86b1a936153b39f65b0781bdc136e186e123",
        "osquery-pack-asset": "cd140bc2e4b092e93692b587bf6e38051ef94c75",
        "osquery-saved-query": "6095e288750aa3164dfe186c74bc5195c2bf2bd4",
        "policy-settings-protection-updates-note": "33924bb246f9e5bcb876109cc83e3c7a28308352",
        "query": "501bece68f26fe561286a488eabb1a8ab12f1137",
        "risk-engine-configuration": "bab237d09c2e7189dddddcb1b28f19af69755efb",
        "rules-settings": "ba57ef1881b3dcbf48fbfb28902d8f74442190b2",
        "sample-data-telemetry": "37441b12f5b0159c2d6d5138a494c9f440e950b5",
        "search": "0aa6eefb37edd3145be340a8b67779c2ca578b22",
        "search-session": "b2fcd840e12a45039ada50b1355faeafa39876d1",
        "search-telemetry": "b568601618744720b5662946d3103e3fb75fe8ee",
        "security-rule": "07abb4d7e707d91675ec0495c73816394c7b521f",
        "security-solution-signals-migration": "9d99715fe5246f19de2273ba77debd2446c36bb1",
        "siem-detection-engine-rule-actions": "54f08e23887b20da7c805fab7c60bc67c428aff9",
        "siem-ui-timeline": "d3de8ff3617be8f2a799d66b1471b9be6124bf40",
        "siem-ui-timeline-note": "0a32fb776907f596bedca292b8c646496ae9c57b",
        "siem-ui-timeline-pinned-event": "082daa3ce647b33873f6abccf340bdfa32057c8d",
        "slo": "9a9995e4572de1839651c43b5fc4dc8276bb5815",
        "slo-settings": "f6b5ed339470a6a2cda272bde1750adcf504a11b",
        "space": "953a72d8962d829e7ea465849297c5e44d8e9a2d",
        "spaces-usage-stats": "3abca98713c52af8b30300e386c7779b3025a20e",
        "synthetics-dynamic-settings": "4b40a93eb3e222619bf4e7fe34a9b9e7ab91a0a7",
        "synthetics-monitor": "5ceb25b6249bd26902c9b34273c71c3dce06dbea",
        "synthetics-param": "3ebb744e5571de678b1312d5c418c8188002cf5e",
        "synthetics-private-location": "8cecc9e4f39637d2f8244eb7985c0690ceab24be",
        "synthetics-privates-locations": "f53d799d5c9bc8454aaa32c6abc99a899b025d5c",
        "tag": "e2544392fe6563e215bb677abc8b01c2601ef2dc",
        "task": "3c89a7c918d5b896a5f8800f06e9114ad7e7aea3",
        "telemetry": "7b00bcf1c7b4f6db1192bb7405a6a63e78b699fd",
        "threshold-explorer-view": "175306806f9fc8e13fcc1c8953ec4ba89bda1b70",
        "ui-metric": "d227284528fd19904e9d972aea0a13716fc5fe24",
        "upgrade-assistant-ml-upgrade-operation": "421f52731cb24e242d70672ba4725e169277efb3",
        "upgrade-assistant-reindex-operation": "01f3c3e051659ace56492a73928987e717537a93",
        "uptime-dynamic-settings": "b6756ff71d6b5258971b1c8fd433d167affbde52",
        "uptime-synthetics-api-key": "7ae976a461248f9dbd8442af14a179bdbc229eca",
        "url": "c923a4a5002a09c0080c9095e958f07d518e6704",
        "usage-counter": "1690e9b642393c467e560fd14dd317dea24a14ee",
        "usage-counters": "48782b3bcb6b5a23ba6f2bfe3a380d835e68890a",
        "visualization": "93a3e73994ad836fe2b1dccbe208238f41f63da0",
        "workplace_search_telemetry": "52b32b47ee576f554ac77cb1d5896dfbcfe9a1fb",
      }
    `);
  });
});
