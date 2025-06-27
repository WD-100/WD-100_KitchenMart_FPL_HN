import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Login.scss"
import { Button, Form, Input, message } from 'antd';
import accountService from '../../Service/AccountService';


function Login() {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        let data = {
            username: values.username,
            password: values.password
        }
        await accountService.loginAccount(data)
            .then((res) => {
                console.log("login", res.data)
                sessionStorage.setItem("accessToken", res.data.token);
                sessionStorage.setItem("id", res.data.id);
                sessionStorage.setItem("username", res.data.username);
                message.success(`Welcome ${res.data.username} !`)
                navigate("/")
            })
            .catch((err) => {
                console.log(err)
                message.error("Please check account!")
            })
    };

    return (
        <div id='login-form'>
            <>
                <link
                    rel="stylesheet"
                    integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"
                    crossOrigin="anonymous"
                />
                <section className="login">
                    <div className="login_box">
                        <div className="left">
                            <div className="top_link">
                                <Link to="/">
                                    <img
                                        src="https://drive.google.com/u/0/uc?id=16U__U5dJdaTfNGobB_OpwAJ73vM50rPV&export=download"
                                        alt=""
                                    />
                                    Return home
                                </Link>
                            </div>
                            <div className="contact">
                                <Form onFinish={onFinish}
                                    autoComplete="off"
                                >
                                    <h3>SIGN IN</h3>
                                    <div>
                                        <label>Username</label>
                                        <Form.Item
                                            name="username"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your username!',
                                                }
                                            ]}
                                            hasFeedback
                                        >
                                            <Input allowClear style={{ width: "120%", height: "40px" }} />
                                        </Form.Item>
                                    </div>
                                    <div>
                                        <label>Password</label>
                                        <Form.Item
                                            name="password"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your password!',
                                                }
                                            ]}
                                        >
                                            <Input.Password allowClear style={{ width: "120%", height: "40px" }} />
                                        </Form.Item>
                                    </div>
                                    <Button type="primary" htmlType='submit' >SUBMIT</Button>
                                    <div style={{ marginTop: "20px" }}>
                                        <Link to="/register" >
                                            You don't have account? Register
                                        </Link>
                                    </div>
                                </Form>
                            </div>
                        </div>
                        <div className="right">
                            <div className="right-text">
                                <h2>LONYX</h2>
                                <h5>A UX BASED CREATIVE AGENCEY</h5>
                            </div>
                            <div className="right-inductor">
                                <img
                                    src="https://lh3.googleusercontent.com/fife/ABSRlIoGiXn2r0SBm7bjFHea6iCUOyY0N2SrvhNUT-orJfyGNRSMO2vfqar3R-xs5Z4xbeqYwrEMq2FXKGXm-l_H6QAlwCBk9uceKBfG-FjacfftM0WM_aoUC_oxRSXXYspQE3tCMHGvMBlb2K1NAdU6qWv3VAQAPdCo8VwTgdnyWv08CmeZ8hX_6Ty8FzetXYKnfXb0CTEFQOVF4p3R58LksVUd73FU6564OsrJt918LPEwqIPAPQ4dMgiH73sgLXnDndUDCdLSDHMSirr4uUaqbiWQq-X1SNdkh-3jzjhW4keeNt1TgQHSrzW3maYO3ryueQzYoMEhts8MP8HH5gs2NkCar9cr_guunglU7Zqaede4cLFhsCZWBLVHY4cKHgk8SzfH_0Rn3St2AQen9MaiT38L5QXsaq6zFMuGiT8M2Md50eS0JdRTdlWLJApbgAUqI3zltUXce-MaCrDtp_UiI6x3IR4fEZiCo0XDyoAesFjXZg9cIuSsLTiKkSAGzzledJU3crgSHjAIycQN2PH2_dBIa3ibAJLphqq6zLh0qiQn_dHh83ru2y7MgxRU85ithgjdIk3PgplREbW9_PLv5j9juYc1WXFNW9ML80UlTaC9D2rP3i80zESJJY56faKsA5GVCIFiUtc3EewSM_C0bkJSMiobIWiXFz7pMcadgZlweUdjBcjvaepHBe8wou0ZtDM9TKom0hs_nx_AKy0dnXGNWI1qftTjAg=w1920-h979-ft"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </>

        </div>
    )
}

export default Login
