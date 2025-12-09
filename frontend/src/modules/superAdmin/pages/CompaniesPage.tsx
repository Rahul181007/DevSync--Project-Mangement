import React, { useEffect, useState } from "react";
import { companyApi } from "../../../services/api/company.api";
import { useNavigate } from "react-router-dom";
import type { Company } from "../../../types/company";
import CreateCompanyModal from "../Components/CreateCompanyModal";

const CompaniesPage = () => {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  // ------------------------
  // FETCH COMPANIES
  // ------------------------
  const loadCompanies = async () => {
    try {
      setLoading(true);

      const params: any = {
        page,
        limit: 10,
      };

      if (search.trim() !== "") params.search = search.trim();
      if (status.trim() !== "") params.status = status;

      const res = await companyApi.getCompanies(params);

      const data = res.data.data;

      setCompanies(data.item || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.log("Failed to load companies", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, [status, search, page]);

  // ------------------------
  // APPROVE COMPANY
  // ------------------------
  const handleApprove = async (id: string) => {
    try {
      await companyApi.updateStatus(id, "APPROVED");
      loadCompanies();
    } catch (error) {
      console.error("Failed to approve company", error);
    }
  };

  // ------------------------
  // VIEW DETAILS
  // ------------------------
  const handleView = (id: string) => {
    navigate(`/superadmin/companies/${id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Company Management</h1>

      {/* FILTER + SEARCH + CREATE */}
      <div className="flex items-center gap-4 mb-6">
        {/* STATUS FILTER */}
        <select
          className="border p-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="APPROVED">Active</option>
          <option value="PENDING">Pending</option>
          <option value="SUSPENDED">Suspended</option>
        </select>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by name or domain..."
          className="border p-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ADD NEW COMPANY BUTTON */}
        <button
          onClick={() => setShowModal(true)}
          className="ml-auto bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New Company
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white p-4 shadow rounded">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr className="text-gray-600 text-sm">
                  <th className="py-3 px-4 text-left font-semibold">Company</th>
                  <th className="py-3 px-4 text-left font-semibold">Domain</th>
                  <th className="py-3 px-4 text-center font-semibold">Users</th>
                  <th className="py-3 px-4 text-center font-semibold">Plan</th>
                  <th className="py-3 px-4 text-center font-semibold">Status</th>
                  <th className="py-3 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {companies.map((c) => (
                  <tr
                    key={c._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 font-medium">{c.name}</td>
                    <td className="py-3 px-4">{c.domain}</td>
                    <td className="py-3 px-4 text-center">{c.userCount || 0}</td>
                    <td className="py-3 px-4 text-center">{c.plan || "Free"}</td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          c.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : c.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right space-x-4">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => handleView(c._id)}
                      >
                        View
                      </button>

                      {c.status === "PENDING" && (
                        <button
                          className="text-green-600 hover:underline"
                          onClick={() => handleApprove(c._id)}
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between mt-4 items-center">
        <span className="text-sm text-gray-600">
          Page {page} / {totalPages}
        </span>

        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <CreateCompanyModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadCompanies();
          }}
        />
      )}
    </div>
  );
};

export default CompaniesPage;
