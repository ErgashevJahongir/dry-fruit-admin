import { SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal } from "antd";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import instance from "../Api/Axios";
import { useData } from "../Hook/UseData";
import useKeyPress from "../Hook/UseKeyPress";
import { useSidebar } from "../Hook/UseSidebar";
import CustomSelect from "../Module/Select/Select";
import { Spin } from "antd";

const style = {
    height: 30,
    border: "1px solid green",
    margin: 6,
    padding: 8,
    cursor: "pointer",
};

export default function DataInfinitiScroll() {
    const [data, setData] = useState([]);
    const [current, setCurrent] = useState(0);
    const [totalItems, setTotalItems] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [hasSearch, setHasSearch] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const [selectedDryFruit, setSelectedDryFruit] = useState({});
    const [visible, setVisible] = useState(false);
    const { dryfruitData, measurementData } = useData();
    const { setOutcomeNakladnoyDryFruit, setTotalSum } = useSidebar();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const enter = useKeyPress("Enter");

    const onCreate = (values, initial) => {
        setTotalSum((prev) => prev + values.amount * values.price);
        setOutcomeNakladnoyDryFruit((prev) => {
            const product = prev.filter(
                (data) => data.dryFruitId === initial?.id
            );
            if (product[0]) {
                return prev.map((item) => {
                    return item.dryFruitId === product[0].dryFruitId
                        ? {
                              ...item,
                              amount: item.amount + values.amount,
                          }
                        : item;
                });
            } else {
                return [
                    ...prev,
                    {
                        ...values,
                        id: initial?.id,
                        dryFruitId: initial?.id,
                    },
                ];
            }
        });
    };

    const onEdited = (values) => {
        onCreate(values, selectedDryFruit);
        setVisible(false);
    };

    const onCancel = () => {
        setVisible(false);
    };

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

    const outcomeNakladnoyData = [
        {
            name: "measurementId",
            label: "Quruq meva o'lchovi",
            input: (
                <CustomSelect
                    backValue={"id"}
                    placeholder={"Quruq meva o'lchovi"}
                    selectData={measurementData}
                    DValue={1}
                />
            ),
        },
        {
            name: "price",
            label: "Quruq meva narxi",
            input: <InputNumber style={{ width: "100%" }} />,
        },
        {
            name: "amount",
            label: "Quruq meva miqdori",
            input: <InputNumber style={{ width: "100%" }} />,
        },
    ];

    const fetchMoreData = () => {
        if (totalItems > data.length + 2) {
            getWerehouseDryFruitScroll(current);
        } else {
            setHasMore(false);
        }
    };

    const getWerehouseDryFruit = (current) => {
        instance
            .get(
                `api/dry/fruit/dryFruitWarehouse/getAllPageable?page=${current}&size=20`
            )
            .then((data) => {
                const dataDry = data.data.data?.fuelReports;
                setData(dataDry);
                setTotalItems(data.data.data?.totalItems);
                setCurrent(data.data.data?.currentPage + 1);
            })
            .catch((error) => {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
            });
    };

    const getWerehouseDryFruitScroll = (current) => {
        instance
            .get(
                `api/dry/fruit/dryFruitWarehouse/getAllPageable?page=${current}&size=20`
            )
            .then((data) => {
                const dataDry = data.data.data?.fuelReports;
                setData((prev) => [...prev, ...dataDry]);
                setTotalItems(data.data.data?.totalItems);
                setCurrent(data.data.data?.currentPage + 1);
            })
            .catch((error) => {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
            });
    };

    const searchItems = (searchValue) => {
        setHasSearch(true);
        if (searchValue !== "") {
            instance
                .get(`api/dry/fruit/dryFruit/code?code=${searchValue}`)
                .then((data) => {
                    setSearchData([data.data.data]);
                });
        } else {
            setData([]);
            setHasSearch(false);
        }
    };

    useEffect(() => {
        getWerehouseDryFruit(current);
    }, []);

    return (
        <div>
            <h1 style={{ fontSize: 20, margin: "10px 0 15px" }}>
                Quruq mevalar soni: {totalItems}
            </h1>
            <Input
                style={{ padding: 10, marginBottom: "20px" }}
                icon={<SearchOutlined />}
                placeholder={"Kode bo'yicha qidirish"}
                onChange={(e) => {
                    searchItems(e.target.value);
                }}
            />
            <div>
                {!hasSearch ? (
                    <>
                        <InfiniteScroll
                            dataLength={data.length}
                            hasMore={hasMore}
                            loader={
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Spin />
                                </div>
                            }
                            endMessage={
                                <p style={{ textAlign: "center" }}>
                                    <b>Ombordagi quruq mevalar tugadi!</b>
                                </p>
                            }
                        >
                            {data.map((item, index) => {
                                const dryFruit = dryfruitData.filter(
                                    (data) => data.id === item.dryFruitId
                                );
                                return (
                                    <div
                                        style={style}
                                        key={index}
                                        onClick={() => {
                                            setSelectedDryFruit(dryFruit[0]);
                                            form.setFieldsValue({
                                                dryFruitId: dryFruit[0]?.id,
                                                measurementId: 1,
                                                price: dryFruit[0]
                                                    ?.wholesalePrice,
                                            });
                                            setVisible(true);
                                        }}
                                    >
                                        {index + 1} {dryFruit[0]?.name}
                                    </div>
                                );
                            })}
                        </InfiniteScroll>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Button type={"primary"} onClick={fetchMoreData}>
                                Yana yuklash
                            </Button>
                        </div>
                    </>
                ) : (
                    <div>
                        {searchData.map((qism, index) => {
                            return (
                                <div
                                    style={style}
                                    key={index}
                                    onClick={() => {
                                        setSelectedDryFruit(qism);
                                        form.setFieldsValue({
                                            dryFruitId: qism?.id,
                                            measurementId: 1,
                                            price: qism?.wholesalePrice,
                                        });
                                        setVisible(true);
                                    }}
                                >
                                    {index + 1} {qism?.name}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <Modal
                visible={visible}
                title={"Yangi sotilayotgan meva qo'shish"}
                okText="O'zgartirish"
                okButtonProps={{
                    id: "submitButton",
                    htmlType: "submit",
                }}
                cancelText="Bekor qilish"
                width={350}
                autoFocusButton
                onCancel={() => {
                    onCancel();
                }}
                onOk={form.submit}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    onFinish={formValidate}
                >
                    {outcomeNakladnoyData?.map((data) => {
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
                                {data.input}
                            </Form.Item>
                        );
                    })}
                </Form>
            </Modal>
        </div>
    );
}
