import React,{useState} from "react";
import { companyApi } from "../../../services/api/company.api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // refresh list
}

const CreateCompanyModal = ({ isOpen, onClose, onSuccess }: Props) => {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name.trim() || !domain.trim()) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await companyApi.createCompany({ name, domain });
      onSuccess();
      onClose();
      setName("");
      setDomain("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Create New Company</h2>

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <div className="mb-3">
          <label className="text-sm font-medium">Company Name</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Example: Alpha Solutions"
          />
        </div>

        <div className="mb-3">
          <label className="text-sm font-medium">Company Domain</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded mt-1"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCompanyModal;
