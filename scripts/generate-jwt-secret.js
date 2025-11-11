#!/usr/bin/env node

/**
 * Generate a secure JWT secret for production use
 * Usage: node scripts/generate-jwt-secret.js
 */

const crypto = require('crypto');

const secret = crypto.randomBytes(32).toString('hex');

console.log('\n🔐 Generated JWT Secret:');
console.log('='.repeat(50));
console.log(secret);
console.log('='.repeat(50));
console.log('\n📋 Copy this value and set it as JWT_SECRET in your Render environment variables.\n');

