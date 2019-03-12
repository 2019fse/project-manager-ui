import React, { Component } from 'react';
import axios from 'axios';
import {NotificationManager} from 'react-notifications';
import { USER_SERVICE_URL } from '../common/Config';
class AddUserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      employeeId: ''
    }
  }
  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  onSubmit = (e) => {
    e.preventDefault();
    axios.post(USER_SERVICE_URL, this.state)
      .then(res => {
        NotificationManager.success(`User ${this.state.employeeId} added sucessfully`);
        this.setState({
          firstName: '',
          lastName: '',
          employeeId: ''
        });
        this.props.setShowEdit(false);
      });
  }

  render() {
    return (
      <div style={{ marginTop: 10 }} className="container">
        <h3>Add User</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>First Name:  </label>
            <input
              type="text"
              name="firstName"
              className="form-control"
              value={this.state.firstName}
              onChange={this.onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name: </label>
            <input type="text"
              name="lastName"
              className="form-control"
              value={this.state.lastName}
              onChange={this.onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Employee ID: </label>
            <input type="text"
              name="employeeId"
              className="form-control"
              value={this.state.employeeId}
              onChange={this.onChange}
              required
            />
          </div>
          <div className="form-group">
            <button value="Add" className="btn btn-primary m-2">Submit</button>
          </div>
        </form>
      </div>
    );
  }
}
export default AddUserPage;
