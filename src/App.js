import React, { Component } from 'react';
import { NavLink, Route } from 'react-router-dom';
import ProjectPage from './components/project/ProjectPage';
import AddTaskPage from './components/task/AddTaskPage';
import ViewTaskPage from './components/task/VewTaskPage';
import UserPage from './components/user/UserPage';
import NavButton from './components/common/NavButton';
import {NotificationContainer} from 'react-notifications';
class App extends Component {
  render() {
    return (
      <div className="container">
          <nav className="navbar navbar-light navbar-expand-sm">
          <ul className="nav navbar-nav">
            <li className="nav-item"><NavLink to="/adduser"><NavButton>Add User</NavButton></NavLink></li>
            <li className="nav-item"><NavLink to="/addproject"><NavButton>Add Project</NavButton></NavLink></li>
            <li className="nav-item"><NavLink to="/addtask"><NavButton>Add Task</NavButton></NavLink></li>
            <li className="nav-item"><NavLink to="/viewtask"><NavButton>View Task</NavButton></NavLink></li>
          </ul>
         </nav>
        <Route path="/" exact={true} component={UserPage}/>
        <Route path="/adduser" component={UserPage}/>
        <Route path="/addproject" component={ProjectPage}/>
        <Route path="/addtask" component={AddTaskPage}/>
        <Route path="/viewtask" component={ViewTaskPage}/>
        <NotificationContainer/>
      </div>
    );
  }
}

export default App;
