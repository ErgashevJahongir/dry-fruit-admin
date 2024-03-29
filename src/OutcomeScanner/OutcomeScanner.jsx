import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import {
    Button,
    Col,
    Drawer,
    Input,
    InputNumber,
    List,
    message,
    Row,
    Space,
    Table,
    Tabs,
} from "antd";
import {
    CreditCardOutlined,
    DeleteOutlined,
    DollarOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import instance from "../Api/Axios";
import { useNavigate } from "react-router-dom";
import { useData } from "../Hook/UseData";
import { ComponentToPrint } from "./ComponentToPrint";
import EditDataCustome from "./CustonEditTableData";
import { useSidebar } from "../Hook/UseSidebar";

const OutcomeScanner = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([[], []]);
    const [totalInputValue, setTotalInputValue] = useState(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [searchInputRef, setSearchInputRef] = useState(true);
    const [text, setText] = React.useState("old boring text");
    const componentRef = React.useRef(null);
    const { tableData, setTableData } = useSidebar();
    const navigate = useNavigate();
    const { user } = useData();

    const reactToPrintContent = React.useCallback(() => {
        return componentRef.current;
    }, [componentRef.current]);

    const handleAfterPrint = React.useCallback(() => {}, []);

    const handleBeforePrint = React.useCallback(() => {}, []);

    const onBeforeGetContentResolve = React.useRef(null);

    const handleOnBeforeGetContent = React.useCallback(() => {
        setText("Loading new text...");

        return new Promise((resolve) => {
            onBeforeGetContentResolve.current = resolve;

            setTimeout(() => {
                setText("New, Updated Text!");
                resolve();
            }, 2000);
        });
    }, [setText]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: "AwesomeFileName",
        onBeforeGetContent: handleOnBeforeGetContent,
        onBeforePrint: handleBeforePrint,
        onAfterPrint: handleAfterPrint,
        removeAfterPrint: true,
    });

    function Posts({ url, placeholder }) {
        const [filteredResults, setFilteredResults] = useState(null);
        const [initLoading, setInitLoading] = useState(false);

        const searchItems = (searchValue) => {
            setInitLoading(true);
            if (searchValue !== "") {
                instance
                    .get(`${url}${searchValue}`)
                    .then((data) => {
                        data.data.data.id && data.data.data[0] === undefined
                            ? setFilteredResults([
                                  {
                                      id: data.data.data.id,
                                      name: data.data.data.name,
                                      amount: data.data.data?.amount
                                          ? data.data.data?.amount
                                          : 1,
                                      productPrice:
                                          data.data.data?.outcomePrice,
                                      measurment: data.data.data?.amount
                                          ? "kg"
                                          : "шт",
                                      measurementId: data.data.data?.amount
                                          ? 1
                                          : 4,
                                      productTotalPrice:
                                          (data.data.data?.amount
                                              ? data.data.data?.amount
                                              : 1) *
                                          data.data.data?.outcomePrice,
                                  },
                              ])
                            : data.data.data[0] !== undefined
                            ? setFilteredResults(
                                  data.data.data.map((item) => {
                                      return {
                                          id: item.id,
                                          key: item.id,
                                          name: item.name,
                                          amount: item?.amount
                                              ? item?.amount
                                              : 1,
                                          productPrice: item?.outcomePrice,
                                          measurment: item?.amount
                                              ? "kg"
                                              : "шт",
                                          measurementId: item?.amount ? 1 : 4,
                                          productTotalPrice:
                                              (item?.amount
                                                  ? item?.amount
                                                  : 1) * item?.outcomePrice,
                                      };
                                  })
                              )
                            : setFilteredResults(null);
                    })
                    .finally(() => {
                        setInitLoading(false);
                    });
            } else {
                setFilteredResults(null);
                setInitLoading(false);
            }
        };

        return (
            <div style={{ position: "relative" }}>
                <Input
                    style={{ padding: 10, marginBottom: "20px" }}
                    icon={<SearchOutlined />}
                    placeholder={placeholder}
                    onChange={(e) => {
                        searchItems(e.target.value);
                    }}
                    autoFocus={searchInputRef}
                />
                {filteredResults !== null ? (
                    <List
                        className="demo-loadmore-list"
                        style={{
                            position: "absolute",
                            zIndex: 3,
                            width: "100%",
                            backgroundColor: "#fff",
                        }}
                        bordered
                        loading={initLoading}
                        itemLayout="horizontal"
                        dataSource={filteredResults}
                        renderItem={(field) => {
                            return (
                                <List.Item
                                    style={{ padding: "10px 30px" }}
                                    onClick={() =>
                                        setTableData((prev) => {
                                            const product = prev.filter(
                                                (data) => data.id === field.id
                                            );
                                            if (product[0]) {
                                                return prev.map((item) => {
                                                    setSearchInputRef(true);
                                                    return item.id ===
                                                        product[0].id
                                                        ? {
                                                              ...item,
                                                              key: item.id,
                                                              amount:
                                                                  item.amount +
                                                                  field.amount,
                                                              productTotalPrice:
                                                                  (item.amount +
                                                                      field.amount) *
                                                                  item.productPrice,
                                                          }
                                                        : {
                                                              ...item,
                                                              key: item.id,
                                                          };
                                                });
                                            } else {
                                                setSearchInputRef(true);
                                                return [...prev, field];
                                            }
                                        })
                                    }
                                >
                                    <List.Item.Meta title={field?.name} />
                                    <div>{field?.productPrice}</div>
                                </List.Item>
                            );
                        }}
                    />
                ) : null}
            </div>
        );
    }

    React.useEffect(() => {
        if (
            text === "New, Updated Text!" &&
            typeof onBeforeGetContentResolve.current === "function"
        ) {
            onBeforeGetContentResolve.current();
        }
    }, [onBeforeGetContentResolve.current, text]);

    const onSelectChange = (selectedRowKeys, record) => {
        setSelectedRowKeys([[...selectedRowKeys], [...record]]);
    };

    const handleSelect = (record) => {
        if (!selectedRowKeys[0].includes(record.id)) {
            setSelectedRowKeys((prev) => [
                [...prev[0], record.id],
                [...prev[1], record],
            ]);
        } else {
            setSelectedRowKeys((prev) => {
                const arr = prev[0].filter((key) => key !== record.id);
                const arr1 = prev[1].filter((key) => key.id !== record.id);
                return [[...arr], [...arr1]];
            });
        }
    };

    const rowSelection = {
        selectedRowKeys: selectedRowKeys[0],
        onChange: onSelectChange,
    };

    const onDelete = (arr) => {
        setLoading(true);
        let newTableData = [...tableData];
        arr.map((itemId) => {
            newTableData = [
                ...newTableData.filter((item) => item.id !== itemId),
            ];
            return null;
        });
        setTableData(newTableData);
        setLoading(false);
    };

    const onEdit = (values, initial) => {
        setTableData((prev) => {
            return prev.map((item) => {
                return item.id === initial.id
                    ? {
                          ...initial,
                          productPrice: values.productPrice,
                          amount: values.amount,
                          productTotalPrice:
                              values.amount * values.productPrice,
                      }
                    : item;
            });
        });
    };

    const showLargeDrawer = () => {
        setOpen(true);
        setSearchInputRef(false);
        let totalsumma = 0;
        tableData.map((item) => {
            totalsumma = totalsumma + item.productTotalPrice;
            return null;
        });
        setTotalInputValue(totalsumma);
    };

    const onClose = () => {
        setOpen(false);
        setSearchInputRef(true);
    };

    const onCash = (bol, tableData) => {
        setLoading(true);
        const value = tableData.map((values) => {
            const date = new Date();
            return {
                clientId: "69126c57-d5b2-42da-95e2-d577f27b2a3e",
                measurementId: values.measurementId ? values.measurementId : 4,
                amount: values.amount,
                dryFruitId: values.id,
                price: values.productPrice,
                branchId: user.branchId,
                date,
                cash: bol,
                debt: false,
            };
        });
        tableData[0] !== undefined &&
            instance
                .post("api/dry/fruit/outcomeFruit/createOutcomeList", [
                    ...value,
                ])
                .then(function (response) {
                    message.success(
                        "Sotilgan quruq meva muvaffaqiyatli qo'shildi"
                    );
                    setTableData([]);
                })
                .catch(function (error) {
                    console.error(error);
                    if (error.response?.status === 500)
                        navigate("/server-error");
                    message.error(
                        "Sotilgan quruq mevani qo'shishda muammo bo'ldi"
                    );
                })
                .finally(() => {
                    setLoading(false);
                });
        setLoading(false);
        setOpen(false);
        setSearchInputRef(true);
        setTotalInputValue(null);
    };

    const columns = [
        {
            title: "Mahsulot nomi",
            dataIndex: "name",
            id: "name",
        },
        {
            title: "Miqdori",
            dataIndex: "amount",
            id: "amount",
        },
        {
            title: "O'lchovi",
            dataIndex: "measurment",
            id: "measurment",
        },
        {
            title: "Narxi",
            dataIndex: "productPrice",
            id: "productPrice",
        },
        {
            title: "Jami narxi",
            dataIndex: "productTotalPrice",
            id: "productTotalPrice",
        },
    ];

    const outcomeNakladnoyData = [
        {
            name: "productPrice",
            label: "Quruq meva narxi",
            input: <InputNumber style={{ width: "100%" }} />,
        },
        {
            name: "amount",
            label: "Quruq meva miqdori",
            input: <InputNumber style={{ width: "100%" }} />,
        },
    ];

    return (
        <>
            <Tabs
                defaultActiveKey="1"
                onChange={() => {
                    setSearchInputRef(true);
                }}
                items={[
                    {
                        label: `Bar Code, Kod`,
                        key: "1",
                        children: (
                            <Posts
                                url={"api/dry/fruit/dryFruit/code?code="}
                                placeholder={"BarCode bo'yicha qidirish"}
                            />
                        ),
                    },
                    {
                        label: `Mahsulot`,
                        key: "2",
                        children: (
                            <Posts
                                url={"api/dry/fruit/dryFruit/search?word="}
                                placeholder={"Mahsulot nomi bo'yicha qidirish"}
                            />
                        ),
                    },
                ]}
            />
            <Space style={{ display: "flex", justifyContent: "end" }}>
                {selectedRowKeys[0]?.length === 1 ? (
                    <EditDataCustome
                        selectedRowKeys={{ ...selectedRowKeys[1][0] }}
                        onEdit={onEdit}
                        editData={outcomeNakladnoyData}
                        editModalTitle={"Mahsulotni o'zgartirish"}
                        setSelectedRowKeys={setSelectedRowKeys}
                    />
                ) : null}
                <Button
                    className="add-button"
                    icon={<DeleteOutlined />}
                    type="primary"
                    danger
                    onClick={() => {
                        onDelete(selectedRowKeys[0]);
                        setSelectedRowKeys([[], []]);
                    }}
                >
                    O'chirish
                </Button>
            </Space>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                loading={loading}
                dataSource={tableData}
                rowKey={"id"}
                onRow={(record) => ({
                    onClick: () => {
                        handleSelect(record);
                    },
                })}
                pagination={{
                    showSizeChanger: false,
                }}
            />
            <Row justify="end">
                <Button
                    type="primary"
                    size="large"
                    style={{
                        fontSize: "30px",
                        padding: "20px 50px",
                        height: "85px",
                        marginTop: "20px",
                    }}
                    onClick={showLargeDrawer}
                    disabled={tableData[0] ? false : true}
                >
                    Sotish
                </Button>
            </Row>
            <Drawer
                title={"Quruq meva sotish"}
                placement="right"
                size={"large"}
                onClose={onClose}
                open={open}
                extra={
                    <Space>
                        <Button onClick={onClose}>Bekor qilish</Button>
                        <Button
                            type="primary"
                            onClick={() => {
                                handlePrint();
                                setTimeout(() => onCash(true, tableData), 2000);
                            }}
                        >
                            Naqt pul
                        </Button>
                    </Space>
                }
            >
                <Row align={"middle"} gutter={[16, 16]}>
                    <Col
                        span={24}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "end",
                        }}
                    >
                        <h3>Jami summa: </h3>
                        <h3
                            style={{
                                textAlign: "right",
                                fontSize: "25px",
                                fontWeight: 700,
                            }}
                        >
                            {totalInputValue}
                        </h3>
                    </Col>
                    <Col
                        span={24}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Space size={"large"}>
                            <Button
                                onClick={() => {
                                    handlePrint();
                                    setTimeout(
                                        () => onCash(false, tableData),
                                        2000
                                    );
                                }}
                                icon={<CreditCardOutlined />}
                                style={{
                                    padding: "10px 30px",
                                    height: 60,
                                    fontSize: "18px",
                                }}
                            >
                                Platitik orqali
                            </Button>
                            <Button
                                type="primary"
                                icon={<DollarOutlined />}
                                onClick={() => {
                                    handlePrint();
                                    setTimeout(
                                        () => onCash(true, tableData),
                                        2000
                                    );
                                }}
                                style={{
                                    padding: "10px 30px",
                                    height: 60,
                                    fontSize: "18px",
                                }}
                            >
                                Naqt pul orqali
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Drawer>
            <ComponentToPrint
                ref={componentRef}
                text={text}
                tableData={tableData}
                totalInputValue={totalInputValue}
            />
        </>
    );
};

