
import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AddProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: {
    project_name: string;
    site_address?: string;
    estimated_quantity?: number;
    status?: string;
    completion_date?: string;
  }) => Promise<void>;
  customerName?: string;
}

export function AddProjectDialog({
  open,
  onClose,
  onAdd,
  customerName,
}: AddProjectDialogProps) {
  const [projectName, setProjectName] = useState("");
  const [site, setSite] = useState("");
  const [estQty, setEstQty] = useState("");
  const [status, setStatus] = useState("in_progress");
  const [compDate, setCompDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAdd({
        project_name: projectName,
        site_address: site,
        estimated_quantity: estQty ? Number(estQty) : undefined,
        status,
        completion_date: compDate || undefined,
      });
      setProjectName("");
      setSite("");
      setEstQty("");
      setStatus("in_progress");
      setCompDate("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Add Project for {customerName}</Dialog.Title>
        </Dialog.Header>
        <form onSubmit={handleSave} className="space-y-4 mt-2">
          <div>
            <label className="block text-sm font-medium">Project Name</label>
            <input
              required
              type="text"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Project name"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Site Address</label>
            <input
              type="text"
              value={site}
              onChange={e => setSite(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Estimated Quantity (L)</label>
            <input
              type="number"
              value={estQty}
              onChange={e => setEstQty(e.target.value.replace(/[^0-9.]/g, ""))}
              className="w-full p-2 border rounded"
              placeholder="Optional"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Completion Date</label>
            <input
              type="date"
              value={compDate}
              onChange={e => setCompDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !projectName}>
              {loading ? "Saving..." : "Add Project"}
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog>
  );
}
