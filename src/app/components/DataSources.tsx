import { useState } from "react";
import { useSecurity } from "../context/SecurityContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import {
  Database,
  HardDrive,
  Cloud,
  Radio,
  Plus,
  Shield,
  ShieldAlert,
  ShieldX,
  Lock,
  Unlock,
} from "lucide-react";
import { DataSource } from "../types";
import { toast } from "sonner";

export function DataSources() {
  const { dataSources, policies, addDataSource, updateDataSource } = useSecurity();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredDataSources =
    filterStatus === "all"
      ? dataSources
      : dataSources.filter((ds) => ds.status === filterStatus);

  const handleCreateDataSource = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    addDataSource({
      name: formData.get("name") as string,
      type: formData.get("type") as any,
      size: formData.get("size") as string,
      records: parseInt(formData.get("records") as string),
      classification: formData.get("classification") as any,
      status: "secure",
      lastScan: new Date(),
      appliedPolicies: [],
      encryption: formData.get("encryption") === "true",
    });

    toast.success("Data source added successfully");
    setIsCreateDialogOpen(false);
  };

  const getTypeIcon = (type: DataSource["type"]) => {
    switch (type) {
      case "database":
        return <Database className="w-5 h-5" />;
      case "file_system":
        return <HardDrive className="w-5 h-5" />;
      case "api":
        return <Cloud className="w-5 h-5" />;
      case "stream":
        return <Radio className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: DataSource["status"]) => {
    switch (status) {
      case "secure":
        return <Shield className="w-4 h-4 text-green-600" />;
      case "at_risk":
        return <ShieldAlert className="w-4 h-4 text-orange-600" />;
      case "compromised":
        return <ShieldX className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: DataSource["status"]) => {
    switch (status) {
      case "secure":
        return "bg-green-100 text-green-700 border-green-200";
      case "at_risk":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "compromised":
        return "bg-red-100 text-red-700 border-red-200";
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Data Sources</h1>
          <p className="text-gray-600">Manage and secure your big data repositories</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Data Source
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Data Source</DialogTitle>
              <DialogDescription>
                Register a new data source to apply security policies
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateDataSource} className="space-y-4">
              <div>
                <Label htmlFor="name">Data Source Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Customer Database"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" defaultValue="database">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="file_system">File System</SelectItem>
                      <SelectItem value="api">API</SelectItem>
                      <SelectItem value="stream">Stream</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="classification">Classification</Label>
                  <Select name="classification" defaultValue="internal">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="confidential">Confidential</SelectItem>
                      <SelectItem value="restricted">Restricted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    name="size"
                    placeholder="e.g., 1.2 TB"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="records">Number of Records</Label>
                  <Input
                    id="records"
                    name="records"
                    type="number"
                    placeholder="e.g., 1000000"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="encryption">Encryption</Label>
                <Select name="encryption" defaultValue="true">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Enabled</SelectItem>
                    <SelectItem value="false">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Data Source</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filterStatus === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("all")}
        >
          All ({dataSources.length})
        </Button>
        <Button
          variant={filterStatus === "secure" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("secure")}
        >
          Secure ({dataSources.filter((ds) => ds.status === "secure").length})
        </Button>
        <Button
          variant={filterStatus === "at_risk" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("at_risk")}
        >
          At Risk ({dataSources.filter((ds) => ds.status === "at_risk").length})
        </Button>
        <Button
          variant={filterStatus === "compromised" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("compromised")}
        >
          Compromised ({dataSources.filter((ds) => ds.status === "compromised").length})
        </Button>
      </div>

      {/* Data Source Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDataSources.map((dataSource) => (
          <Card key={dataSource.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {getTypeIcon(dataSource.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{dataSource.name}</CardTitle>
                    <CardDescription className="capitalize">
                      {dataSource.type.replace("_", " ")}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(dataSource.status)}>
                  {getStatusIcon(dataSource.status)}
                  <span className="ml-1 capitalize">{dataSource.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Size</p>
                  <p className="font-medium text-gray-900">{dataSource.size}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Records</p>
                  <p className="font-medium text-gray-900">
                    {dataSource.records.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Classification</p>
                  <Badge variant="outline" className="capitalize bg-purple-50 text-purple-700 border-purple-200">
                    {dataSource.classification}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Encryption</p>
                  <div className="flex items-center gap-1">
                    {dataSource.encryption ? (
                      <>
                        <Lock className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">Enabled</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium text-red-600">Disabled</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Applied Policies</p>
                  <span className="text-xs text-gray-500">
                    {dataSource.appliedPolicies.length} active
                  </span>
                </div>
                {dataSource.appliedPolicies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {dataSource.appliedPolicies.map((policyId) => {
                      const policy = policies.find((p) => p.id === policyId);
                      return policy ? (
                        <Badge key={policyId} variant="outline" className="text-xs">
                          {policy.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No policies applied</p>
                )}
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Last Security Scan</span>
                  <span>{dataSource.lastScan.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDataSources.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No data sources found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
