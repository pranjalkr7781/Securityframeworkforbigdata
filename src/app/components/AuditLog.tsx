import { useState } from "react";
import { useSecurity } from "../context/SecurityContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Search, FileText, Database, User, CheckCircle2, XCircle, Filter } from "lucide-react";
import { AuditEntry } from "../types";

export function AuditLog() {
  const { auditLog } = useSecurity();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterEntityType, setFilterEntityType] = useState("all");

  const filteredLog = auditLog.filter((entry) => {
    const matchesSearch =
      entry.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.user.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = filterAction === "all" || entry.action === filterAction;
    const matchesEntityType =
      filterEntityType === "all" || entry.entityType === filterEntityType;

    return matchesSearch && matchesAction && matchesEntityType;
  });

  const getActionIcon = (action: AuditEntry["action"]) => {
    switch (action) {
      case "create":
        return "➕";
      case "update":
        return "✏️";
      case "delete":
        return "🗑️";
      case "verify":
        return "✅";
      default:
        return "📝";
    }
  };

  const getActionColor = (action: AuditEntry["action"]) => {
    switch (action) {
      case "create":
        return "bg-green-100 text-green-700 border-green-200";
      case "update":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "delete":
        return "bg-red-100 text-red-700 border-red-200";
      case "verify":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getEntityIcon = (entityType: AuditEntry["entityType"]) => {
    switch (entityType) {
      case "policy":
        return <FileText className="w-4 h-4" />;
      case "data_source":
        return <Database className="w-4 h-4" />;
      case "user":
        return <User className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Audit Log</h1>
        <p className="text-gray-600">
          Complete audit trail of all security framework activities
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search audit log..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="verify">Verify</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterEntityType} onValueChange={setFilterEntityType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by entity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entity Types</SelectItem>
                <SelectItem value="policy">Policy</SelectItem>
                <SelectItem value="data_source">Data Source</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>
              Showing {filteredLog.length} of {auditLog.length} entries
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Audit Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            All actions are cryptographically verified and immutable
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity Type</TableHead>
                  <TableHead>Entity Name</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Verified</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLog.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono text-xs whitespace-nowrap">
                      {entry.timestamp.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getActionColor(entry.action)}>
                        <span className="mr-1">{getActionIcon(entry.action)}</span>
                        {entry.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getEntityIcon(entry.entityType)}
                        <span className="capitalize">
                          {entry.entityType.replace("_", " ")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{entry.entityName}</TableCell>
                    <TableCell className="text-sm text-gray-600">{entry.user}</TableCell>
                    <TableCell className="max-w-md">
                      <p className="text-sm text-gray-700 truncate" title={entry.details}>
                        {entry.details}
                      </p>
                      {entry.oldHash && (
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-gray-500">
                            Old Hash:{" "}
                            <code className="bg-gray-100 px-1 rounded">
                              {entry.oldHash.substring(0, 16)}...
                            </code>
                          </p>
                          <p className="text-xs text-gray-500">
                            New Hash:{" "}
                            <code className="bg-gray-100 px-1 rounded">
                              {entry.newHash?.substring(0, 16)}...
                            </code>
                          </p>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {entry.verified ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-xs">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600">
                          <XCircle className="w-4 h-4" />
                          <span className="text-xs">Failed</span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLog.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500">No audit entries found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
