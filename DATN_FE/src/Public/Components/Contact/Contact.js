import React from 'react';
import {Form, message} from 'antd';
import Header from "../Shared/Client/Header/Header";
import Footer from "../Shared/Client/Footer/Footer";
import $ from 'jquery';
import contactService from "../Service/ContactService";

function Contact() {
    const sendContact = async () => {
        $('#btnCreate').prop('disabled', false).text('Đang gửi...');
        let data = {};
        let inputs = $('#formSendContact input, #formSendContact select, #formSendContact textarea');
        for (let i = 0; i < inputs.length; i++) {
            if (!$(inputs[i]).val() && $(inputs[i]).attr('type') !== 'hidden') {
                let text = $(inputs[i]).prev().text();
                message.error(text + ' không được bỏ trống!');
                $('#btnCreate').prop('disabled', false).text('Gửi');
                return false;
            }
            data[$(inputs[i]).attr('id')] = $(inputs[i]).val();
        }

        data['status'] = false;
        await contactService.sendContact(data)
            .then((res) => {
                message.success('Gửi liên hệ thành công!');

                for (let i = 0; i < inputs.length; i++) {
                    $(inputs[i]).val('');
                }

                $('#btnCreate').prop('disabled', false).text('Gửi');
            })
            .catch((err) => {
                $('#btnCreate').prop('disabled', false).text('Gửi');
            })
    }

    return (
        <div className="site-wrap">
            <Header/>
            <div className="bg-light py-3">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 mb-0"><a href="/">Trang chủ</a> <span
                            className="mx-2 mb-0">/</span> <strong className="text-black">Liên hệ</strong></div>
                    </div>
                </div>
            </div>

            <div className="site-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2 className="h3 mb-3 text-black">Liên hệ</h2>
                        </div>
                        <div className="col-md-7">

                            <Form onFinish={sendContact} id="formSendContact">

                                <div className="p-3 p-lg-5 border">
                                    <div className="form-group row">
                                        <div className="col-md-6">
                                            <label htmlFor="first_name" className="text-black">Họ: <span
                                                className="text-danger">*</span></label>
                                            <input type="text" className="form-control" id="first_name"
                                                   name="first_name"/>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="last_name" className="text-black">Tên: <span
                                                className="text-danger">*</span></label>
                                            <input type="text" className="form-control" id="last_name"
                                                   name="last_name"/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-md-12">
                                            <label htmlFor="email" className="text-black">Email <span
                                                className="text-danger">*</span></label>
                                            <input type="email" className="form-control" id="email" name="email"
                                                   placeholder=""/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-md-12">
                                            <label htmlFor="subject" className="text-black">Chủ đề </label>
                                            <input type="text" className="form-control" id="subject"
                                                   name="subject"/>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <div className="col-md-12">
                                            <label htmlFor="message" className="text-black">Nội dung </label>
                                            <textarea name="message" id="message" cols="30" rows="7"
                                                      className="form-control"></textarea>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-lg-12">
                                            <button id="btnCreate" type="submit"
                                                    className="btn btn-primary w-100">Gửi
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </div>
                        <div className="col-md-5 ml-auto">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59579.02806959555!2d105.67003084863282!3d21.045116199999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313455b3f6710da1%3A0x240105831b77a1a2!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEZQVCBQb2x5dGVjaG5pYw!5e0!3m2!1svi!2s!4v1730685358082!5m2!1svi!2s"
                                width="600" height="800" className="border-0" allowFullScreen="" loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"></iframe>

                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>)
}

export default Contact
