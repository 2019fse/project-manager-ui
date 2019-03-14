import React, {Component} from 'react';
import InputRange from 'react-input-range';
import DatePicker from "react-datepicker";
import Select from 'react-select';
import axios from 'axios';
import {NotificationManager} from 'react-notifications';
import { USER_SERVICE_URL, PROJECT_SERVICE_URL, PARENT_TASK_SERVICE_URL, TASK_SERVICE_URL } from '../common/Config';
class AddTaskPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: null,
      task: "",
      priority: 0,
      parentId: null,
      startDate:null,
      endDate: null,
      userId: null,
      childTaskEnabled: false,
      selectedProject: null,
      selectedUser: null,
      selectedParentTask: null,
      userList:[],
      projectList:[],
      parentTaskList:[]
    }
  }  
  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }
  handleCheckBox = () => {
    this.clearFields();
    this.setState({childTaskEnabled:!this.state.childTaskEnabled});
  }
  clearFields() {
    this.setState({
      childTaskEnabled:true,
      selectedProject: null,
      selectedUser: null,
      selectedParentTask: null,
      projectId: null,
      parentId: null,
      task: "",
      userId: null
    }); 

    if(this.state.childTaskEnabled) {
      this.setState({
        startDate: null,
        endDate: null
      }); 
    }
    else{
      this.setDefaultDates();
    }
  }
  setDefaultDates() {
    var nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);    
    this.setState({
      startDate: new Date(),
      endDate: nextDay
    });
  }
  componentDidMount() {
    this.getUserList();
    this.getParentTaskList();
    this.getProjectList();
  }

  getUserList() {
      axios.get(USER_SERVICE_URL)
          .then(response => {
              const userList = response.data.map(u => Object.assign({}, { value: u.id, label: `${u.firstName} ${u.lastName}` }));
              this.setState({ userList, selectedUser: null, userId: null });
          })
          .catch(function (error) {
            NotificationManager.error(`Error in getting user list`);
          })
  }  
  getParentTaskList() {
    axios.get(PARENT_TASK_SERVICE_URL)
        .then(response => {
            const parentTaskList = response.data.map(p => Object.assign({}, { value: p.parentId, label: p.parentTask }));
            this.setState({ parentTaskList, selectedParentTask: null, parentId: null });
        })
        .catch(function (error) {
          NotificationManager.error(`Error in getting parent task list`);
        })
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

  onSubmit = (e) => {
    e.preventDefault();
    if(this.state.childTaskEnabled) {
      const request = {
        projectId: this.state.projectId, 
        parentId: this.state.parentId, 
        taskName: this.state.task,
        priority: this.state.priority,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        userId: this.state.userId
      };
      if(!request.projectId) {
        NotificationManager.error(`Project field is required`);
        return;
      }
      if(!request.userId) {
        NotificationManager.error(`User field is required`);
        return;
      }
      if(request.startDate!==null && request.endDate!==null) {
        request.startDate.setHours(0, 0, 0, 0);
        request.endDate.setHours(0, 0, 0, 0);
        if(request.endDate.getTime() < request.startDate.getTime()) {
          NotificationManager.error(`End date cannot be before start date`);
          return;
        }
      }
      axios.post(TASK_SERVICE_URL, request)
      .then(res => {
        NotificationManager.success(`Task ${this.state.task} added sucessfully`);
        this.clearFields();
        this.setDefaultDates();
      });
    }
    else {
      const request = {parentTask: this.state.task};
      axios.post(PARENT_TASK_SERVICE_URL, request)
      .then(res => {
        NotificationManager.success(`Parent Task ${this.state.task} added sucessfully`);
        this.clearFields();
        this.getParentTaskList();
      });
    }
  }

  render() {
    return (
      <div style={{ marginTop: 10 }} className="container">
        <h3>Add Task</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Project:  </label>
            <Select
              value = {this.state.selectedProject}
              isClearable = {true}
              placeholder="Search and Select a Project.."
              options={this.state.projectList}
              isSearchable = {true}
              onChange={selectedItem => this.setState({ selectedProject:selectedItem, projectId: selectedItem.value })}
              isDisabled ={!this.state.childTaskEnabled}
              required={this.state.childTaskEnabled}      
            />
          </div>
          <div className="form-group">
            <input type="checkbox" checked={!this.state.childTaskEnabled} onChange={this.handleCheckBox}/>
            <label>Parent Task</label>
          </div>          
          <div className="form-group">
            <label>Task:  </label>
            <input
              name="task"
              type="text"
              className="form-control"
              value={this.state.task}
              onChange={this.onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Priority: </label>
            <InputRange 
              maxValue={30}
              minValue={0}
              name="priority"
              className="form-control"
              value={this.state.priority}
              onChange={value => this.setState({ priority: value })}       
              disabled ={!this.state.childTaskEnabled}
              required={this.state.childTaskEnabled}             
            />
          </div>
          <div className="form-group">
            <label>Parent Task:  </label>
            <Select
              value = {this.state.selectedParentTask}
              isClearable = {true}
              placeholder="Search and Select a Parent task.."
              options={this.state.parentTaskList}
              isSearchable = {true}
              onChange={selectedItem => this.setState({ selectedParentTask:selectedItem, parentId: selectedItem.value })}
              isDisabled ={!this.state.childTaskEnabled}
              required={this.state.childTaskEnabled}              
            />
          </div>

          <div className="form-group">
            <label>Set Start and End Date: </label>
            
            <div>
            <DatePicker
              placeholderText="End date"
              dateFormat="yyyy-MM-dd"
              className="form-control"
              selected={this.state.startDate}
              onChange={selected => this.setState({startDate:selected})}
              disabled={!this.state.childTaskEnabled}
              required={this.state.childTaskEnabled}
            />
            <DatePicker
              placeholderText="End date"
              dateFormat="yyyy-MM-dd"
              className="form-control"
              selected={this.state.endDate}
              onChange={selected => this.setState({endDate:selected})}
              disabled={!this.state.childTaskEnabled}
              required={this.state.childTaskEnabled}
            />
            </div>
          </div>

          <div className="form-group">
            <label>User: </label>
            <Select
              value = {this.state.selectedUser}
              isClearable = {true}
              placeholder="Search and Select a user.."
              options={this.state.userList}
              isSearchable = {true}
              onChange={selectedItem => this.setState({ selectedUser:selectedItem, userId: selectedItem.value })}
              isDisabled ={!this.state.childTaskEnabled}
              required={this.state.childTaskEnabled}              
            />
          </div>
          <div className="form-group">
            {
                this.state.childTaskEnabled ? (
                <button value="Add" className="btn btn-primary m-2">Add Task</button>
                ) : (
                <button value="Add" className="btn btn-primary m-2">Add Parent Task</button>
                )
            }
          </div>
        </form>
      </div>
    );
  }
}
export default AddTaskPage;
