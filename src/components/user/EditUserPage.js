import React, { Component } from 'react';
import axios from 'axios';
import { SERVER_URL } from '../common/Config';
class EditUserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.selectedRow
    }
  }
  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  onSubmit = (e) => {
    e.preventDefault();
    axios.put(SERVER_URL + 'user', this.state)
      .then(res => {
        console.log(res.data);
        this.setState({
          firstName: '',
          lastName: '',
          employeeId: ''
        })
        this.props.setShowEdit(false);
      });
  }
  componentDidUpdate(prevProps) {
    if (this.props.selectedRow.id !== prevProps.selectedRow.id) {
      this.setState({
        ...this.props.selectedRow
      });
    }
  }

  render() {
    return (
      <div style={{ marginTop: 10 }} className="container">
        <h3>EditUserPage</h3>
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
            <button className="btn btn-primary m-2">Update</button>
            <button className="btn btn-danger m-2" onClick={() => this.props.setShowEdit(false)}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }
}
export default EditUserPage;
