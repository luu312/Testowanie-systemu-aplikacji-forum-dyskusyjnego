// import User from "../../models/user.model.js";
// import cron from "node-cron";

// const cleanupUnverifiedUsers = async () => {
//   try {
//     const cutoffDate = new Date(Date.now() - 30 * 60 * 1000); 
//     console.log(`Deleting users created before: ${cutoffDate}`);

//     const result = await User.deleteMany({
//       isVerified: false,
//       createdAt: { $lt: cutoffDate },
//     });

//     console.log(
//       `Cleanup completed: ${result.deletedCount} unverified users deleted`
//     );
//   } catch (error) {
//     console.error("Error in cleanupUnverifiedUsers:", error);
//   }
// };

// cron.schedule("*/10 * * * *", cleanupUnverifiedUsers);