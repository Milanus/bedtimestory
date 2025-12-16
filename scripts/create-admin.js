#!/usr/bin/env node

/**
 * Script to create the first admin user
 * 
 * Usage:
 * node scripts/create-admin.js <email> <password> <displayName>
 * 
 * Example:
 * node scripts/create-admin.js admin@example.com password123 "Admin User"
 */

const admin = require('firebase-admin');
const { readFileSync } = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Initialize Firebase Admin SDK
function initializeAdmin() {
  // Check if admin is already initialized
  if (admin.apps.length > 0) {
    return;
  }

  // For development, you can use application default credentials
  // In production, use a service account key file
  try {
    // Try to use service account if available
    const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('✅ Initialized with service account key');
  } catch (error) {
    // Fall back to application default credentials
    admin.initializeApp();
    console.log('✅ Initialized with application default credentials');
  }
}

async function createAdminUser(email, password, displayName) {
  try {
    console.log('🔐 Creating admin user...');
    
    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
      emailVerified: true,
    });

    console.log('✅ User created in Firebase Auth');
    console.log('   UID:', userRecord.uid);
    console.log('   Email:', userRecord.email);

    // Set admin status in Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: displayName,
      isAdmin: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('✅ Admin status set in Firestore');
    console.log('\n🎉 Admin user created successfully!');
    console.log('\nLogin with:');
    console.log('   Email:', email);
    console.log('   Password: [hidden]');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    if (error.code) {
      console.error('   Error code:', error.code);
    }
    process.exit(1);
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.log('Usage: node scripts/create-admin.js <email> <password> <displayName>');
    console.log('\nExample:');
    console.log('  node scripts/create-admin.js admin@example.com password123 "Admin User"');
    process.exit(1);
  }

  const [email, password, displayName] = args;
  
  // Validate inputs
  if (!email || !password || !displayName) {
    console.error('❌ Error: All parameters are required');
    process.exit(1);
  }

  if (password.length < 6) {
    console.error('❌ Error: Password must be at least 6 characters');
    process.exit(1);
  }

  initializeAdmin();
  createAdminUser(email, password, displayName);
}

// Run the script
main();
