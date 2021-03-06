import React, {Component} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
class UserList extends Component {
    state = {
        columns: [{
            dataField: 'firstName',
            text: 'First Name',
            headerFormatter: this.buttonHeaderFormatter.bind(this),
            sort: true
        },
        {
            dataField: 'lastName',
            text: 'Last Name',
            headerFormatter: this.buttonHeaderFormatter.bind(this),
            sort: true
        }, {
            dataField: 'employeeId',
            text: 'Employee Id',
            headerFormatter: this.buttonHeaderFormatter.bind(this),
            sort: true
        }, {
            dataField: 'id',
            text: 'Action',
            formatter: this.actionFormatter.bind(this)
        }, {
            dataField: 'id',
            hidden: true
        }]
    }
    buttonHeaderFormatter(column, colIndex) {
        return (
          <button className="btn btn-info m-1">{ column.text }</button>
        );
    }
    actionFormatter(cell, row) {
        return (
            <div className="column">
                <button className="btn btn-primary m-1" onClick={() => this.props.setShowEdit(true, row)}>Edit</button>
                <button className="btn btn-danger m-1" onClick={() => this.props.deleteRow(cell)}>Delete</button>
            </div>
        );
    }
    render() {
        const { SearchBar, ClearSearchButton } = Search;
        return (
            <div className="container">
                <ToolkitProvider
                    keyField="id"
                    data={this.props.rows}
                    columns={this.state.columns}
                    search
                >
                    {
                        props => (
                            <div>
                                <h2>Search user:</h2>
                                <SearchBar {...props.searchProps} />
                                <ClearSearchButton {...props.searchProps} className="btn btn-danger m-2" />

                                <BootstrapTable
                                    {...props.baseProps}
                                    tableHeaderClass="thead-light"
                                    striped
                                    hover
                                    condensed
                                    bootstrap4
                                />
                            </div>
                        )
                    }
                </ToolkitProvider>
            </div>
        );
    }
}
export default UserList;