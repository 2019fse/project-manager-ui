import React, {Component} from 'react';
import AddProjectPage from './AddProjectPage';
import EditProjectPage from './EditProjectPage';
import ProjectList from './ProjectList';
import { PROJECT_SERVICE_URL } from '../common/Config';
import axios from 'axios';
import {NotificationManager} from 'react-notifications';
class ProjectPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_edit: false,
            selected_row: {},
            rows: []
        }
    }

    setShowEdit = (show_edit, selected_row) => {
        this.setState({
            show_edit: show_edit
        });
        if(selected_row) {
            this.setState({
                selected_row: {
                    ...selected_row, 
                    startDate: selected_row.startDate == null ? null : this.getDate(`${selected_row.startDate}`),
                    endDate: selected_row.endDate == null ? null : this.getDate(`${selected_row.endDate}`),
                }
            });
        }
        this.getLatestRows();
    }
    getDate(dateStr) {
        var dateArray = dateStr.split("-");
        return new Date(`${dateArray[1]}/${dateArray[2]}/${dateArray[0]}`);
    }
    deleteRow = (id) => {
        axios.delete(`${PROJECT_SERVICE_URL}${id}`)
            .then(response => {
                NotificationManager.success(`Project ${id} suspended sucessfully`);
                this.getLatestRows();

            })
            .catch(function (error) {
                NotificationManager.error(`Error in suspending project`);
            })
    }

    componentDidMount() {
        this.getLatestRows();
    }
    getLatestRows() {
        axios.get(PROJECT_SERVICE_URL)
            .then(response => {
                this.setState({ rows: response.data });
            })
            .catch(function (error) {
                NotificationManager.error(`Error in geting project list`);
            })
    }
    render() {
        return (
            <div>
                {this.state.show_edit && <EditProjectPage setShowEdit={this.setShowEdit} selectedRow={this.state.selected_row} />}
                {!this.state.show_edit && <AddProjectPage setShowEdit={this.setShowEdit} />}
                <ProjectList setShowEdit={this.setShowEdit} deleteRow={this.deleteRow} rows={this.state.rows} />
            </div>
        );
    }
}
export default ProjectPage;