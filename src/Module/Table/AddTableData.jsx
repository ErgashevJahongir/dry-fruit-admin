import { useState } from "react";
import { Button, Form, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useKeyPress from "../../Hook/UseKeyPress";

const CollectionCreateForm = ({
    visible,
    onCreate,
    onCancel,
    formData,
    modalTitle,
}) => {
    const [form] = Form.useForm();
    const enter = useKeyPress("Enter");

    const formValidate = () => {
        form.validateFields()
            .then((values) => {
                form.resetFields();
                onCreate(values);
            })
            .catch((info) => {
                console.error("Validate Failed:", info);
            });
    };

    if (enter && visible) {
        formValidate();
    }

    return (
        <Modal
            visible={visible}
            title={modalTitle}
            okText="Qo'shish"
            cancelText="Bekor qilish"
            width={350}
            onCancel={() => {
                onCancel();
            }}
            onOk={formValidate}
            forceRender
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{
                    modifier: "public",
                }}
            >
                {formData?.map((data) => {
                    return (
                        <Form.Item
                            key={data.name}
                            name={data.name}
                            label={data.label}
                            rules={[
                                {
                                    required: true,
                                    message: `${data.label}ni kiriting`,
                                },
                            ]}
                        >
                            {data.input}
                        </Form.Item>
                    );
                })}
            </Form>
        </Modal>
    );
};

const AddData = ({ onCreate, formData, modalTitle }) => {
    const [visible, setVisible] = useState(false);

    const onCreatee = (values) => {
        onCreate(values);
        setVisible(false);
    };

    return (
        <div>
            <Button
                type="primary"
                onClick={() => {
                    setVisible(true);
                }}
                className="add-button"
                id={"addData"}
                icon={<PlusOutlined />}
            >
                Qo'shish
            </Button>
            <CollectionCreateForm
                formData={formData}
                modalTitle={modalTitle}
                visible={visible}
                onCreate={onCreatee}
                onCancel={() => {
                    setVisible(false);
                }}
            />
        </div>
    );
};

export default AddData;