// const initialItems = [
//     {
//         label: "Tab",
//         children: <App />,
//         key: "0",
//         closable: false,
//     },
// ];

// const OutcomeScanner = () => {
//     const [activeKey, setActiveKey] = useState(initialItems[0].key);
//     const [items, setItems] = useState(initialItems);
//     const newTabIndex = useRef(0);

//     const onChange = (newActiveKey) => {
//         setActiveKey(newActiveKey);
//     };

//     const add = () => {
//         const newActiveKey = `${++newTabIndex.current}`;
//         const newPanes = [...items];
//         newPanes.push({
//             label: `Tab ${newActiveKey}`,
//             children: <App />,
//             key: newActiveKey,
//         });
//         setItems(newPanes);
//         setActiveKey(newActiveKey);
//     };

//     const remove = (targetKey) => {
//         let newActiveKey = activeKey;
//         let lastIndex = -1;
//         items.forEach((item, i) => {
//             if (item.key === targetKey) {
//                 lastIndex = i - 1;
//             }
//         });
//         const newPanes = items.filter((item) => item.key !== targetKey);
//         if (newPanes.length && newActiveKey === targetKey) {
//             if (lastIndex >= 0) {
//                 newActiveKey = newPanes[lastIndex].key;
//             } else {
//                 newActiveKey = newPanes[0].key;
//             }
//         }
//         setItems(newPanes);
//         setActiveKey(newActiveKey);
//     };

//     const onEdit = (targetKey, action) => {
//         if (action === "add") {
//             add();
//         } else {
//             remove(targetKey);
//         }
//     };

//     return (
//         <Tabs
//             type="editable-card"
//             onChange={onChange}
//             activeKey={activeKey}
//             onEdit={onEdit}
//             items={items}
//         />
//     );
// };
export default OutcomeScanner;
