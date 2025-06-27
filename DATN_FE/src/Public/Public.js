import React from 'react';
import {Route, Routes} from 'react-router-dom';

/* Auth Page */
import Login from './Components/Account/Login/Login';
import Register from './Components/Account/Register/Register';
import ForgotPassword from "./Components/Account/ForgotPassword/ForgotPassword";
import ChangePassword from "./Components/Account/ForgotPassword/ChangePassword";

/* Main Page */
import Home from './Components/Home/Home';
/* User Page */
import Profile from './Components/Profile/Profile';
import NotFound from "./Components/Shared/Error/Error404";
import ComingSoon from "./Components/Shared/ComingSoon/ComingSoon";

/* Admin Page */
import Dashboard from './Components/AdminApp/Dashboard/Dashboard';
/* Admin User */
import ListUser from './Components/AdminApp/Users/ListUser/ListUser';
import CreateUser from './Components/AdminApp/Users/CreateUser/CreateUser';
import UpdateUser from './Components/AdminApp/Users/UpdateUser/UpdateUser';

/**
 * This component renders the routes for the public part of the application.
 * It includes the auth pages, the error pages, the client pages, the client auth pages, and the admin pages.
 * The admin pages are protected by authentication.
 * @returns {JSX.Element} The public routes.
 */
function Public() {
    return (
        <div>
            <Routes>
                {/* Auth Page */}
                <Route path='/login' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/forgot-password' element={<ForgotPassword/>}/>
                <Route path='/change-password' element={<ChangePassword/>}/>
                {/* Error Page */}
                <Route path='/not-found' element={<NotFound/>}/>
                <Route path='/coming-soon' element={<ComingSoon/>}/>
                {/* Client Page */}
                <Route path='/' element={<Home/>}/>
                {/* Client Auth Page */}
                <Route path='/profile' element={<Profile/>}/>
                <Route path='/admin/dashboard' element={<Dashboard/>}/>
                {/* Admin Users */}
                <Route path='/admin/users/list' element={<ListUser/>}/>
                <Route path='/admin/users/create' element={<CreateUser/>}/>
                <Route path='/admin/users/detail/:id' element={<UpdateUser/>}/>``
            </Routes>
        </div>
    )
}

export default Public
