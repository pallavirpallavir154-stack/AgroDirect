/**
 * Table — generic list renderer used by Users/Products/Orders.
 * columns: [{ key, header, render?(row) }]
 * Wrapped in .table-scroll so wide tables scroll horizontally on mobile
 * instead of breaking the page layout (Master Prompt §15).
 */
export default function Table({ columns, rows, rowKey = 'id' }) {
  return (
    <div className="table-scroll">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-soil-200 text-left text-xs font-medium uppercase tracking-wide text-soil-500">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 whitespace-nowrap">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-soil-100">
          {rows.map((row) => (
            <tr key={row[rowKey]} className="hover:bg-soil-50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 align-middle text-soil-800">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
