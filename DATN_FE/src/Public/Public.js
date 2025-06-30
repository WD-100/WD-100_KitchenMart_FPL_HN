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
/* My Order */
import ListMyOrder from './Components/Profile/MyOrder/ListOrder/ListOrder';
import DetailMyOrder from './Components/Profile/MyOrder/DetailOrder/DetailOrder';
/* My Coupon */
import ListMyCoupon from './Components/Profile/MyCoupons/ListCoupon/ListCoupon';
/* Error Page */
import NotFound from "./Components/Shared/Error/Error404";
import ComingSoon from "./Components/Shared/ComingSoon/ComingSoon";

/* Admin Page */
import Dashboard from './Components/AdminApp/Dashboard/Dashboard';
/* Admin Category */
import ListCategory from './Components/AdminApp/Category/ListCategory/ListCategory';
import CreateCategory from './Components/AdminApp/Category/CreateCategory/CreateCategory';
import DetailCategory from './Components/AdminApp/Category/DetailCategory/DetailCategory';
import UpdateCategory from './Components/AdminApp/Category/UpdateCategory/UpdateCategory';
/* Admin Product */
import ListProduct from './Components/AdminApp/Product/ListProduct/ListProduct';
import CreateProduct from './Components/AdminApp/Product/CreateProduct/CreateProduct';
import DetailProduct from './Components/AdminApp/Product/DetailProduct/DetailProduct';
import UpdateProduct from "./Components/AdminApp/Product/UpdateProduct/UpdateProduct";
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
                {/* Admin Page */}
                <Route path='/admin/dashboard' element={<Dashboard/>}/>
                {/* Admin Category */}
                <Route path='/admin/categories/list' element={<ListCategory/>}/>
                <Route path='/admin/categories/create' element={<CreateCategory/>}/>
                <Route path='/admin/categories/detail/:id' element={<DetailCategory/>}/>
                <Route path='/admin/categories/update/:id' element={<UpdateCategory/>}/>
                {/* Admin Products */}
                <Route path='/admin/products/list' element={<ListProduct/>}/>
                <Route path='/admin/products/create' element={<CreateProduct/>}/>
                <Route path='/admin/products/detail/:id' element={<DetailProduct/>}/>
                <Route path='/admin/products/update/:id' element={<UpdateProduct/>}/>
                {/* Admin Users */}
                <Route path='/admin/users/list' element={<ListUser/>}/>
                <Route path='/admin/users/create' element={<CreateUser/>}/>
                <Route path='/admin/users/detail/:id' element={<UpdateUser/>}/>
            </Routes>
        </div>
    )
}

export default Public
