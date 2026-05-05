// Simulated cryptographic utilities for policy verification
export async function generateHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export function generatePolicySignature(policy: any): string {
  const signatureData = `${policy.id}-${policy.version}-${policy.name}-${JSON.stringify(policy.rules)}`;
  return btoa(signatureData);
}

export async function verifyPolicyIntegrity(
  policy: any,
  expectedHash: string
): Promise<boolean> {
  const policyData = JSON.stringify({
    id: policy.id,
    version: policy.version,
    rules: policy.rules,
  });
  const computedHash = await generateHash(policyData);
  return computedHash === expectedHash;
}
