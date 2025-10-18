#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getGitCommitSha() {
  try {
    if (process.env.VERCEL_GIT_COMMIT_SHA) {
      return process.env.VERCEL_GIT_COMMIT_SHA;
    }
    return execSync('git rev-parse HEAD').toString().trim();
  } catch (error) {
    console.warn('Could not get git commit SHA:', error.message);
    return 'unknown';
  }
}

function getGitBranch() {
  try {
    if (process.env.VERCEL_GIT_COMMIT_REF) {
      return process.env.VERCEL_GIT_COMMIT_REF;
    }
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  } catch (error) {
    console.warn('Could not get git branch:', error.message);
    return 'unknown';
  }
}

function getEnvironment() {
  return process.env.VERCEL_ENV || process.env.NODE_ENV || 'development';
}

const packageJson = require('../package.json');

const meta = {
  buildTime: new Date().toISOString(),
  gitCommitSha: getGitCommitSha(),
  gitBranch: getGitBranch(),
  environment: getEnvironment(),
  version: packageJson.version,
};

const outputPath = path.join(__dirname, '../public/meta.json');
fs.writeFileSync(outputPath, JSON.stringify(meta, null, 2));

console.log('✅ Generated meta.json:', meta);
