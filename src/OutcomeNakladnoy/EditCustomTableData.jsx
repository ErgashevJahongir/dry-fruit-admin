import { useState } from "react";
import { Button, Form, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useData } from "../Hook/UseData";

const EditDataCustome = ({
    selectedRowKeys,
    onEdit,
    editData,
    editModalTitle,
    setSelectedRowKeys,
    setNakladnoyDryFruitId,
}) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const { dryfruitData } = useData();

    const onEdited = (values) => {
        setNakladnoyDryFruitId("");
        setSelectedRowKeys([[], []]);
        onEdit(values, selectedRowKeys);
        setVisible(false);
    };

    const onCancel = () => {
        setVisible(false);
    };

    const dryFruit = dryfruitData.filter(
        (item) => item.id === selectedRowKeys?.nakladnoyDryFruitId
    );

    const initialData = {
        dryFruitId: dryFruit[0].id,
        measurementId: 1,
        price: dryFruit[0].wholesalePrice,
    };

    return (
        <div>
            <Button
                type="primary"
                onClick={() => {
                    form.setFieldsValue({ ...initialData });
                    setVisible(true);
                }}
                className="add-button"
                icon={<PlusOutlined />}
            >
                Qo'shish
            </Button>
            <Modal
                visible={visible}
                title={editModalTitle}
                okText="Qo'shish"
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

export default EditDataCustome;
