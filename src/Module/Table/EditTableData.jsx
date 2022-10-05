import { useState } from "react";
import { Button, Form, Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";
import moment from "moment";

const EditData = ({ selectedRowKeys, onEdit, editData, editModalTitle }) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);

    const onEdited = (values) => {
        onEdit(values, selectedRowKeys);
        setVisible(false);
    };

    const onCancel = () => {
        setVisible(false);
    };

    const initialData = selectedRowKeys.incomeTime
        ? {
              ...selectedRowKeys,
              incomeTime: selectedRowKeys.incomeTime.substr(0, 10),
          }
        : selectedRowKeys.reportTime
        ? {
              ...selectedRowKeys,
              reportTime: selectedRowKeys.reportTime.substr(0, 10),
          }
        : selectedRowKeys.outgoingTime
        ? {
              ...selectedRowKeys,
              outgoingTime: moment(selectedRowKeys.outgoingTime)
                  .toISOString()
                  .substr(0, 10),
          }
        : { ...selectedRowKeys };

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
                onOk={() => {
                    form.validateFields()
                        .then((values) => {
                            form?.resetFields();
                            onEdited(values);
                        })
                        .catch((info) => {
                            console.error("Validate Failed:", info);
                        });
                }}
            >
                <Form form={form} layout="vertical" name="form_in_modal">
                    {editData?.map((data) => {
                        let valuePropName =
                            data.name === "debt"
                                ? { name: data.name, valuePropName: data.name }
                                : { name: data.name };
                        return (
                            <Form.Item
                                key={data.name}
                                label={data.label}
                                rules={[
                                    {
                                        required: true,
                                        message: `${data.label}ni kiriting`,
                                    },
                                ]}
                                {...valuePropName}
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
