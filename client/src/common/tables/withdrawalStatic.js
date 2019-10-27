import React from "react";
import history from "@/common/history";
import { formatDate } from "@/common/date";

const WithdrawalsTable = ({ data }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>Withdrawal ID</td>
				<td>Type</td>
				<td>Branch</td>
				<td>Customer</td>
				<td>Department</td>
				<td className="has-no-line-break">ผู้เบิก</td>
				<td>Date</td>
				<td className="has-no-line-break">Install Date</td>
				<td className="has-no-line-break">Return Date</td>
				<td>Status</td>
			</tr>
		</thead>
		<tbody className="is-hoverable">
			{data &&
				(data.withdrawals.length > 0 &&
					data.withdrawals.map((e, i) => (
						<tr
							className="is-hoverable is-clickable"
							key={`${i} ${e.id}`}
							onClick={event => {
								history.push(`/single/withdrawal/${e.id}`);
								event.stopPropagation();
							}}
						>
							<td className="has-no-line-break">{e.id}</td>
							<td className="has-no-line-break">{e.type}</td>
							<td className="has-no-line-break">
								{e.type !== "TRANSFER" ? `${e.branch.name} (${e.branch.branch_code})` : "N/A"}
							</td>
							<td className="has-no-line-break">
								{e.type !== "TRANSFER" ? `${e.branch.customer.name} (${e.branch.customer.customer_code})` : "N/A"}
							</td>
							<td className="has-no-line-break">
								{e.type === "TRANSFER" ? `${e.department.name} (${e.department.department_code})` : "N/A"}
							</td>
							<td className="has-no-line-break">{e.staff.name}</td>
							<td className="has-no-line-break">{formatDate(e.date)}</td>
							<td className="has-no-line-break">{formatDate(e.install_date)}</td>
							<td className="has-no-line-break">{formatDate(e.return_by)}</td>
							<td>{e.status}</td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default WithdrawalsTable;
