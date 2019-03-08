import React from 'react';
import {Route, IndexRoute} from 'react-router'
import App from 'App';
import AddProjectPage from './components/project/AddProjectPage';
import AddTaskPage from './components/task/AddTaskPage';
import ViewTaskPage from './components/task/ViewTaskPage';
import AddUserPage from './components/user/AddUserPage';

export default (
    <Route path = "/" component = {App}>
        <IndexRoute component = {AddUserPage}/>
        <Route path = "addproject" component = {AddProjectPage}/>
        <Route path = "addtask" component = {AddTaskPage}/>
        <Route path = "viewtask" component = {ViewTaskPage}/>
    </Route>
)