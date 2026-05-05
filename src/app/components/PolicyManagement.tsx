import { useState } from "react";
import { useSecurity } from "../context/SecurityContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Plus, Edit, Trash2, Shield, CheckCircle2, Clock } from "lucide-react";
import { Policy, PolicyRule } from "../types";
import { toast } from "sonner";

export function PolicyManagement() {
  const { policies, addPolicy, updatePolicy, deletePolicy } = useSecurity();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredPolicies = filterStatus === "all" 
    ? policies 
    : policies.filter(p => p.status === filterStatus);

  const handleCreatePolicy = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newRule: PolicyRule = {
      id: `rule-${Date.now()}`,
      type: formData.get("ruleType") as any,
      condition: formData.get("condition") as string,
      action: formData.get("action") as string,
      priority: 1,
    };

    await addPolicy({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      version: formData.get("version") as string,
      status: formData.get("status") as any,
      classification: formData.get("classification") as any,
      rules: [newRule],
    });

    toast.success("Policy created successfully");
    setIsCreateDialogOpen(false);
  };

  const handleUpdatePolicy = async (policy: Policy, field: string, value: any) => {
    await updatePolicy(policy.id, { [field]: value });
    toast.success("Policy updated successfully");
  };

  const handleDeletePolicy = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deletePolicy(id);
      toast.success("Policy deleted successfully");
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Policy Management</h1>
          <p className="text-gray-600">Create and manage security policies for your data</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Policy
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Policy</DialogTitle>
              <DialogDescription>
                Define a new security policy for your data sources
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreatePolicy} className="space-y-4">
              <div>
                <Label htmlFor="name">Policy Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Data Encryption Policy"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the policy purpose and scope"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    name="version"
                    placeholder="1.0.0"
                    defaultValue="1.0.0"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue="pending">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Policy Rule</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="ruleType">Rule Type</Label>
                    <Select name="ruleType" defaultValue="access">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="access">Access Control</SelectItem>
                        <SelectItem value="encryption">Encryption</SelectItem>
                        <SelectItem value="retention">Data Retention</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="condition">Condition</Label>
                    <Input
                      id="condition"
                      name="condition"
                      placeholder="e.g., data.classification == 'confidential'"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="action">Action</Label>
                    <Input
                      id="action"
                      name="action"
                      placeholder="e.g., apply_encryption"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Policy</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filterStatus === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("all")}
        >
          All ({policies.length})
        </Button>
        <Button
          variant={filterStatus === "active" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("active")}
        >
          Active ({policies.filter(p => p.status === "active").length})
        </Button>
        <Button
          variant={filterStatus === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("pending")}
        >
          Pending ({policies.filter(p => p.status === "pending").length})
        </Button>
        <Button
          variant={filterStatus === "inactive" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("inactive")}
        >
          Inactive ({policies.filter(p => p.status === "inactive").length})
        </Button>
      </div>

      {/* Policy List */}
      <div className="grid gap-4">
        {filteredPolicies.map((policy) => (
          <Card key={policy.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-xl">{policy.name}</CardTitle>
                    <Badge
                      variant={
                        policy.status === "active"
                          ? "default"
                          : policy.status === "pending"
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        policy.status === "active"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : policy.status === "pending"
                          ? "bg-orange-100 text-orange-700 border-orange-200"
                          : ""
                      }
                    >
                      {policy.status === "active" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {policy.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                      {policy.status}
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      {policy.classification}
                    </Badge>
                  </div>
                  <CardDescription>{policy.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePolicy(policy.id, policy.name)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Version</p>
                  <p className="font-medium text-gray-900">{policy.version}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Created</p>
                  <p className="font-medium text-gray-900">
                    {policy.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                  <p className="font-medium text-gray-900">
                    {policy.updatedAt.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Approved By</p>
                  <p className="font-medium text-gray-900">
                    {policy.approvedBy || "Pending"}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Policy Rules ({policy.rules.length})
                </h4>
                <div className="space-y-2">
                  {policy.rules.map((rule) => (
                    <div
                      key={rule.id}
                      className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {rule.type}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Priority: {rule.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">
                        <span className="font-medium">Condition:</span> {rule.condition}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Action:</span> {rule.action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500 mb-1">Policy Hash (SHA-256)</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-700 block overflow-x-auto">
                  {policy.hash}
                </code>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPolicies.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No policies found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
