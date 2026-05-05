export interface Policy {
  id: string;
  name: string;
  description: string;
  version: string;
  status: "active" | "inactive" | "pending";
  classification: "confidential" | "internal" | "public" | "restricted";
  createdAt: Date;
  updatedAt: Date;
  hash: string;
  rules: PolicyRule[];
  approvedBy?: string;
}

export interface PolicyRule {
  id: string;
  type: "access" | "encryption" | "retention" | "compliance";
  condition: string;
  action: string;
  priority: number;
}

export interface AuditEntry {
  id: string;
  timestamp: Date;
  action: "create" | "update" | "delete" | "verify";
  entityType: "policy" | "data_source" | "user";
  entityId: string;
  entityName: string;
  user: string;
  details: string;
  oldHash?: string;
  newHash?: string;
  verified: boolean;
}

export interface DataSource {
  id: string;
  name: string;
  type: "database" | "file_system" | "api" | "stream";
  size: string;
  records: number;
  classification: "confidential" | "internal" | "public" | "restricted";
  status: "secure" | "at_risk" | "compromised";
  lastScan: Date;
  appliedPolicies: string[];
  encryption: boolean;
}

export interface SecurityMetrics {
  totalPolicies: number;
  activePolicies: number;
  totalDataSources: number;
  secureDataSources: number;
  complianceScore: number;
  verificationRate: number;
  recentViolations: number;
}
