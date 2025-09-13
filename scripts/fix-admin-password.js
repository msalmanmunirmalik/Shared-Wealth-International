import bcrypt from 'bcryptjs';

async function fixAdminPassword() {
  try {
    // Generate a proper password hash
    const password = 'admin123'; // Simple password for testing
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    console.log('Generated password hash:', passwordHash);
    console.log('Password:', password);
    console.log('');
    console.log('Now run this SQL command in your database:');
    console.log('');
    console.log(`UPDATE users SET password_hash = '${passwordHash}' WHERE email = 'r';`);
    console.log('');
    console.log('Then you can sign in with:');
    console.log('Email: admin@sharedwealth.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error generating password hash:', error);
  }
}

fixAdminPassword();
