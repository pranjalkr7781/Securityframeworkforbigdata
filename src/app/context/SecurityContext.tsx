import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Policy, AuditEntry, DataSource, SecurityMetrics } from "../types";
import { generateHash } from "../utils/crypto";

interface SecurityContextType {
  policies: Policy[];
  auditLog: AuditEntry[];
  dataSources: DataSource[];
  metrics: SecurityMetrics;
  addPolicy: (policy: Omit<Policy, "id" | "createdAt" | "updatedAt" | "hash">) => Promise<void>;
  updatePolicy: (id: string, updates: Partial<Policy>) => Promise<void>;
  deletePolicy: (id: string) => void;
  verifyPolicy: (id: string) => Promise<boolean>;
  addDataSource: (dataSource: Omit<DataSource, "id">) => void;
  updateDataSource: (id: string, updates: Partial<DataSource>) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

const initialPolicies: Policy[] = [
  {
    id: "pol-001",
    name: "Data Encryption Standard",
    description: "Enforce AES-256 encryption for all sensitive data at rest and in transit",
    version: "1.2.0",
    status: "active",
    classification: "confidential",
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-02-10"),
    hash: "a7f8d9c1b2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9",
    approvedBy: "admin@security.com",
    rules: [
      {
        id: "rule-001",
        type: "encryption",
        condition: "data.classification == 'confidential'",
        action: "apply_aes256_encryption",
        priority: 1,
      },
    ],
  },
  {
    id: "pol-002",
    name: "Access Control Policy",
    description: "Role-based access control for all data sources",
    version: "2.0.1",
    status: "active",
    classification: "internal",
    createdAt: new Date("2026-01-20"),
    updatedAt: new Date("2026-02-15"),
    hash: "b8e9f0a1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
    approvedBy: "admin@security.com",
    rules: [
      {
        id: "rule-002",
        type: "access",
        condition: "user.role in ['admin', 'manager']",
        action: "grant_read_write",
        priority: 2,
      },
    ],
  },
  {
    id: "pol-003",
    name: "Data Retention Policy",
    description: "Automatic deletion of outdated records after 7 years",
    version: "1.0.0",
    status: "active",
    classification: "internal",
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-01"),
    hash: "c9f0a1b2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0",
    approvedBy: "compliance@security.com",
    rules: [
      {
        id: "rule-003",
        type: "retention",
        condition: "data.age > 7_years",
        action: "delete_records",
        priority: 3,
      },
    ],
  },
  {
    id: "pol-004",
    name: "GDPR Compliance",
    description: "Ensure compliance with GDPR requirements for EU data",
    version: "1.5.2",
    status: "active",
    classification: "restricted",
    createdAt: new Date("2026-01-10"),
    updatedAt: new Date("2026-02-18"),
    hash: "d0a1b2c3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1",
    approvedBy: "legal@security.com",
    rules: [
      {
        id: "rule-004",
        type: "compliance",
        condition: "data.region == 'EU'",
        action: "apply_gdpr_standards",
        priority: 1,
      },
    ],
  },
  {
    id: "pol-005",
    name: "Audit Logging Standard",
    description: "Log all data access and modifications for audit purposes",
    version: "1.1.0",
    status: "pending",
    classification: "internal",
    createdAt: new Date("2026-02-19"),
    updatedAt: new Date("2026-02-20"),
    hash: "e1b2c3d4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2",
    rules: [
      {
        id: "rule-005",
        type: "access",
        condition: "action in ['read', 'write', 'delete']",
        action: "log_to_audit_trail",
        priority: 2,
      },
    ],
  },
];

const initialDataSources: DataSource[] = [
  {
    id: "ds-001",
    name: "Customer Database",
    type: "database",
    size: "1.2 TB",
    records: 5280000,
    classification: "confidential",
    status: "secure",
    lastScan: new Date("2026-02-20"),
    appliedPolicies: ["pol-001", "pol-002", "pol-004"],
    encryption: true,
  },
  {
    id: "ds-002",
    name: "Transaction Logs",
    type: "file_system",
    size: "850 GB",
    records: 12500000,
    classification: "internal",
    status: "secure",
    lastScan: new Date("2026-02-21"),
    appliedPolicies: ["pol-001", "pol-003"],
    encryption: true,
  },
  {
    id: "ds-003",
    name: "Analytics API",
    type: "api",
    size: "320 GB",
    records: 2100000,
    classification: "internal",
    status: "secure",
    lastScan: new Date("2026-02-19"),
    appliedPolicies: ["pol-002"],
    encryption: false,
  },
  {
    id: "ds-004",
    name: "Real-time Stream",
    type: "stream",
    size: "150 GB",
    records: 850000,
    classification: "public",
    status: "at_risk",
    lastScan: new Date("2026-02-15"),
    appliedPolicies: [],
    encryption: false,
  },
];

const initialAuditLog: AuditEntry[] = [
  {
    id: "aud-001",
    timestamp: new Date("2026-02-21T10:30:00"),
    action: "update",
    entityType: "policy",
    entityId: "pol-001",
    entityName: "Data Encryption Standard",
    user: "admin@security.com",
    details: "Updated encryption algorithm to AES-256",
    oldHash: "a7f8d9c1b2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a8",
    newHash: "a7f8d9c1b2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9",
    verified: true,
  },
  {
    id: "aud-002",
    timestamp: new Date("2026-02-21T09:15:00"),
    action: "verify",
    entityType: "policy",
    entityId: "pol-002",
    entityName: "Access Control Policy",
    user: "compliance@security.com",
    details: "Policy integrity verification successful",
    verified: true,
  },
  {
    id: "aud-003",
    timestamp: new Date("2026-02-20T16:45:00"),
    action: "create",
    entityType: "policy",
    entityId: "pol-005",
    entityName: "Audit Logging Standard",
    user: "admin@security.com",
    details: "New audit logging policy created",
    newHash: "e1b2c3d4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2",
    verified: true,
  },
  {
    id: "aud-004",
    timestamp: new Date("2026-02-20T14:20:00"),
    action: "update",
    entityType: "data_source",
    entityId: "ds-001",
    entityName: "Customer Database",
    user: "sysadmin@security.com",
    details: "Applied GDPR compliance policy",
    verified: true,
  },
  {
    id: "aud-005",
    timestamp: new Date("2026-02-19T11:00:00"),
    action: "verify",
    entityType: "policy",
    entityId: "pol-004",
    entityName: "GDPR Compliance",
    user: "legal@security.com",
    details: "Quarterly compliance verification completed",
    verified: true,
  },
];

export function SecurityProvider({ children }: { children: ReactNode }) {
  const [policies, setPolicies] = useState<Policy[]>(initialPolicies);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(initialAuditLog);
  const [dataSources, setDataSources] = useState<DataSource[]>(initialDataSources);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalPolicies: 0,
    activePolicies: 0,
    totalDataSources: 0,
    secureDataSources: 0,
    complianceScore: 0,
    verificationRate: 0,
    recentViolations: 0,
  });

  useEffect(() => {
    // Calculate metrics
    const totalPolicies = policies.length;
    const activePolicies = policies.filter((p) => p.status === "active").length;
    const totalDataSources = dataSources.length;
    const secureDataSources = dataSources.filter((ds) => ds.status === "secure").length;
    const complianceScore = Math.round(
      (secureDataSources / Math.max(totalDataSources, 1)) * 100
    );
    const verifiedEntries = auditLog.filter((e) => e.verified).length;
    const verificationRate = Math.round(
      (verifiedEntries / Math.max(auditLog.length, 1)) * 100
    );
    const recentViolations = dataSources.filter((ds) => ds.status === "at_risk" || ds.status === "compromised").length;

    setMetrics({
      totalPolicies,
      activePolicies,
      totalDataSources,
      secureDataSources,
      complianceScore,
      verificationRate,
      recentViolations,
    });
  }, [policies, dataSources, auditLog]);

  const addAuditEntry = (entry: Omit<AuditEntry, "id" | "timestamp">) => {
    const newEntry: AuditEntry = {
      ...entry,
      id: `aud-${Date.now()}`,
      timestamp: new Date(),
    };
    setAuditLog((prev) => [newEntry, ...prev]);
  };

  const addPolicy = async (policy: Omit<Policy, "id" | "createdAt" | "updatedAt" | "hash">) => {
    const now = new Date();
    const policyData = JSON.stringify({
      version: policy.version,
      rules: policy.rules,
    });
    const hash = await generateHash(policyData);
    
    const newPolicy: Policy = {
      ...policy,
      id: `pol-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      hash,
    };

    setPolicies((prev) => [...prev, newPolicy]);
    addAuditEntry({
      action: "create",
      entityType: "policy",
      entityId: newPolicy.id,
      entityName: newPolicy.name,
      user: "admin@security.com",
      details: `Created new policy: ${newPolicy.name}`,
      newHash: hash,
      verified: true,
    });
  };

  const updatePolicy = async (id: string, updates: Partial<Policy>) => {
    const policy = policies.find((p) => p.id === id);
    if (!policy) return;

    const oldHash = policy.hash;
    let newHash = oldHash;

    if (updates.rules || updates.version) {
      const policyData = JSON.stringify({
        version: updates.version || policy.version,
        rules: updates.rules || policy.rules,
      });
      newHash = await generateHash(policyData);
    }

    setPolicies((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...updates, updatedAt: new Date(), hash: newHash }
          : p
      )
    );

    addAuditEntry({
      action: "update",
      entityType: "policy",
      entityId: id,
      entityName: policy.name,
      user: "admin@security.com",
      details: `Updated policy: ${Object.keys(updates).join(", ")}`,
      oldHash,
      newHash,
      verified: true,
    });
  };

  const deletePolicy = (id: string) => {
    const policy = policies.find((p) => p.id === id);
    if (!policy) return;

    setPolicies((prev) => prev.filter((p) => p.id !== id));
    addAuditEntry({
      action: "delete",
      entityType: "policy",
      entityId: id,
      entityName: policy.name,
      user: "admin@security.com",
      details: `Deleted policy: ${policy.name}`,
      verified: true,
    });
  };

  const verifyPolicy = async (id: string): Promise<boolean> => {
    const policy = policies.find((p) => p.id === id);
    if (!policy) return false;

    const policyData = JSON.stringify({
      id: policy.id,
      version: policy.version,
      rules: policy.rules,
    });
    const computedHash = await generateHash(policyData);
    const verified = computedHash === policy.hash;

    addAuditEntry({
      action: "verify",
      entityType: "policy",
      entityId: id,
      entityName: policy.name,
      user: "admin@security.com",
      details: verified
        ? "Policy integrity verification successful"
        : "Policy integrity verification failed",
      verified,
    });

    return verified;
  };

  const addDataSource = (dataSource: Omit<DataSource, "id">) => {
    const newDataSource: DataSource = {
      ...dataSource,
      id: `ds-${Date.now()}`,
    };
    setDataSources((prev) => [...prev, newDataSource]);
    addAuditEntry({
      action: "create",
      entityType: "data_source",
      entityId: newDataSource.id,
      entityName: newDataSource.name,
      user: "sysadmin@security.com",
      details: `Added new data source: ${newDataSource.name}`,
      verified: true,
    });
  };

  const updateDataSource = (id: string, updates: Partial<DataSource>) => {
    const dataSource = dataSources.find((ds) => ds.id === id);
    if (!dataSource) return;

    setDataSources((prev) =>
      prev.map((ds) => (ds.id === id ? { ...ds, ...updates } : ds))
    );

    addAuditEntry({
      action: "update",
      entityType: "data_source",
      entityId: id,
      entityName: dataSource.name,
      user: "sysadmin@security.com",
      details: `Updated data source: ${Object.keys(updates).join(", ")}`,
      verified: true,
    });
  };

  return (
    <SecurityContext.Provider
      value={{
        policies,
        auditLog,
        dataSources,
        metrics,
        addPolicy,
        updatePolicy,
        deletePolicy,
        verifyPolicy,
        addDataSource,
        updateDataSource,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error("useSecurity must be used within SecurityProvider");
  }
  return context;
}
