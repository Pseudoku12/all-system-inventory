import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";
import { setSelectedObject } from "@/actions/record";
import { connect } from "react-redux";

class SearchField extends React.Component {
	state = {
		data: null,
		searchedDataFrontEnd: null,
		showResults: false,
		value: ""
	};
	handleSearch() {
		const { searchUrl, searchName, frontEnd } = this.props;
		const { value } = this.state;
		if (value.length < 3 && !frontEnd) {
			this.setState({ data: null });
		} else {
			Axios.get(`${searchUrl}?search_col=${searchName}&search_term=${value}`).then(
				res => {
					this.setState({ data: res.data });
					if (frontEnd) {
						this.setState({ searchedDataFrontEnd: res.data.rows })
					}
					console.log(res);
				}
			);
		}
	}
	handleSearchFrontEnd() {
		const { searchName } = this.props;
		const { value, data } = this.state;
		if (value.length >= 3) {
			this.setState({
				searchedDataFrontEnd: data ? data.rows.filter(e => e[searchName].includes(value)) : null
			});
		}
	}
	handleKeyPress(e) {
		const { frontEnd } = this.props;
		if (e.key === "Enter") {
			if (frontEnd) {
				this.handleSearchFrontEnd();
			} else {
				this.handleSearch();
			}
		}
	}

	getData() {
		const { frontEnd } = this.props;
		if (frontEnd) {
			return {
				rows: this.state.searchedDataFrontEnd
			};
		} else return this.state.data;
	}
	makeObject(key, value) {
		const obj = {};
		obj[key] = value;
		return obj;
	}

	componentDidMount() {
		const { frontEnd } = this.props;
		if (frontEnd) {
			this.handleSearch();
		}
	}
	render() {
		const {
			label,
			placeholder,
			listItem,
			disabled,
			responsibleFor
		} = this.props;
		const { showResults, value } = this.state;
		return (
			<div className={`field ${disabled && "is-disabled"}`} onFocus={() => this.setState({ showResults: true })}>
				<label className="label has-no-line-break">{label}</label>
				<div className="is-flex">
					<input
						className="input is-flex-fullwidth"
						placeholder={placeholder}
						value={this.props[responsibleFor] ? this.props[responsibleFor].name : value}
						onChange={e => {
							this.setState({ value: e.target.value });
							setSelectedObject(this.makeObject(responsibleFor, null));
						}}
						onKeyPress={e => this.handleKeyPress(e)}
						disabled={disabled}
					/>
					<button
						className="button has-ml-05 no-mb"
						type="button"
						onClick={() => this.handleSearch()}
					>
						<FontAwesomeIcon icon={faSearch} />
					</button>
					{ listItem && (
						<div 
							className={`panel menu dropdown ${showResults || "is-hidden"}`} 
							onClick={() => this.setState({ showResults: false })}
						>
							{(this.getData() && this.getData().rows) ? (
								this.getData().rows.length > 0 ? (
									this.getData().rows.map((e, i) => listItem(e,i))
								) : (
									<span className="list-item">ไม่พบรายการ</span>
								)
							) : (
								<span className="list-item">กรุณาพิมพ์อย่างน้อย 3 ตัวอักษรแล้วกดค้นหา</span>
							)}
						</div>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	selectedCustomer: state.record.selectedCustomer,
	selectedBranch: state.record.selectedBranch,
	selectedSupplier: state.record.selectedSupplier,
	selectedModel: state.record.selectedModel,
	selectedStaff: state.record.selectedStaff,
	selectedDepartment: state.record.selectedDepartment,
	selectedProductType: state.record.selectedProductType
})
const mapDispatchToProps = {
	setSelectedObject
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchField);
