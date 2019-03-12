import React, {Component} from 'react';
import InputRange from 'react-input-range';
import DatePicker from "react-datepicker";
import Select from 'react-select';
class AddTaskPage extends Component {
  render() {
    return (
      
      <div style={{ marginTop: 10 }} className="container">
        <h3>Add Task</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Project:  </label>
            <input
              type="text"
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Task:  </label>
            <input
              type="text"
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <input type="checkbox"/>
            <label>Parent Task</label>
          </div>
          <div className="form-group">
            <label>Priority: </label>
            <InputRange 
              maxValue={30}
              minValue={0}
              name="priority"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Parent Task:  </label>
            <input
              type="text"
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <input type="checkbox" />
            <label>Set Start and End Date: </label>
            
            <div>
            <DatePicker
              placeholderText="Start date"
              dateFormat="yyyy-MM-dd"
              className="form-control"
            />
            <DatePicker
              placeholderText="End date"
              dateFormat="yyyy-MM-dd"
              className="form-control"
            />
            </div>
          </div>

          <div className="form-group">
            <label>User: </label>
            <Select
              required = {true}
              isClearable = {true}
              placeholder="Search and Select a user.."
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
export default AddTaskPage;
