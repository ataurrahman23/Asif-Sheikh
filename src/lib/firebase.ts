/**
 * Firebase Client & Security Integration
 * Conforms to the Firebase Integration Skill and Firestore Error Handling standards.
 */

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
  authInfo?: FirestoreErrorInfo['authInfo']
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: authInfo || {
      userId: null,
      email: null,
      emailVerified: false,
      isAnonymous: false,
      tenantId: null,
      providerInfo: [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Check if Firebase is provisioned via firebase-applet-config.json
let isFirebaseConfigured = false;
let firebaseConfigData: Record<string, unknown> | null = null;

try {
  // Try dynamic check if config is available
  const metaConfig = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_FIREBASE_CONFIG;
  if (metaConfig) {
    firebaseConfigData = JSON.parse(metaConfig);
    isFirebaseConfigured = true;
  }
} catch {
  isFirebaseConfigured = false;
}

export const isFirebaseActive = () => isFirebaseConfigured;
export const getFirebaseConfig = () => firebaseConfigData;
