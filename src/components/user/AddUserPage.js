import React, { Component } from 'react';
import axios from 'axios';
import { SERVER_URL } from '../common/Config';
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
    axios.post(SERVER_URL + 'user', this.state)
      .then(res => {
        console.log(res.data);
        this.setState({
          firstName: '',
          lastName: '',
          employeeId: ''
        });
        this.props.setShowEdit(false);
      });
  }

  render() {
    console.log("AddUserPage Render Called");
    return (
      <div style={{ marginTop: 10 }} className="container">
        <h3>AddUserPage</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>First Name:  </label>
            <input
              type="text"
              name="firstName"
              className="form-control"
              value={this.state.firstName}
              onChange={this.onChange}
              required="true"
            />
          </div>
          <div className="form-group">
            <label>Last Name: </label>
            <input type="text"
              name="lastName"
              className="form-control"
              value={this.state.lastName}
              onChange={this.onChange}
              required="true"
            />
          </div>
          <div className="form-group">
            <label>Employee ID: </label>
            <input type="text"
              name="employeeId"
              className="form-control"
              value={this.state.employeeId}
              onChange={this.onChange}
              required="true"
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
