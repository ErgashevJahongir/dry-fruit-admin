import { useState } from "react";
import { Button, Form, Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";
import useKeyPress from "../../Hook/UseKeyPress";

const EditData = ({
    selectedRowKeys,
    onEdit,
    editData,
    editModalTitle,
    setSelectedRowKeys,
}) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const enter = useKeyPress("Enter");

    const onEdited = (values) => {
        onEdit(values, selectedRowKeys);
        setVisible(false);
        setSelectedRowKeys([[], []]);
    };

    const onCancel = () => {
        setVisible(false);
    };

    const initialData = { ...selectedRowKeys };

    const formValidate = () => {
        form.validateFields()
            .then((values) => {
                form?.resetFields();
                onEdited(values);
            })
            .catch((info) => {
                console.error("Validate Failed:", info);
            });
    };

    if (enter && visible) {
        formValidate();
    }

    return (
        <div>
            <Button
                type="primary"
                onClick={() => {
                    form.setFieldsValue({ ...initialData });
                    setVisible(true);
                }}
                className="add-button"
                icon={<EditOutlined />}
            >
                O'zgartirish
            </Button>
            <Modal
                visible={visible}
                title={editModalTitle}
                okText="O'zgartirish"
                cancelText="Bekor qilish"
                width={350}
                onCancel={() => {
                    onCancel();
                }}
                onOk={formValidate}
            >
                <Form form={form} layout="vertical" name="form_in_modal">
                    {editData?.map((data) => {
                        return (
                            <Form.Item
                                name={data.name}
                                key={data.name}
                                label={data.label}
                                rules={[
                                    {
                                        required: true,
                                        message: `${data.label}ni kiriting`,
                                    },
                                ]}
                            >
                                {data.hasOwnProperty("input")
                                    ? data.input
                                    : data.inputSelect(
                                          selectedRowKeys[data.name]
                                      )}
                            </Form.Item>
                        );
                    })}
                </Form>
            </Modal>
        </div>
    );
};

export default EditData;
