// scripts/seedDatabase.js
const fs = require('fs');
const path = require('path');
const supabase = require('../backend/config/db');

async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    // Read dummy data files
    const usersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../assets/data/users.json'), 'utf8')
    );
    
    const casesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../assets/data/cases.json'), 'utf8')
    );
    
    const documentsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../assets/data/documents.json'), 'utf8')
    );
    
    const paymentsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../assets/data/payments.json'), 'utf8')
    );
    
    const aiInteractionsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../assets/data/ai_interactions.json'), 'utf8')
    );
    
    const educationModulesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../assets/data/education_modules.json'), 'utf8')
    );

    // Insert users
    console.log('Inserting users...');
    for (const user of usersData) {
      const { error } = await supabase
        .from('users')
        .insert([user]);
        
      if (error) {
        console.error('Error inserting user:', error);
      }
    }

    // Insert cases
    console.log('Inserting cases...');
    for (const caseItem of casesData) {
      const { error } = await supabase
        .from('cases')
        .insert([caseItem]);
        
      if (error) {
        console.error('Error inserting case:', error);
      }
    }

    // Insert documents
    console.log('Inserting documents...');
    for (const doc of documentsData) {
      const { error } = await supabase
        .from('documents')
        .insert([doc]);
        
      if (error) {
        console.error('Error inserting document:', error);
      }
    }

    // Insert payments
    console.log('Inserting payments...');
    for (const payment of paymentsData) {
      const { error } = await supabase
        .from('payments')
        .insert([payment]);
        
      if (error) {
        console.error('Error inserting payment:', error);
      }
    }

    // Insert AI interactions
    console.log('Inserting AI interactions...');
    for (const aiInteraction of aiInteractionsData) {
      const { error } = await supabase
        .from('ai_interactions')
        .insert([aiInteraction]);
        
      if (error) {
        console.error('Error inserting AI interaction:', error);
      }
    }

    // Insert education modules
    console.log('Inserting education modules...');
    for (const eduModule of educationModulesData) {
      const { error } = await supabase
        .from('education_modules')
        .insert([eduModule]);
        
      if (error) {
        console.error('Error inserting education module:', error);
      }
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
}

// Run the seeding function if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;