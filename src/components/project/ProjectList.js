import React, {Component} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
class ProjectList extends Component {
    state = {
        columns: [{
            dataField: 'projectName',
            text: 'Project Name',
        },
        {
            dataField: 'taskTotalCount',
            text: 'No of Tasks',
        }, 
        {
            dataField: 'taskCompletedCount',
            text: 'Completed',
            headerFormatter: this.buttonHeaderFormatter.bind(this),
            sort: true
        }, 
        {
            dataField: 'startDate',
            text: 'Start Date',
            headerFormatter: this.buttonHeaderFormatter.bind(this),
            sort: true
        }, 
        {
            dataField: 'endDate',
            text: 'End Date',
            headerFormatter: this.buttonHeaderFormatter.bind(this),
            sort: true
        }, 
        {
            dataField: 'priority',
            text: 'Priority',
            headerFormatter: this.buttonHeaderFormatter.bind(this),            
            sort: true
        },    
        {
            dataField: 'projectId',
            hidden: true
        },                     
        {
            dataField: 'projectId',
            text: 'Action',
            formatter: this.actionFormatter.bind(this)
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
                <button className="btn btn-danger m-1" onClick={() => this.props.deleteRow(cell)}>Suspend</button>
            </div>
        );
    }
    render() {
        const { SearchBar, ClearSearchButton } = Search;
        return (
            <div className="container">
                <ToolkitProvider
                    keyField="projectId"
                    data={this.props.rows}
                    columns={this.state.columns}
                    search
                >
                    {
                        props => (
                            <div>
                                <h2>Search project:</h2>
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
export default ProjectList;