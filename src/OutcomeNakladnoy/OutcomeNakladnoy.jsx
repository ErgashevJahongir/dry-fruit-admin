import { useState, useEffect } from "react";
import instance from "../Api/Axios";
import {
    Button,
    Col,
    DatePicker,
    Drawer,
    InputNumber,
    message,
    Radio,
    Row,
    Space,
    Table,
} from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useData } from "../Hook/UseData";
import CustomSelect from "../Module/Select/Select";
import EditDataCustome from "./EditCustomTableData";
import EditData from "./../Module/Table/EditTableData";
import {
    CreditCardOutlined,
    DollarOutlined,
    DownloadOutlined,
    DeleteOutlined,
} from "@ant-design/icons";

const CustomTable = (props) => {
    const {
        getData,
        tableData,
        columns,
        loading,
        pageSizeOptions,
        onCreate,
        onEdit,
        onDelete,
    } = props;
    const [selectedRowKeys, setSelectedRowKeys] = useState([[], []]);
    const [nakladnoyDryFruitId, setNakladnoyDryFruitId] = useState("");
    const { formData, dryfruitData, dryfruitWareData, user, measurementData } =
        useData();

    const outcomeNakladnoyData = [
        {
            name: "measurementId",
            label: "Quruq meva o'lchovi",
            inputSelect: (defaultId = null) => (
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

    useEffect(() => {
        getData();
    }, []);

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

    const arr = columns.map((item) =>
        item.search === true ? { ...item } : { ...item }
    );
    arr.map((item) => delete item.search);

    const dataTableColumns = [...arr];

    return (
        <>
            <Space className="buttons" size="middle">
                <Space align="center" size={0}>
                    <CustomSelect
                        backValue={"id"}
                        placeholder={"Quruq mevani tanlang"}
                        onChange={(e) => {
                            setNakladnoyDryFruitId(e);
                        }}
                        selectData={
                            user.roleId === 1
                                ? dryfruitData.filter((item) => {
                                      if (dryfruitWareData.length === 0)
                                          return [];
                                      for (
                                          let index = 0;
                                          index < dryfruitWareData.length;
                                          index++
                                      ) {
                                          if (
                                              item.id ===
                                              dryfruitWareData[index].dryFruitId
                                          )
                                              return item;
                                      }
                                  })
                                : dryfruitData.filter((item) => {
                                      const branch = dryfruitWareData.filter(
                                          (qism) =>
                                              qism.branchId === user.branchId
                                      );
                                      if (branch.length === 0) return null;
                                      for (
                                          let index = 0;
                                          index < branch.length;
                                          index++
                                      ) {
                                          if (
                                              item.id ===
                                              branch[index].dryFruitId
                                          )
                                              return item;
                                      }
                                  })
                        }
                    />
                </Space>
                <Space align="center" size="middle" className="new-buttons">
                    {formData?.editInfo ? (
                        selectedRowKeys[0]?.length === 1 ? (
                            <EditData
                                selectedRowKeys={{ ...selectedRowKeys[1][0] }}
                                onEdit={onEdit}
                                editData={formData?.editFormData}
                                editModalTitle={formData?.editModalTitle}
                                setSelectedRowKeys={setSelectedRowKeys}
                            />
                        ) : null
                    ) : null}
                    {formData?.deleteInfo ? (
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
                    ) : null}
                    {formData?.createInfo ? (
                        nakladnoyDryFruitId ? (
                            <EditDataCustome
                                setNakladnoyDryFruitId={setNakladnoyDryFruitId}
                                selectedRowKeys={{ nakladnoyDryFruitId }}
                                onEdit={onCreate}
                                editData={outcomeNakladnoyData}
                                editModalTitle={formData?.modalTitle}
                                setSelectedRowKeys={setSelectedRowKeys}
                            />
                        ) : null
                    ) : null}
                </Space>
            </Space>
            <Table
                rowSelection={rowSelection}
                loading={loading}
                columns={dataTableColumns}
                dataSource={tableData}
                bordered
                rowKey={"id"}
                scroll={{ x: true }}
                onRow={(record) => ({
                    onClick: () => {
                        handleSelect(record);
                    },
                })}
                pagination={{
                    pageSize: 50,
                    pageSizeOptions: pageSizeOptions,
                }}
            />
        </>
    );
};

const OutcomeNakladnoy = () => {
    const [outcomeFuel, setOutcomeFuel] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [totalInputValue, setTotalInputValue] = useState(null);
    const [client, setClient] = useState(null);
    const [valueDebt, setValueDebt] = useState(null);
    const [deadlineValue, setDeadlineValue] = useState(null);
    const { dryfruitData, measurementData, user, clientData } = useData();
    const navigate = useNavigate();

    const columns = [
        {
            title: "Mahsulot nomi",
            dataIndex: "dryFruitId",
            key: "dryFruitId",
            width: "25%",
            render: (record) => {
                const data = dryfruitData?.filter((item) => item.id === record);
                return data[0]?.name;
            },
        },
        {
            title: "Miqdori",
            dataIndex: "amount",
            key: "amount",
            width: "25%",
        },
        {
            title: "O'lchovi",
            dataIndex: "measurementId",
            key: "measurementId",
            width: "25%",
            render: (record) => {
                const data = measurementData?.filter(
                    (item) => item.id === record
                );
                return data[0]?.name;
            },
        },
        {
            title: "Narxi",
            dataIndex: "price",
            key: "price",
            width: "25%",
        },
    ];

    const onCreate = (values, initial) => {
        setLoading(true);
        setOutcomeFuel((prev) => {
            const product = prev.filter(
                (data) => data.dryFruitId === initial?.nakladnoyDryFruitId
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
                        id: initial?.nakladnoyDryFruitId,
                        dryFruitId: initial?.nakladnoyDryFruitId,
                    },
                ];
            }
        });
        setLoading(false);
    };

    const onEdit = (values, initial) => {
        setLoading(true);
        values.dryFruitId === initial.dryFruitId
            ? setOutcomeFuel((prev) => {
                  return prev.map((item) => {
                      return item.dryFruitId === values.dryFruitId
                          ? {
                                ...item,
                                price: values.price,
                                amount: values.amount,
                            }
                          : item;
                  });
              })
            : setOutcomeFuel((prev) => {
                  const borProduct = prev.filter(
                      (data) => data.dryFruitId !== values.dryFruitId
                  );
                  const newProduct = prev.filter(
                      (data) => data.dryFruitId !== initial.dryFruitId
                  );
                  return borProduct[0]
                      ? newProduct.map((item) => {
                            return item.dryFruitId === values.dryFruitId
                                ? {
                                      ...item,
                                      amount: item.amount + values.amount,
                                  }
                                : item;
                        })
                      : prev.map((item) => {
                            return item.dryFruitId === initial.dryFruitId
                                ? {
                                      ...values,
                                      id: values.dryFruitId,
                                  }
                                : item;
                        });
              });
        setLoading(false);
    };

    const handleDelete = (arr) => {
        setLoading(true);
        let newTableData = [...outcomeFuel];
        arr.map((itemId) => {
            newTableData = [
                ...newTableData.filter((item) => item.id !== itemId),
            ];
            return null;
        });
        setOutcomeFuel(newTableData);
        setLoading(false);
    };

    const showLargeDrawer = () => {
        setOpen(true);
        let totalsumma = 0;
        outcomeFuel.map((item) => {
            const ulchov = measurementData.filter(
                (data) => data.id === item.measurementId
            );
            const amount =
                ulchov[0].name.toLowerCase() === "tonna"
                    ? 1000
                    : ulchov[0].name.toLowerCase() === "gram"
                    ? 0.001
                    : 1;
            totalsumma = totalsumma + item.price * item.amount * amount;
            return null;
        });
        setTotalInputValue(totalsumma);
    };

    const onClose = () => {
        setOpen(false);
    };

    const onCash = (bol, tableData) => {
        setLoading(true);
        const value = tableData.map((values) => {
            const date = new Date();
            return {
                clientId: client,
                measurementId: values.measurementId ? values.measurementId : 4,
                amount: values.amount,
                dryFruitId: values.id,
                price: values.price,
                branchId: user.branchId,
                date,
                cash: bol,
                debt: valueDebt === "true" ? true : false,
            };
        });
        instance
            .post("api/dry/fruit/outcomeFruit/covenant", [...value])
            .then(function (response) {
                message.success("Sotilgan quruq meva muvaffaqiyatli qo'shildi");
                setOutcomeFuel([]);
            })
            .catch(function (error) {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("Sotilgan quruq mevani qo'shishda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });

        valueDebt === "true"
            ? value.map((values) => {
                  instance
                      .post("api/dry/fruit/outcomeFruit/add", { ...values })
                      .then(function (response) {
                          const ulchov = measurementData.filter(
                              (item) => item.id === values.measurementId
                          );
                          const amount =
                              ulchov[0].name.toLowerCase() === "tonna"
                                  ? 1000
                                  : ulchov[0].name.toLowerCase() === "gram"
                                  ? 0.001
                                  : 1;
                          response.data.data &&
                              instance
                                  .post("api/dry/fruit/debt/post", {
                                      incomeDryFruitId: null,
                                      workerId: null,
                                      outcomeDryFruitId: response.data.data,
                                      deadline: deadlineValue,
                                      given: false,
                                      borrowAmount:
                                          values.price * values.amount * amount,
                                  })
                                  .then((res) =>
                                      message.success(
                                          "Tashqi qarz muvofaqiyatli qo'shildi"
                                      )
                                  )
                                  .catch((err) => {
                                      message.error(
                                          "Tashqi qarzni qo'shishda muammo bo'ldi"
                                      );
                                      console.error(err);
                                  })
                                  .finally(() => {
                                      setDeadlineValue(null);
                                      setValueDebt(null);
                                  });
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
                          setDeadlineValue(null);
                          setValueDebt(null);
                          setLoading(false);
                      });
                  return null;
              })
            : console.error("salom");
        setOpen(false);
        setTotalInputValue(null);
        setDeadlineValue(null);
        setValueDebt(null);
        setClient(null);
    };

    const onChangeDebt = (e) => {
        setValueDebt(e.target.value);
    };

    const onChangeDeadline = (e) => {
        setDeadlineValue(moment(e).toISOString());
    };

    return (
        <>
            <h3>Optom sotish</h3>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "end",
                    marginBottom: 15,
                }}
            >
                <h3 style={{ margin: 0, marginRight: 20 }}>
                    Oldingi Nakladnoyni yuklash
                </h3>
                <a
                    href="http://31.44.5.130:8080/api/dry/fruit/outcomeFruit/download"
                    download="report.pdf"
                >
                    <Button type="primary" icon={<DownloadOutlined />}>
                        Yuklab olish
                    </Button>
                </a>
            </div>
            <CustomTable
                onEdit={onEdit}
                onCreate={onCreate}
                onDelete={handleDelete}
                getData={(a) => a}
                columns={columns}
                tableData={outcomeFuel}
                loading={loading}
                setLoading={setLoading}
                pageSizeOptions={[50, 100]}
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
                    disabled={outcomeFuel[0] ? false : true}
                >
                    Sotish
                </Button>
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
                                onClick={() => onCash(true, outcomeFuel)}
                            >
                                Naqt pul
                            </Button>
                        </Space>
                    }
                >
                    <Row style={{ display: "block" }}>
                        <Col
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    marginRight: "16px",
                                }}
                            >
                                <p>Mahsulot olayotgan klient</p>
                                <CustomSelect
                                    backValue={"id"}
                                    placeholder={
                                        "Quruq meva sotilayotgan klient"
                                    }
                                    selectData={clientData?.map((item) => ({
                                        ...item,
                                        name: item.fio,
                                    }))}
                                    onChange={(e) => setClient(e)}
                                />
                            </div>
                            <div>
                                <p>Qarzmagi</p>
                                <Radio.Group onChange={onChangeDebt}>
                                    <Radio value="false"> Yo'q </Radio>
                                    <Radio value="true">
                                        {" "}
                                        <p>Ha</p>
                                        {valueDebt === "true" ? (
                                            <>
                                                <div
                                                    style={{
                                                        width: "115%",
                                                        marginLeft: "-25px",
                                                    }}
                                                >
                                                    Qaytarish vaqti
                                                    <DatePicker
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                        onChange={
                                                            onChangeDeadline
                                                        }
                                                    />
                                                </div>
                                            </>
                                        ) : null}{" "}
                                    </Radio>
                                </Radio.Group>
                            </div>
                        </Col>
                    </Row>
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
                                    onClick={() => onCash(false, outcomeFuel)}
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
                                    onClick={() => onCash(true, outcomeFuel)}
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
            </Row>
        </>
    );
};

export default OutcomeNakladnoy;
