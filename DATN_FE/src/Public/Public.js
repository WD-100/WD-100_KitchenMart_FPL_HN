import React from "react";
import { Route, Routes } from "react-router-dom";

/* Auth Page */
import Login from "./Components/Account/Login/Login";
import Register from "./Components/Account/Register/Register";
import ForgotPassword from "./Components/Account/ForgotPassword/ForgotPassword";
import ChangePassword from "./Components/Account/ForgotPassword/ChangePassword";

/* Main Page */
import Home from "./Components/Home/Home";
import Contact from "./Components/Contact/Contact";
import About from "./Components/AboutUs/About";
import ProductList from "./Components/Shop/ProductList/ProductList";
import ProductDetail from "./Components/Shop/ProductDetail/ProductDetail";
import Result from "./Components/Shop/Result/Result";

import Checkout from "./Components/Checkout/Checkout";

import Coupons from "./Components/Coupons/Coupons";
/* User Page */
import Profile from "./Components/Profile/Profile";

/* Error Page */
import NotFound from "./Components/Shared/Error/Error404";
import ComingSoon from "./Components/Shared/ComingSoon/ComingSoon";

/* Admin Page */
import Dashboard from "./Components/AdminApp/Dashboard/Dashboard";
/* Admin Category */
import ListCategory from "./Components/AdminApp/Category/ListCategory/ListCategory";
import CreateCategory from "./Components/AdminApp/Category/CreateCategory/CreateCategory";
import DetailCategory from "./Components/AdminApp/Category/DetailCategory/DetailCategory";
import UpdateCategory from "./Components/AdminApp/Category/UpdateCategory/UpdateCategory";
/* Admin Product */
import ListProduct from "./Components/AdminApp/Product/ListProduct/ListProduct";
import CreateProduct from "./Components/AdminApp/Product/CreateProduct/CreateProduct";
import DetailProduct from "./Components/AdminApp/Product/DetailProduct/DetailProduct";
import UpdateProduct from "./Components/AdminApp/Product/UpdateProduct/UpdateProduct";

/* Admin User */
import ListUser from "./Components/AdminApp/Users/ListUser/ListUser";
import CreateUser from "./Components/AdminApp/Users/CreateUser/CreateUser";
import UpdateUser from "./Components/AdminApp/Users/UpdateUser/UpdateUser";
/* Admin Coupons */
import ListCoupon from "./Components/AdminApp/Coupons/ListCoupon/ListCoupon";
import CreateCoupon from "./Components/AdminApp/Coupons/CreateCoupon/CreateCoupon";
import DetailCoupon from "./Components/AdminApp/Coupons/DetailCoupon/DetailCoupon";

/* Admin Contacts */
import ListContact from "./Components/AdminApp/Contacts/ListContact/ListContact";
import DetailContact from "./Components/AdminApp/Contacts/DetailContact/DetailContact";

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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        {/* Error Page */}
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        {/* Client Page */}
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/products/search" element={<Result />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/coupons" element={<Coupons />} />
        {/* Client Auth Page */}
        <Route path="/profile" element={<Profile />} />

        {/* Admin Page */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        {/* Admin Category */}
        <Route path="/admin/categories/list" element={<ListCategory />} />
        <Route path="/admin/categories/create" element={<CreateCategory />} />
        <Route
          path="/admin/categories/detail/:id"
          element={<DetailCategory />}
        />
        <Route
          path="/admin/categories/update/:id"
          element={<UpdateCategory />}
        />
        {/* Admin Products */}
        <Route path="/admin/products/list" element={<ListProduct />} />
        <Route path="/admin/products/create" element={<CreateProduct />} />
        <Route path="/admin/products/detail/:id" element={<DetailProduct />} />
        <Route path="/admin/products/update/:id" element={<UpdateProduct />} />

        {/* Admin Users */}
        <Route path="/admin/users/list" element={<ListUser />} />
        <Route path="/admin/users/create" element={<CreateUser />} />
        <Route path="/admin/users/detail/:id" element={<UpdateUser />} />
        {/* Admin Coupons */}
        <Route path="/admin/coupons/list" element={<ListCoupon />} />
        <Route path="/admin/coupons/create" element={<CreateCoupon />} />
        <Route path="/admin/coupons/detail/:id" element={<DetailCoupon />} />

        {/* Admin Coupons */}
        <Route path="/admin/contacts/list" element={<ListContact />} />
        <Route path="/admin/contacts/detail/:id" element={<DetailContact />} />
      </Routes>
    </div>
  );
}

export default Public;
