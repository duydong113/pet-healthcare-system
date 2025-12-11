"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { invoiceAPI, appointmentAPI, petOwnerAPI } from "@/services/api";
import { Plus, Edit, Trash2, X, DollarSign } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const [formData, setFormData] = useState({
    appointment_id: "",
    owner_id: "",
    base_amount: "",
    additional_cost: "",
    total_amount: "",
    payment_method: "Cash",
    payment_status: "Pending",
    payment_date: "",
    issued_by: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [invRes, appRes, ownerRes] = await Promise.all([
        invoiceAPI.getAll(),
        appointmentAPI.getAll(),
        petOwnerAPI.getAll(),
      ]);

      setInvoices(invRes.data);
      setAppointments(appRes.data);
      setOwners(ownerRes.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      appointment_id: "",
      owner_id: "",
      base_amount: "",
      additional_cost: "",
      total_amount: "",
      payment_method: "Cash",
      payment_status: "Pending",
      payment_date: "",
      issued_by: "",
    });
    setEditing(null);
  };

  /** Tính tổng tiền service trong 1 appointment */
  const computeBaseAmountFromAppointment = (appointmentId: number): number => {
    const apt = appointments.find(
      (a: any) => a.appointment_id === appointmentId
    );
    if (!apt) return 0;

    // Nếu dùng bảng appointmentServices (nhiều service)
    if (apt.appointmentServices?.length) {
      return apt.appointmentServices.reduce((sum: number, as: any) => {
        const price = as.service?.price ?? as.service_price ?? 0;
        return sum + Number(price || 0);
      }, 0);
    }

    // Trường hợp chỉ có 1 service trực tiếp trên appointment
    if (apt.service?.price) {
      return Number(apt.service.price || 0);
    }

    return 0;
  };

  /** Khi chọn appointment trong modal */
  const handleChangeAppointment = (value: string) => {
    const appointmentId = parseInt(value, 10);
    const base = !isNaN(appointmentId)
      ? computeBaseAmountFromAppointment(appointmentId)
      : 0;
    const additional = Number(formData.additional_cost) || 0;
    const total = base + additional;

    // tự gán owner theo appointment
    let ownerIdStr = formData.owner_id;
    const apt = appointments.find(
      (a: any) => a.appointment_id === appointmentId
    );
    if (apt?.owner_id) {
      ownerIdStr = String(apt.owner_id);
    }

    setFormData((prev) => ({
      ...prev,
      appointment_id: value,
      owner_id: ownerIdStr,
      base_amount: base ? base.toString() : "",
      total_amount: total ? total.toString() : "",
    }));
  };

  /** Khi đổi Additional Cost → Total tự cập nhật */
  const handleChangeAdditionalCost = (value: string) => {
    const base = Number(formData.base_amount) || 0;
    const additional = Number(value) || 0;
    const total = base + additional;

    setFormData((prev) => ({
      ...prev,
      additional_cost: value,
      total_amount: total ? total.toString() : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      appointment_id: parseInt(formData.appointment_id),
      owner_id: parseInt(formData.owner_id),
      base_amount: Number(formData.base_amount) || 0,
      additional_cost: Number(formData.additional_cost) || 0,
      total_amount: Number(formData.total_amount) || 0,
      payment_method: formData.payment_method,
      payment_status: formData.payment_status,
      payment_date: formData.payment_date
        ? new Date(formData.payment_date)
        : null,
      issued_by: formData.issued_by,
    };

    try {
      if (editing) {
        await invoiceAPI.update(editing.invoice_id, payload);
      } else {
        await invoiceAPI.create(payload);
      }

      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error saving invoice");
    }
  };

  const handleEdit = (inv: any) => {
    setEditing(inv);
    setFormData({
      appointment_id: String(inv.appointment_id),
      owner_id: String(inv.owner_id),
      base_amount: String(inv.base_amount ?? ""),
      additional_cost: String(inv.additional_cost ?? ""),
      total_amount: String(inv.total_amount ?? ""),
      payment_method: inv.payment_method,
      payment_status: inv.payment_status,
      payment_date: inv.payment_date
        ? new Date(inv.payment_date).toISOString().slice(0, 10)
        : "",
      issued_by: inv.issued_by,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete invoice?")) return;

    try {
      await invoiceAPI.delete(id);
      fetchData();
    } catch (err) {
      alert("Error deleting invoice");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600">Manage payments and billing</p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            <Plus size={20} />
            New Invoice
          </button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-black">ID</th>
                  <th className="px-6 py-3 text-xs font-bold text-black">
                    Appointment
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-black">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-black">
                    Total
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-black">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-black">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {invoices.map((inv) => (
                  <tr key={inv.invoice_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-black">{inv.invoice_id}</td>
                    <td className="px-6 py-4 text-black">
                      {inv.appointment_id}
                    </td>
                    <td className="px-6 py-4 text-black">
                      {inv.owner?.full_name}
                    </td>
                    <td className="px-6 py-4 text-black font-semibold">
                      {formatPrice(inv.total_amount)}
                    </td>
                    <td className="px-6 py-4 text-black">
                      {inv.payment_status}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(inv)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(inv.invoice_id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={18} />
                        </button>

                        {/* View payment history */}
                        <button
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setSelectedHistory(inv.payment_history || []);
                            setShowHistoryModal(true);
                          }}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded"
                        >
                          <DollarSign size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ------------------ Modal Create/Edit Invoice ------------------ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg  p-6 text-black rounded-2xl shadow-xl">
            <div className="flex justify-between  items-center mb-4 border-b pb-2">
              <h2 className="text-xl text-black font-semibold">
                {editing ? "Edit Invoice" : "New Invoice"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Appointment */}
              <div>
                <label className="text-sm text-black font-medium">
                  Appointment *
                </label>
                <select
                  value={formData.appointment_id}
                  onChange={(e) => handleChangeAppointment(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select</option>
                  {appointments.map((a) => (
                    <option key={a.appointment_id} value={a.appointment_id}>
                      #{a.appointment_id} – {a.pet?.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Base amount sẽ tự tính = tổng giá các dịch vụ trong
                  appointment.
                </p>
              </div>

              {/* Owner */}
              <div>
                <label className="text-sm font-medium">Owner *</label>
                <select
                  value={formData.owner_id}
                  onChange={(e) =>
                    setFormData({ ...formData, owner_id: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select</option>
                  {owners.map((o) => (
                    <option key={o.owner_id} value={o.owner_id}>
                      {o.full_name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Khi chọn appointment, hệ thống sẽ tự gợi ý đúng owner của lịch
                  hẹn.
                </p>
              </div>

              {/* Amounts */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Base Amount</label>
                  <input
                    type="number"
                    value={formData.base_amount}
                    readOnly
                    className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Additional Cost</label>
                  <input
                    type="number"
                    value={formData.additional_cost}
                    onChange={(e) => handleChangeAdditionalCost(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Thêm chi phí phát sinh (thuốc ngoài, phụ phí,... nếu có).
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Total Amount</label>
                <input
                  type="number"
                  value={formData.total_amount}
                  readOnly
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Payment method & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Payment Method</label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment_method: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option>Cash</option>
                    <option>Card</option>
                    <option>Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Payment Status</label>
                  <select
                    value={formData.payment_status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment_status: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option>Pending</option>
                    <option>Finalized</option>
                    <option>Paid</option>
                    <option>Canceled</option>
                  </select>
                </div>
              </div>

              {/* Payment Date */}
              <div>
                <label className="text-sm font-medium">Payment Date</label>
                <input
                  type="date"
                  value={formData.payment_date}
                  onChange={(e) =>
                    setFormData({ ...formData, payment_date: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {/* Issued By */}
              <div>
                <label className="text-sm font-medium">Issued By *</label>
                <input
                  type="text"
                  value={formData.issued_by}
                  onChange={(e) =>
                    setFormData({ ...formData, issued_by: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------ Payment History Modal ------------------ */}
      {showHistoryModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-xl text-black font-semibold">
                Payment History – Invoice #{selectedInvoice.invoice_id}
              </h2>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-black-600"
              >
                <X size={22} color="red" />
              </button>
            </div>

            {selectedHistory.length === 0 ? (
              <p className="text-black-600 text-sm">No history yet.</p>
            ) : (
              <ul className="space-y-3 max-h-80 overflow-y-auto">
                {selectedHistory.map((h, idx) => (
                  <li
                    key={idx}
                    className="p-3 border rounded-lg bg-black-50 flex justify-between"
                  >
                    <div>
                      <p className="font-medium text-black">
                        Status: {h.status}
                      </p>
                      {h.changed_by && (
                        <p className="text-xs text-black-500 text-black">
                          By: {h.changed_by}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-black-500 text-black">
                      {new Date(h.payment_date).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
