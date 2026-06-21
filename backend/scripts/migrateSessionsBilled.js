/**
 * One-time migration: backfill `sessionsBilled` on existing bills.
 *
 * Existing bills predate the `sessionsBilled` field, so they read as 0 and a
 * patient who already paid would show all their present days as "remaining".
 * This sets each patient bill's sessionsBilled to the qty of its first item
 * row (which is the session/days row created by CreateBill).
 *
 * Safe to re-run: it skips bills that already have a non-zero sessionsBilled.
 *
 * Run from the backend folder:
 *   node scripts/migrateSessionsBilled.js          (apply)
 *   node scripts/migrateSessionsBilled.js --dry     (preview, no writes)
 */
import "dotenv/config";
import mongoose from "mongoose";
import connectDb from "../config/mongodb.js";
import Bill from "../models/billReportModels.js";

const DRY_RUN = process.argv.includes("--dry");

const run = async () => {
  await connectDb();

  // Only bills tied to a patient participate in the present-day counting.
  const bills = await Bill.find({ patientId: { $exists: true, $ne: null } });
  console.log(`Found ${bills.length} patient bill(s).`);

  let updated = 0;
  let skipped = 0;

  for (const bill of bills) {
    if (bill.sessionsBilled && bill.sessionsBilled > 0) {
      skipped++;
      continue;
    }

    const sessions = Number(bill.items?.[0]?.qty) || 0;
    console.log(
      `${DRY_RUN ? "[dry] " : ""}${bill.billNumber} (${bill.customer}) -> sessionsBilled = ${sessions}`,
    );

    if (!DRY_RUN) {
      bill.sessionsBilled = sessions;
      await bill.save();
    }
    updated++;
  }

  console.log(
    `\nDone. ${updated} bill(s) ${DRY_RUN ? "would be" : "were"} updated, ${skipped} skipped (already set).`,
  );

  await mongoose.connection.close();
  process.exit(0);
};

run().catch(async (err) => {
  console.error("Migration failed:", err);
  await mongoose.connection.close();
  process.exit(1);
});
