/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { run } from './spawn.mjs';
import { REPO_ROOT } from './paths.mjs';
import path from 'path';

/**
 * Builds a single package using it's npm build script
 * @param {string} packageName
 * @param {{quiet: boolean}} options
 * @returns {Promise<void>}
 */
export async function buildPackage(packageName, { quiet }) {
  await run('yarn', ['build'], {
    cwd: path.resolve(REPO_ROOT, 'packages', packageName),
    pipe: !quiet,
  });
}

/**
 * Runs the build script in watch mode for a single package
 * @param {string} packageName
 * @param {{quiet: boolean}} options
 * @returns {Promise<void>}
 */
export async function watchPackage(packageName, { quiet }) {
  await run('yarn', ['build', '--watch'], {
    cwd: path.resolve(REPO_ROOT, 'packages', packageName),
    pipe: !quiet,
  });
}
