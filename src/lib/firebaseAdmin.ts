import { initializeApp, cert, getApps, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./firebaseAdmin/gtsdatabase-49060-firebase-adminsdk-fbsvc-d07b322550.json";

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  });
}

export const db = getFirestore();
