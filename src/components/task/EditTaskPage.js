import React, { Component } from 'react';
import Modal from 'react-modal';
import InputRange from 'react-input-range';
import DatePicker from "react-datepicker";
import Select from 'react-select';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import { USER_SERVICE_URL, PARENT_TASK_SERVICE_URL, TASK_SERVICE_URL } from '../common/Config';
class EditTaskPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taskId: null,
            taskName: "",
            parentId: null,
            parentTask: "",
            projectId: null,
            projectName: "",
            priority: 0,
            startDate: null,
            endDate: null,
            userId: null,
            userName: null,
            status: null,
            selectedUser: null,
            selectedParentTask: null,
            userList: [],
            parentTaskList: []
        }
    }
    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
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
    componentDidMount() {
        this.getUserList();
        this.getParentTaskList();
    }
    componentDidUpdate(prevProps) {
        if (this.props.task.taskId !== prevProps.task.taskId) {
            this.setState({
                ...this.props.task,
                selectedUser: this.state.userList.find(user => user.value === this.props.task.userId),
                selectedParentTask: this.state.parentTaskList.find(parentTask => parentTask.value === this.props.task.parentId),
                startDate: this.getDate(this.props.task.startDate),
                endDate: this.getDate(this.props.task.endDate)
            });
        }
    }
    getDate(dateStr) {
        var dateArray = dateStr.split("-");
        return new Date(`${dateArray[1]}/${dateArray[2]}/${dateArray[0]}`);
    }
    onSubmit = (e) => {
        e.preventDefault();

        const request = {
            taskId: this.state.taskId,
            projectId: this.state.projectId,
            parentId: this.state.parentId,
            taskName: this.state.taskName,
            priority: this.state.priority,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            userId: this.state.userId,
            status: this.state.status
        };
        if (!request.projectId) {
            NotificationManager.error(`Project field is required`);
            return;
        }
        if (request.startDate !== null && request.endDate !== null) {
            request.startDate.setHours(0, 0, 0, 0);
            request.endDate.setHours(0, 0, 0, 0);
            if (request.endDate.getTime() < request.startDate.getTime()) {
                NotificationManager.error(`End date cannot be before start date`);
                return;
            }
        }
        if (!request.userId) {
            NotificationManager.error(`User field is required`);
            return;
        }
        axios.put(TASK_SERVICE_URL, request)
            .then(res => {
                NotificationManager.success(`Task ${this.state.taskName} updated sucessfully`);
                this.props.onClose(true);
            });

    }
    render() {
        return (
            <div className="container">
                <Modal isOpen={this.props.showEdit} ariaHideApp={false}>
                    <div style={{ marginTop: 10 }} className="container">
                        <h3>Edit Task</h3>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label>Project:  </label>
                                <input
                                    disabled={true}
                                    type="text"
                                    className="form-control"
                                    value={this.state.projectName}
                                />
                            </div>
                            <div className="form-group">
                                <label>Task:  </label>
                                <input
                                    name="taskName"
                                    type="text"
                                    className="form-control"
                                    defaultValue={this.state.taskName}
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
                                    required={true}
                                />
                            </div>
                            <div className="form-group">
                                <label>Parent Task:  </label>
                                <Select
                                    value={this.state.selectedParentTask}
                                    isClearable={true}
                                    placeholder="Search and Select a Parent task.."
                                    options={this.state.parentTaskList}
                                    isSearchable={true}
                                    onChange={selectedItem => this.setState({ selectedParentTask: selectedItem, parentId: (selectedItem ? selectedItem.value : null) })}
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
                                        onChange={selected => this.setState({ startDate: selected })}
                                        required={true}
                                    />
                                    <DatePicker
                                        placeholderText="End date"
                                        dateFormat="yyyy-MM-dd"
                                        className="form-control"
                                        selected={this.state.endDate}
                                        onChange={selected => this.setState({ endDate: selected })}
                                        required={true}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>User: </label>
                                <Select
                                    value={this.state.selectedUser}
                                    isClearable={true}
                                    placeholder="Search and Select a user.."
                                    options={this.state.userList}
                                    isSearchable={true}
                                    onChange={selectedItem => this.setState({ selectedUser: selectedItem, userId: (selectedItem ? selectedItem.value : null) })}
                                />
                            </div>
                            <div className="form-group">
                                <button value="Add" className="btn btn-primary m-2">Update</button>
                                <button type="button" className="btn btn-danger m-1" onClick={() => this.props.onClose(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        );
    }
}
export default EditTaskPage;