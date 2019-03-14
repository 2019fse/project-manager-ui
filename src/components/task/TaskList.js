import React, { Component } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { PROJECT_SERVICE_URL, TASK_PROJECT_SERVICE_URL, TASK_SERVICE_URL } from '../common/Config';
import EditTaskPage from './EditTaskPage';
class TaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: null,
      selectedProject: null,
      projectList: [],
      taskList: [],
      showEdit: false,
      selectedTask: {},
      columns: [{
        dataField: 'taskName',
        text: 'Task'
      },
      {
        dataField: 'parentTask',
        text: 'Parent'
      },
      {
        dataField: 'priority',
        text: 'Priority',
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
        dataField: 'status',
        text: 'Status',
        headerFormatter: this.buttonHeaderFormatter.bind(this),
        sort: true
      },
      {
        dataField: 'taskId',
        text: 'Action',
        formatter: this.actionFormatter.bind(this)
      }]
    }
  }
  getProjectList() {
    axios.get(PROJECT_SERVICE_URL)
      .then(response => {
        const projectList = response.data.map(p => Object.assign({}, { value: p.projectId, label: p.projectName }));
        this.setState({ projectList, selectedProject: null, projectId: null });
      })
      .catch(function (error) {
        NotificationManager.error(`Error in getting project list`);
      })
  }
  getTaskList(projectId) {
    axios.get(`${TASK_PROJECT_SERVICE_URL}${projectId}`)
      .then(response => {
        this.setState({ taskList: response.data });
      })
      .catch(function (error) {
        NotificationManager.error(`Error in getting task list`);
      })
  }
  componentDidMount() {
    this.getProjectList();
  }

  displayTable = (selectedItem) => {
    this.setState({ selectedProject: selectedItem, projectId: selectedItem.value });
    this.getTaskList(selectedItem.value);
  }
  updateTask = (task) => {
    const request = {
      taskId: task.taskId,
      parentId: task.parentId,
      projectId: task.projectId,
      taskName: task.taskName,
      startDate: task.startDate,
      endDate: task.endDate,
      priority: task.priority,
      status: "Completed"
    };
    axios.put(TASK_SERVICE_URL, request)
      .then(res => {
        NotificationManager.success(`Task ${request.taskId} updated sucessfully`);
        this.getTaskList(this.state.projectId);
      });
  }
  launchEditWindow = (selectedTask) => {
    this.setState({ selectedTask, showEdit: true });
  }
  handleEditClose = (refreshTaskList) => {
    this.setState({showEdit:false});
    if(refreshTaskList) {
      this.getTaskList(this.state.projectId);
    }
  }
  buttonHeaderFormatter(column, colIndex) {
    return (
      <button className="btn btn-info m-1">{column.text}</button>
    );
  }
  actionFormatter(cell, row) {
    return (
      <div className="column">
        <button className="btn btn-primary m-1" onClick={() => this.launchEditWindow(row)}>Edit</button>
        <button className="btn btn-danger m-1" onClick={(e) => { e.preventDefault(); this.updateTask(row); }} disabled={row.status}>End Task</button>
      </div>
    );
  }
  render() {
    const { SearchBar, ClearSearchButton } = Search;
    return (
      <div style={{ marginTop: 10 }} className="container">
        <h3>View Task</h3>
        <div className="form-group">
          <label>Project:  </label>
          <Select
            value={this.state.selectedProject}
            isClearable={true}
            placeholder="Search and Select a Project.."
            options={this.state.projectList}
            isSearchable={true}
            onChange={this.displayTable}
          />
        </div>
        <EditTaskPage task={this.state.selectedTask} showEdit={this.state.showEdit} onClose={this.handleEditClose}/>
        <div>
          <ToolkitProvider
            keyField="taskId"
            data={this.state.taskList}
            columns={this.state.columns}
            search
          >
            {
              props => (
                <div>
                  <h2>Search task:</h2>
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
      </div>
    );
  }
}
export default TaskList;
