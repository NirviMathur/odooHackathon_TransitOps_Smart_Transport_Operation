import { CheckCircle2, Eye } from 'lucide-react';
import StatusBadge from '../common/StatusBadge.jsx';
import EmptyState from '../common/EmptyState.jsx';
import { SkeletonTable } from '../common/Skeleton.jsx';
import { formatCurrency, formatDate } from '../../utils/formatters.js';
import { Wrench } from 'lucide-react';

export default function MaintenanceTable({ records, loading, onCloseMaintenance }) {
  if (loading) return <SkeletonTable rows={5} cols={9} />;

  if (records.length === 0) {
    return (
      <EmptyState
        icon={Wrench}
        title="No maintenance records found"
        message="Try adjusting your search or filters, or add a new maintenance record."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50/60">
            <th className="table-head">Vehicle Number</th>
            <th className="table-head">Vehicle Type</th>
            <th className="table-head">Maintenance Type</th>
            <th className="table-head">Garage</th>
            <th className="table-head">Date</th>
            <th className="table-head">Expected Completion</th>
            <th className="table-head">Cost</th>
            <th className="table-head">Status</th>
            <th className="table-head text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {records.map((r) => (
            <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="table-cell font-medium text-navy">{r.vehicleNumber}</td>
              <td className="table-cell text-muted">{r.vehicleType}</td>
              <td className="table-cell">{r.maintenanceType}</td>
              <td className="table-cell text-muted">{r.garage}</td>
              <td className="table-cell text-muted">{formatDate(r.startDate)}</td>
              <td className="table-cell text-muted">{formatDate(r.expectedCompletion)}</td>
              <td className="table-cell font-medium">{formatCurrency(r.cost)}</td>
              <td className="table-cell">
                <StatusBadge status={r.status} />
              </td>
              <td className="table-cell text-right">
                <div className="flex items-center justify-end gap-2">
                  <button className="text-slate-400 hover:text-navy p-1.5 rounded-lg hover:bg-slate-100">
                    <Eye size={16} />
                  </button>
                  {r.status !== 'Completed' && (
                    <button
                      onClick={() => onCloseMaintenance(r)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      <CheckCircle2 size={14} />
                      Close
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
