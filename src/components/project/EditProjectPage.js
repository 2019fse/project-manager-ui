import React, { Component } from 'react';
import axios from 'axios';
import InputRange from 'react-input-range';
import DatePicker from "react-datepicker";
import Select from 'react-select';
import {NotificationManager} from 'react-notifications';
import { USER_SERVICE_URL, PROJECT_SERVICE_URL } from '../common/Config';
class EditProjectPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
        ...props.selectedRow,
        datePickerDisabled: props.selectedRow.startDate == null,
        selectedUser: null,
        userList:[]
    }
  }
  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }
  handleCheckBox = () => {
    this.setState({datePickerDisabled:!this.state.datePickerDisabled});
    this.resetDatePickers();
  }
  resetDatePickers() {
    if(this.state.datePickerDisabled) {
      var nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 1);
      this.setState({
        startDate: new Date(),
        endDate: nextDay
      });
    }
    else {
      this.setState({
        startDate:null,
        endDate:null
      });      
    }
  }
  onSubmit = (e) => {
    e.preventDefault();
    const { selectedUser, userList, ...request } = this.state;
    if(!request.managerId) {
      NotificationManager.error(`Project manager field is required`);
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
    axios.put(PROJECT_SERVICE_URL, request)
      .then(res => {
        NotificationManager.success(`Project ${this.state.projectName} updated sucessfully`);
        this.setState({
          projectName: '',
          startDate: null,
          endDate: null,
          priority: 0,
          managerId: null,
          selectedUser: null,
          datePickerDisabled: true
        });
        this.props.setShowEdit(false);
      });
  }
  componentDidMount() {
    this.getUserList();
  }
  getUserList() {
      axios.get(USER_SERVICE_URL)
          .then(response => {
              const userList = response.data.map(u => Object.assign({}, { value: u.id, label: `${u.firstName} ${u.lastName}` }));
              this.setState({ userList, selectedUser: userList.find(user => user.value === this.state.managerId), managerId: this.state.managerId });
          })
          .catch(function (error) {
            NotificationManager.error(`Error in loading user list`);
          })
  }
  componentDidUpdate(prevProps) {
    if (this.props.selectedRow.projectId !== prevProps.selectedRow.projectId) {
      this.setState({
        ...this.props.selectedRow,
        datePickerDisabled: this.props.selectedRow.startDate == null
      });
    }
  }  
  render() {
    return (
      <div style={{ marginTop: 10 }} className="container">
        <h3>Edit Project</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Project:  </label>
            <input
              type="text"
              name="projectName"
              className="form-control"
              value={this.state.projectName}
              onChange={this.onChange}
              required
            />
          </div>
          <div className="form-group">
            <input type="checkbox" checked={!this.state.datePickerDisabled} onChange={this.handleCheckBox}/>
            <label>Set Start and End Date: </label>
            
            <div>
            <DatePicker
              placeholderText="Start date"
              dateFormat="yyyy-MM-dd"
              className="form-control"
              selected={this.state.startDate}
              onChange={selected => this.setState({startDate:selected})}
              disabled={this.state.datePickerDisabled}
              required={!this.state.datePickerDisabled}
            />
            <DatePicker
              placeholderText="End date"
              dateFormat="yyyy-MM-dd"
              className="form-control"
              selected={this.state.endDate}
              onChange={selected => this.setState({endDate:selected})}
              disabled={this.state.datePickerDisabled}
              required={!this.state.datePickerDisabled}
            />
            </div>
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
            />
          </div>

          <div className="form-group">
            <label>Manager: </label>
            <Select
              value = {this.state.selectedUser}
              required = {true}
              isClearable = {true}
              placeholder="Search and Select a manager.."
              options={this.state.userList}
              isSearchable = {true}
              onChange={selectedItem => this.setState({ selectedUser:selectedItem, managerId: selectedItem.value })}
            />
          </div>
          <div className="form-group">
            <button className="btn btn-primary m-2">Update</button>
            <button className="btn btn-danger m-2" onClick={(e) => {e.preventDefault(); this.props.setShowEdit(false);}}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }
}
export default EditProjectPage;
