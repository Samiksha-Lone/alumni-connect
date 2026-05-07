const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const server = require('./src/app');
const connectDB = require('./src/db/db');
const { ensureAdmin } = require('./seed');
const eventModel = require('./src/models/event.model');

const port = process.env.PORT || 3000;

// Function to cleanup past events
async function cleanupPastEvents() {
  try {
    const now = new Date();
    
    // Mark events that ended 2 days ago for deletion
    const deletionThreshold = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    
    const markedCount = await eventModel.updateMany(
      {
        eventDate: { $lt: deletionThreshold },
        markedForDeletion: false
      },
      {
        markedForDeletion: true,
        deletionScheduledAt: now
      }
    );

    // Delete events marked for deletion
    const deletedCount = await eventModel.deleteMany({ markedForDeletion: true });

    if (markedCount.modifiedCount > 0 || deletedCount.deletedCount > 0) {
      console.log(`Event cleanup: marked ${markedCount.modifiedCount}, deleted ${deletedCount.deletedCount}`);
    }
  } catch (error) {
    console.error('Error in event cleanup:', error);
  }
}

// Schedule cleanup to run every 6 hours
function scheduleEventCleanup() {
  const cleanupInterval = 6 * 60 * 60 * 1000; // 6 hours
  setInterval(cleanupPastEvents, cleanupInterval);
  
  // Run cleanup once on server start
  cleanupPastEvents();
}

connectDB()
    .then(() => {
      ensureAdmin();
      scheduleEventCleanup();
    })
    .catch(() => {
        process.exit(1);
    });

server.listen(port, () => {
});