import { Button, Col, Form, Input, message, Row, Space } from "antd";
import { useEffect, useState } from "react";
import CustomSelect from "../Module/Select/Select";
import Loading from "../Components/Loading";
import { useData } from "../Hook/UseData";
import instance from "../Api/Axios";

const Profil = () => {
    const [loading, setLoading] = useState(true);
    const [limit, setLimit] = useState(null);
    const [formLimit] = Form.useForm();
    const [form] = Form.useForm();
    const { user, getUserData, branchData, roleData } = useData();

    const getLimit = () => {
        instance
            .get("api/dry/fruit/limit")
            .then((data) => setLimit(data.data.data))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        setLoading(false);
        getLimit();
    }, []);

    const changeLimit = (values) => {
        instance
            .put(`api/dry/fruit/limit?limit=${values.limit}`)
            .then((data) => {
                getLimit();
                setLimit(values);
                message.success("Limit muvofaqiyatli taxrirlandi");
            })
            .catch((err) => {
                console.error(err);
                message.error("Limitni taxrirlashda muammo bo'ldi");
            });
    };

    const update = () => {
        formLimit
            .validateFields()
            .then((values) => {
                changeLimit(values);
                formLimit.resetFields();
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
                setLoading(false);
            });
    };

    const onReset = () => {
        form.resetFields();
    };

    const onFill = (user) => {
        form.setFieldsValue({
            fio: user.fio,
            phoneNumber: user.phoneNumber,
            branchId: user.branchId,
            roleId: user.roleId,
        });
    };

    const onOk = () => {
        form.validateFields()
            .then((values) => {
                Object.keys(values).forEach(
                    (key) => values[key] === undefined && delete values[key]
                );
                setLoading(true);
                const bothFieldsAreFilled =
                    values.password && values.passwordRetry;
                const passwordsMatch =
                    values?.password === values?.passwordRetry;
                if (bothFieldsAreFilled) {
                    if (passwordsMatch) {
                        onUpdate(values);
                        form.resetFields();
                    } else {
                        setLoading(false);
                    }
                } else {
                    onUpdate(values);
                    form.resetFields();
                }
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
                setLoading(false);
            });
    };

    const onUpdate = (values) => {
        delete values.passwordRetry;
        instance
            .put(`api/dry/fruit/api/dry/fruit/user/update${user.id}`, {
                ...values,
            })
            .then(function (response) {
                getUserData();
                message.success("Foydalanuvchi muvofaqiyatli taxrirlandi");
            })
            .catch(function (error) {
                console.error(error);
                message.error("Foydalanuvchini taxrirlashda muammo bo'ldi");
            })
            .finally(() => setLoading(false));
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            {user?.roleId === 1 ? (
                <div>
                    <h4>Qancha qarz bera olish mumkinligini belgilang</h4>
                    <Form form={formLimit} layout="vertical">
                        <Form.Item
                            name="limit"
                            label={`Hozirda limit ${limit} tenge`}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 6 }}
                        >
                            <Input placeholder="Limitni kiriting" />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                onClick={update}
                                style={{ width: 120 }}
                            >
                                O'zgartirish
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            ) : null}
            <h3 style={{ marginTop: "20px" }}>Profil</h3>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 15,
                }}
            >
                <h4>Profil malumotlarini o'zgartirish</h4>
            </div>
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="fio" label="Foydalanuvchi ismi">
                            <Input placeholder="Foydalanuvchi ismini kiriting" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="phoneNumber"
                            label="Foydalanuvchi nomeri"
                        >
                            <Input placeholder="Foydalanuvchi nomeri kiriting" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="branchId" label="Ishlash filiali">
                            <CustomSelect
                                placeholder={"Ishlash filiali"}
                                backValue={"id"}
                                selectData={branchData}
                                DValue={user.branchId}
                                disabled={true}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="roleId" label="Roleni kiriting">
                            <CustomSelect
                                placeholder={"Roleni tanlang"}
                                backValue={"id"}
                                selectData={roleData}
                                DValue={user.roleId}
                                disabled={true}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="password" label="Parol" hasFeedback>
                            <Input.Password placeholder="Parolni kiriting" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="passwordRetry"
                            label="Parolni qaytadan kiriting"
                            hasFeedback
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (
                                            !value ||
                                            getFieldValue("password") === value
                                        ) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error(
                                                "Parolni noto'g'ri kiritayapsiz"
                                            )
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Parolni qaytadan kiriting" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16} justify="center">
                    <Col span={24}>
                        <Form.Item>
                            <Space className="profil-buttons" size="middle">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={onOk}
                                    style={{ width: 120 }}
                                >
                                    O'zgartirish
                                </Button>
                                <Button
                                    htmlType="button"
                                    onClick={onReset}
                                    style={{ width: 120 }}
                                >
                                    Tozalash
                                </Button>
                                <Button
                                    htmlType="button"
                                    onClick={() => onFill(user)}
                                    style={{ width: 120 }}
                                >
                                    To'ldirish
                                </Button>
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default Profil;
