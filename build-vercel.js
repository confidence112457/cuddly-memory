#!/usr/bin/env node

// Build script for Vercel deployment
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building for Vercel deployment...');

try {
  // Build the frontend
  console.log('📦 Building frontend...');
  execSync('npm run build', { stdio: 'inherit' });

  // Copy essential files to the root for Vercel
  console.log('📋 Copying configuration files...');
  
  // Ensure the dist directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }

  console.log('✅ Build completed successfully!');
  console.log('🎯 Ready for Vercel deployment');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}