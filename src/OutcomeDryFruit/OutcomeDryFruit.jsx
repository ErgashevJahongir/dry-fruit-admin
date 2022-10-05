import { useState } from "react";
import instance from "../Api/Axios";
import moment from "moment";
import { Button, Card, Col, message, notification, Row, Statistic } from "antd";
import CustomTable from "../Module/Table/Table";
import { useNavigate } from "react-router-dom";
import { useData } from "../Hook/UseData";
import { ArrowUpOutlined, FrownOutlined } from "@ant-design/icons";

const IncomeDryFruit = () => {
    const [outcomeFuel, setOutcomeFuel] = useState([]);
    const [totalsum, setTotalsum] = useState();
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const {
        branchData,
        dryfruitData,
        usersData,
        clientData,
        measurementData,
        qarzValue,
        deadlineValue,
        setDeadlineValue,
        setQarzValue,
        setValueDebt,
    } = useData();
    const navigate = useNavigate();

    const getOutcomeDryFruits = (current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/outcomeFruit/getAllPageable?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                const incomeDryfruit =
                    data.data.data.dryFruits.outcomeDryFruitGetDtoList.map(
                        (item) => {
                            return {
                                ...item,
                                date: moment(item?.date).format("DD-MM-YYYY"),
                            };
                        }
                    );
                const index = data.data.data?.dryFruits.totalDollar
                    ?.toString()
                    .indexOf(".");
                setTotalsum({
                    totalSumma: data.data.data?.dryFruits.totalSumma,
                    totalPlastic: data.data.data?.dryFruits.totalPlastic,
                    totalDollar: data.data.data?.dryFruits.totalDollar
                        ?.toString()
                        .slice(0, index + 3),
                    totalCash: data.data.data?.dryFruits.totalCash,
                });
                setOutcomeFuel(incomeDryfruit);
                setTotalItems(data.data.data?.totalItems);
            })
            .catch((error) => {
                console.error(error);
                if (error?.response?.status === 500) navigate("/server-error");
                message.error(
                    "Sotilgan quruq mevalarni yuklashda muammo bo'ldi"
                );
            })
            .finally(() => setLoading(false));
    };

    const columns = [
        {
            title: "Klient ismi",
            dataIndex: "clientId",
            key: "clientId",
            width: "10%",
            search: false,
            render: (record) => {
                const data = clientData?.filter((item) => item.id === record);
                return data[0]?.fio;
            },
            sorter: (a, b) => {
                if (a.clientId < b.clientId) {
                    return -1;
                }
                if (a.clientId > b.clientId) {
                    return 1;
                }
                return 0;
            },
        },
        {
            title: "Meva sotilayotgan fuliall",
            dataIndex: "branchId",
            key: "branchId",
            width: "15%",
            render: (record) => {
                const data = branchData?.filter((item) => item.id === record);
                return data[0]?.name;
            },
            search: false,
            sorter: (a, b) => {
                if (a.branchId < b.branchId) {
                    return -1;
                }
                if (a.branchId > b.branchId) {
                    return 1;
                }
                return 0;
            },
        },
        {
            title: "Quruq meva nomi",
            dataIndex: "dryFruitId",
            key: "dryFruitId",
            width: "10%",
            render: (record) => {
                const data = dryfruitData?.filter((item) => item.id === record);
                return data[0]?.name;
            },
            search: false,
            sorter: (a, b) => {
                if (a.dryFruitId < b.dryFruitId) {
                    return -1;
                }
                if (a.dryFruitId > b.dryFruitId) {
                    return 1;
                }
                return 0;
            },
        },
        {
            title: "Miqdori",
            dataIndex: "amount",
            key: "amount",
            width: "10%",
            sorter: (a, b) => {
                if (a.amount < b.amount) {
                    return -1;
                }
                if (a.amount > b.amount) {
                    return 1;
                }
                return 0;
            },
            search: false,
        },
        {
            title: "O'lchovi",
            dataIndex: "measurementId",
            key: "measurementId",
            width: "10%",
            render: (record) => {
                const data = measurementData?.filter(
                    (item) => item.id === record
                );
                return data[0]?.name;
            },
            search: false,
            sorter: (a, b) => {
                if (a.measurementId < b.measurementId) {
                    return -1;
                }
                if (a.measurementId > b.measurementId) {
                    return 1;
                }
                return 0;
            },
        },
        {
            title: "Sotilgan narxi",
            dataIndex: "price",
            key: "price",
            width: "10%",
            search: false,
            sorter: (a, b) => {
                if (a.price < b.price) {
                    return -1;
                }
                if (a.price > b.price) {
                    return 1;
                }
                return 0;
            },
        },
        {
            title: "Sotgan hodim",
            dataIndex: "createdBy",
            key: "createdBy",
            width: "10%",
            render: (record) => {
                const data = usersData?.filter((item) => item.id === record);
                return data[0]?.fio;
            },
            search: false,
            sorter: (a, b) => {
                if (a.createdBy < b.createdBy) {
                    return -1;
                }
                if (a.createdBy > b.createdBy) {
                    return 1;
                }
                return 0;
            },
        },
        {
            title: "Sotilgan vaqti",
            dataIndex: "date",
            key: "date",
            width: "10%",
            search: false,
            sorter: (a, b) => {
                if (a.date < b.date) {
                    return -1;
                }
                if (a.date > b.date) {
                    return 1;
                }
                return 0;
            },
        },
        {
            title: "Naqd pul",
            dataIndex: "cash",
            key: "cash",
            width: "7%",
            search: false,
            render: (record) => {
                return record ? "Bor" : "Yo'q";
            },
            sorter: (a, b) => {
                if (a.cash < b.cash) {
                    return -1;
                }
                if (a.cash > b.cash) {
                    return 1;
                }
                return 0;
            },
        },
        {
            title: "Qarzdorlik",
            dataIndex: "debt",
            key: "debt",
            width: "8%",
            search: false,
            render: (record) => {
                return record ? "Bor" : "Yo'q";
            },
            sorter: (a, b) => {
                if (a.debt < b.debt) {
                    return -1;
                }
                if (a.debt > b.debt) {
                    return 1;
                }
                return 0;
            },
        },
    ];

    const onCreate = (values) => {
        setLoading(true);
        const value = {
            ...values,
            date: moment(values.date, "DD-MM-YYYY")?.toISOString(),
            cash: values?.cash === "true" ? true : false,
            debt: values.debt?.target?.value === "false" ? false : true,
        };
        instance
            .post("api/dry/fruit/outcomeFruit/add", { ...value })
            .then(function (response) {
                message.success("Sotilgan quruq meva muvaffaqiyatli qo'shildi");
                const ulchov = measurementData.filter(
                    (item) => item.id === values.measurementId
                );
                const amount =
                    ulchov[0].name.toLowerCase() === "tonna"
                        ? 1000
                        : ulchov[0].name.toLowerCase() === "gramm"
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
                                values.price * values.amount * amount -
                                qarzValue,
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
                            setQarzValue(null);
                            setDeadlineValue(null);
                            setValueDebt(null);
                        });
                getOutcomeDryFruits(current - 1, pageSize);
            })
            .catch(function (error) {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                const btn = (
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => navigate("/dryfruit")}
                    >
                        Narxlarni ko'rish
                    </Button>
                );
                if (error.response?.status === 420)
                    notification["error"]({
                        message: "Mahsulot sotishda xatolik",
                        description: `Mahsulotni o'z narxidan arzonga sotmoqchisiz.`,
                        duration: 5,
                        btn,
                        icon: <FrownOutlined style={{ color: "#f00" }} />,
                    });
                message.error("Sotilgan quruq mevani qo'shishda muammo bo'ldi");
            })
            .finally(() => {
                setQarzValue(null);
                setDeadlineValue(null);
                setValueDebt(null);
                setLoading(false);
            });
    };

    const onEdit = (values, initial) => {
        setLoading(true);
        const data = {
            ...values,
            date: moment(values.date, "DD-MM-YYYY")?.toISOString(),
            cash: values?.cash === "true" ? true : false,
            debt: values.debt?.target?.value === "false" ? false : true,
        };
        instance
            .put(`api/dry/fruit/outcomeFruit/update${initial.id}`, {
                ...data,
            })
            .then((res) => {
                message.success(
                    "Sotilgan quruq meva muvaffaqiyatli taxrirlandi"
                );
                getOutcomeDryFruits(current - 1, pageSize);
                const ulchov = measurementData.filter(
                    (item) => item.id === values.measurementId
                );
                const amount =
                    ulchov[0].name.toLowerCase() === "tonna"
                        ? 1000
                        : ulchov[0].name.toLowerCase() === "gramm"
                        ? 0.001
                        : 1;
                res.data.data &&
                    instance
                        .post("api/dry/fruit/debt/post", {
                            incomeDryFruitId: null,
                            workerId: null,
                            outcomeDryFruitId: res.data.data,
                            deadline: deadlineValue,
                            given: false,
                            borrowAmount:
                                values.price * values.amount * amount -
                                qarzValue,
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
                            setQarzValue(null);
                            setDeadlineValue(null);
                            setValueDebt(null);
                        });
            })
            .catch(function (error) {
                console.error("Error in edit: ", error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error(
                    "Sotilgan quruq mevani taxrirlashda muammo bo'ldi"
                );
                const btn = (
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => navigate("/dryfruit")}
                    >
                        Narxlarni ko'rish
                    </Button>
                );
                if (error.response?.status === 420)
                    notification["error"]({
                        message: "Mahsulot sotishda xatolik",
                        description: `Mahsulotni o'z narxidan arzonga sotmoqchisiz.`,
                        duration: 5,
                        btn,
                        icon: <FrownOutlined style={{ color: "#f00" }} />,
                    });
            })
            .finally(() => {
                setQarzValue(null);
                setDeadlineValue(null);
                setValueDebt(null);
                setLoading(false);
            });
    };

    const handleDelete = (arr) => {
        setLoading(true);
        arr.map((item) => {
            instance
                .delete(`api/dry/fruit/outcomeFruit/delete${item}`)
                .then((data) => {
                    getOutcomeDryFruits(current - 1, pageSize);
                    message.success(
                        "Sotilgan quruq meva muvaffaqiyatli o'chirildi"
                    );
                })
                .catch((error) => {
                    console.error(error);
                    if (error.response?.status === 500)
                        navigate("/server-error");
                    message.error(
                        "Sotilgan quruq mevani o'chirishda muammo bo'ldi"
                    );
                });
            return null;
        });
        setLoading(false);
    };

    const getOutcomeDryFruitsBranches = (value, current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/outcomeFruit/findAllByBranchId/${value}?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                const incomeDryfruit =
                    data.data.data.dryFruits.outcomeDryFruitGetDtoList.map(
                        (item) => {
                            return {
                                ...item,
                                date: moment(item?.date).format("DD-MM-YYYY"),
                            };
                        }
                    );
                const index = data.data.data?.dryFruits.totalDollar
                    ?.toString()
                    .indexOf(".");
                setTotalsum({
                    totalSumma: data.data.data?.dryFruits.totalSumma,
                    totalPlastic: data.data.data?.dryFruits.totalPlastic,
                    totalDollar: data.data.data?.dryFruits.totalDollar
                        ?.toString()
                        .slice(0, index + 3),
                    totalCash: data.data.data?.dryFruits.totalCash,
                });
                setOutcomeFuel(incomeDryfruit);
                setTotalItems(data.data.data?.totalItems);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    const getOutcomeDryFruitsTimely = (value, current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/outcomeFruit/getAllPageable/${value}?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                const incomeDryfruit =
                    data.data.data.dryFruits.outcomeDryFruitGetDtoList.map(
                        (item) => {
                            return {
                                ...item,
                                date: moment(item?.date).format("DD-MM-YYYY"),
                            };
                        }
                    );
                const index = data.data.data?.dryFruits.totalDollar
                    ?.toString()
                    .indexOf(".");
                setTotalsum({
                    totalSumma: data.data.data?.dryFruits.totalSumma,
                    totalPlastic: data.data.data?.dryFruits.totalPlastic,
                    totalDollar: data.data.data?.dryFruits.totalDollar
                        ?.toString()
                        .slice(0, index + 3),
                    totalCash: data.data.data?.dryFruits.totalCash,
                });
                setOutcomeFuel(incomeDryfruit);
                setTotalItems(data.data.data?.totalItems);
            })
            .catch((error) => {
                console.error(error);
                message.error(
                    "Sotilgan quruq mevani o'chirishda muammo bo'ldi"
                );
            })
            .finally(() => setLoading(false));
    };

    const dateFilter = (date, current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/outcomeFruit/getAllPageable/between?page=${current}&size=${pageSize}&startDate=${moment(
                    date[0]
                ).format("YYYY-MM-DD HH:MM:SS")}&endDate=${moment(
                    date[1]
                ).format("YYYY-MM-DD HH:MM:SS")}`
            )
            .then((data) => {
                const incomeDryfruit =
                    data.data.data.dryFruits.outcomeDryFruitGetDtoList.map(
                        (item) => {
                            return {
                                ...item,
                                date: moment(item?.date).format("DD-MM-YYYY"),
                            };
                        }
                    );
                const index = data.data.data?.dryFruits.totalDollar
                    ?.toString()
                    .indexOf(".");
                setTotalsum({
                    totalSumma: data.data.data?.dryFruits.totalSumma,
                    totalPlastic: data.data.data?.dryFruits.totalPlastic,
                    totalDollar: data.data.data?.dryFruits.totalDollar
                        ?.toString()
                        .slice(0, index + 3),
                    totalCash: data.data.data?.dryFruits.totalCash,
                });
                setOutcomeFuel(incomeDryfruit);
                setTotalItems(data.data.data?.totalItems);
            })
            .catch((err) => {
                console.error(err);
                message.error(
                    "Sotilgan quruq mevani o'chirishda muammo bo'ldi"
                );
            })
            .finally(() => setLoading(false));
    };

    const timelySelect = [
        { title: "Kunlik", value: "daily" },
        { title: "Haftalik", value: "weekly" },
        { title: "Oylik", value: "monthly" },
        { title: "Yillik", value: "annual" },
    ];

    return (
        <>
            {totalsum ? (
                <div
                    style={{ marginBottom: "20px" }}
                    className="site-statistic-demo-card"
                >
                    <Row gutter={[10, 10]}>
                        <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                            <Card>
                                <Statistic
                                    title="Jami summa"
                                    value={totalsum?.totalSumma}
                                    valueStyle={{
                                        color: "#3f8600",
                                    }}
                                    prefix={<ArrowUpOutlined />}
                                    suffix="tenge"
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                            <Card>
                                <Statistic
                                    title="Jami summa dollarda"
                                    value={totalsum?.totalDollar}
                                    valueStyle={{
                                        color: "#3f8600",
                                    }}
                                    prefix={<ArrowUpOutlined />}
                                    suffix="$"
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                            <Card>
                                <Statistic
                                    title="Plastikdagi summa"
                                    value={totalsum?.totalPlastic}
                                    valueStyle={{
                                        color: "#3f8600",
                                    }}
                                    prefix={<ArrowUpOutlined />}
                                    suffix="tenge"
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                            <Card>
                                <Statistic
                                    title="Naqtdagi summa"
                                    value={totalsum?.totalCash}
                                    valueStyle={{
                                        color: "#3f8600",
                                    }}
                                    prefix={<ArrowUpOutlined />}
                                    suffix="tenge"
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            ) : null}
            <CustomTable
                onEdit={onEdit}
                onCreate={onCreate}
                onDelete={handleDelete}
                getData={getOutcomeDryFruits}
                getDataBranch={getOutcomeDryFruitsBranches}
                getDataTimely={getOutcomeDryFruitsTimely}
                dateFilter={dateFilter}
                columns={columns}
                tableData={outcomeFuel}
                current={current}
                pageSize={pageSize}
                totalItems={totalItems}
                loading={loading}
                timelySelect={timelySelect}
                setLoading={setLoading}
                setCurrent={setCurrent}
                setPageSize={setPageSize}
                pageSizeOptions={[10, 20]}
            />
        </>
    );
};

export default IncomeDryFruit;
