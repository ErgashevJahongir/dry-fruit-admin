import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Checkbox, Form, Input, notification } from "antd";
import useToken from "../Hook/UseToken";
import Loading from "../Components/Loading";
import "./Login.css";
import rasm from "./loginPicture.jpg";
import { FrownOutlined } from "@ant-design/icons";

const Login = ({ setUser }) => {
    const [loading, setLoading] = useState(false);
    const { token, setToken } = useToken();
    let navigate = useNavigate();

    const getUser = (token) => {
        axios
            .get(
                "https://app-dry-fruits.herokuapp.com/api/dry/fruit/api/dry/fruit/user",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            .then((data) => {
                setUser(data.data.data);
                navigate("/", { replace: true });
                window.location.href = "/";
            })
            .catch((err) => {
                console.error(err);
                navigate("/login");
            })
            .finally(() => setLoading(false));
    };

    const onFinish = (values) => {
        setLoading(true);
        console.log(values);
        axios
            .post(
                "https://app-dry-fruits.herokuapp.com/api/dry/fruit/auth/login",
                {
                    password: values.password,
                    phoneNumber: values.phoneNumber,
                }
            )
            .then((data) => {
                getUser(data.data.data);
                setToken(data.data.data, values.remember);
            })
            .catch((err) => {
                notification["error"]({
                    message: "Kirishda xatolik",
                    description:
                        "Telefon nomer yoki parolni noto'g'ri kiritdingiz.",
                    duration: 3,
                    icon: <FrownOutlined style={{ color: "#f00" }} />,
                });
                setLoading(false);
                console.error(err);
                navigate("/login");
            });
    };

    const onFinishFailed = (errorInfo) => {
        setLoading(false);
        console.log(errorInfo);
    };

    useEffect(() => {
        if (token) {
            navigate("/");
        }
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="login-page">
            <div className="login-box">
                <div className="illustration-wrapper">
                    <img src={rasm} alt="Login" />
                </div>
                <Form
                    name="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <p className="form-title">Xush Kelibsiz</p>
                    <p>Sahifaga kirish</p>
                    <Form.Item
                        name="phoneNumber"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Iltimos telefon nomeringizni kiriting!",
                            },
                        ]}
                    >
                        <Input placeholder="Telefon nomeringizni kiriting" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Iltimos Parolingizni kiriting!",
                            },
                        ]}
                    >
                        <Input.Password placeholder="Parolingizni kiriting" />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>Meni eslab qol</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                        >
                            KIRISH
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;
