import React, {Component} from 'react';
import AddUserPage from './AddUserPage';
import EditUserPage from './EditUserPage';
import UserList from './UserList';
import { SERVER_URL } from '../common/Config';
import axios from 'axios';
class UserPage extends Component {
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
            show_edit: show_edit,
            selected_row: selected_row
        });
        this.getLatestRows();
    }

    deleteRow = (id) => {
        axios.delete(SERVER_URL + 'user/' + id)
            .then(response => {
                console.log(response);
                this.getLatestRows()
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    componentDidMount() {
        this.getLatestRows();
    }
    getLatestRows() {
        axios.get(SERVER_URL + 'user')
            .then(response => {
                this.setState({ rows: response.data });
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    render() {
        console.log('UserPage Render Called');
        return (
            <div>
                {this.state.show_edit && <EditUserPage setShowEdit={this.setShowEdit} selectedRow={this.state.selected_row} />}
                {!this.state.show_edit && <AddUserPage setShowEdit={this.setShowEdit} />}
                <UserList setShowEdit={this.setShowEdit} deleteRow={this.deleteRow} rows={this.state.rows} />
            </div>
        );
    }
}
export default UserPage;