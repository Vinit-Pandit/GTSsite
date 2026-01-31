import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as serviceAccount from "./firebaseAdmin/gtsdatabase-49060-firebase-adminsdk-fbsvc-1af5aea24b.json";

if (!getApps().length) {
  try {
    initializeApp({
      credential: cert(serviceAccount as any),
    });

    console.log("✓ Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
    throw error;
  }
}

export const db = getFirestore();
