import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  try {
    let credential;

    // Check if we're on Vercel (production)
    const isProduction = process.env.VERCEL === "1";

    if (isProduction) {
      // On Vercel: MUST use environment variables
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;

      if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
          "Missing Firebase environment variables on Vercel. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
        );
      }

      // Handle different private key formats
      if (privateKey.includes("\\n")) {
        // If it has escaped newlines, convert them
        privateKey = privateKey.replace(/\\n/g, "\n");
      }

      credential = cert({
        projectId,
        clientEmail,
        privateKey,
      });
      console.log("✓ Firebase Admin SDK using environment variables (Vercel)");
    } else {
      // Local development: use JSON file (most reliable)
      const serviceAccount = require("./firebaseAdmin/gtsdatabase-49060-firebase-adminsdk-fbsvc-1af5aea24b.json");
      credential = cert(serviceAccount);
      console.log("✓ Firebase Admin SDK using local JSON file");
    }

    initializeApp({
      credential,
    });

    console.log("✓ Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
    throw error;
  }
}

export const db = getFirestore();
