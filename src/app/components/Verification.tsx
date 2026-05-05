import { useState } from "react";
import { useSecurity } from "../context/SecurityContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Shield,
  Hash,
  FileCheck,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

export function Verification() {
  const { policies, verifyPolicy } = useSecurity();
  const [verifying, setVerifying] = useState<string | null>(null);
  const [verificationResults, setVerificationResults] = useState<
    Record<string, { verified: boolean; timestamp: Date }>
  >({});

  const handleVerifyPolicy = async (policyId: string) => {
    setVerifying(policyId);
    try {
      const verified = await verifyPolicy(policyId);
      setVerificationResults((prev) => ({
        ...prev,
        [policyId]: { verified, timestamp: new Date() },
      }));

      if (verified) {
        toast.success("Policy integrity verified successfully");
      } else {
        toast.error("Policy integrity verification failed");
      }
    } catch (error) {
      toast.error("Error during verification");
    } finally {
      setVerifying(null);
    }
  };

  const handleVerifyAll = async () => {
    setVerifying("all");
    const results: Record<string, { verified: boolean; timestamp: Date }> = {};
    
    for (const policy of policies) {
      const verified = await verifyPolicy(policy.id);
      results[policy.id] = { verified, timestamp: new Date() };
    }
    
    setVerificationResults(results);
    setVerifying(null);
    
    const allVerified = Object.values(results).every((r) => r.verified);
    if (allVerified) {
      toast.success(`All ${policies.length} policies verified successfully`);
    } else {
      const failedCount = Object.values(results).filter((r) => !r.verified).length;
      toast.error(`${failedCount} policy verification(s) failed`);
    }
  };

  const verifiedCount = Object.values(verificationResults).filter((r) => r.verified).length;
  const totalCount = Object.keys(verificationResults).length;
  const verificationRate = totalCount > 0 ? (verifiedCount / totalCount) * 100 : 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Policy Verification
        </h1>
        <p className="text-gray-600">
          Verify the cryptographic integrity of security policies
        </p>
      </div>

      {/* Verification Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Policies
            </CardTitle>
            <Shield className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{policies.length}</div>
            <p className="text-xs text-gray-500 mt-2">Available for verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Verified Policies
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {verifiedCount}/{totalCount || policies.length}
            </div>
            <p className="text-xs text-gray-500 mt-2">Integrity confirmed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Verification Rate
            </CardTitle>
            <FileCheck className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {Math.round(verificationRate)}%
            </div>
            <Progress value={verificationRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Batch Verification */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Batch Verification</CardTitle>
          <CardDescription>
            Verify all policies at once for comprehensive integrity check
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleVerifyAll}
            disabled={verifying !== null}
            className="gap-2"
          >
            {verifying === "all" ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Verify All Policies
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Policy Verification List */}
      <Card>
        <CardHeader>
          <CardTitle>Policy Integrity Checks</CardTitle>
          <CardDescription>
            Individual policy verification with cryptographic hash validation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {policies.map((policy) => {
              const result = verificationResults[policy.id];
              const isVerifying = verifying === policy.id || verifying === "all";

              return (
                <div
                  key={policy.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{policy.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          v{policy.version}
                        </Badge>
                        {result && (
                          <Badge
                            variant="outline"
                            className={
                              result.verified
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }
                          >
                            {result.verified ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Verified
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 mr-1" />
                                Failed
                              </>
                            )}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{policy.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Hash className="w-3 h-3" />
                        <code className="bg-gray-100 px-2 py-0.5 rounded font-mono">
                          {policy.hash.substring(0, 32)}...
                        </code>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerifyPolicy(policy.id)}
                      disabled={isVerifying}
                      className="ml-4"
                    >
                      {isVerifying ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Verifying
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Verify
                        </>
                      )}
                    </Button>
                  </div>

                  {result && (
                    <div
                      className={`mt-3 p-3 rounded-lg border ${
                        result.verified
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {result.verified ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${
                              result.verified ? "text-green-900" : "text-red-900"
                            }`}
                          >
                            {result.verified
                              ? "Policy integrity verified successfully"
                              : "Policy integrity verification failed"}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              result.verified ? "text-green-700" : "text-red-700"
                            }`}
                          >
                            {result.verified
                              ? "Cryptographic hash matches expected value. Policy has not been tampered with."
                              : "Hash mismatch detected. Policy may have been modified or corrupted."}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Verified at: {result.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <span className="ml-2 text-gray-900">
                        {policy.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Updated:</span>
                      <span className="ml-2 text-gray-900">
                        {policy.updatedAt.toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="ml-2 capitalize text-gray-900">{policy.status}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Rules:</span>
                      <span className="ml-2 text-gray-900">{policy.rules.length}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {policies.length === 0 && (
            <div className="py-12 text-center">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No policies available for verification</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verification Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How Policy Verification Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-700">1</span>
              </div>
              <p>
                Each policy is assigned a unique cryptographic hash (SHA-256) when created
                or updated.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-700">2</span>
              </div>
              <p>
                The hash is computed from the policy's critical data including version and
                rules.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-700">3</span>
              </div>
              <p>
                During verification, we recompute the hash and compare it to the stored
                value.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-700">4</span>
              </div>
              <p>
                If hashes match, the policy is verified as unchanged. Any mismatch indicates
                tampering.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
