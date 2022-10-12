import { useState } from "react";
import instance from "../Api/Axios";
import moment from "moment";
import { Card, Col, message, Row, Statistic } from "antd";
import CustomTable from "../Module/Table/Table";
import { useNavigate } from "react-router-dom";
import { useData } from "../Hook/UseData";
import { ArrowDownOutlined } from "@ant-design/icons";

const IncomeDryFruit = () => {
    const [incomeDryFruit, setIncomeDryFruit] = useState([]);
    const [totalsum, setTotalsum] = useState();
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const {
        dryfruitData,
        measurementData,
        branchData,
        qarzValue,
        user,
        setQarzValue,
        deadlineValue,
        setDeadlineValue,
        setValueDebt,
        getIncomeDryfruitData,
    } = useData();
    const navigate = useNavigate();

    const getIncomeDryFruits = (current, pageSize) => {
        setLoading(true);
        user?.roleId === 1
            ? instance
                  .get(
                      `api/dry/fruit/incomeDryFruit/getAll?page=${current}&size=${pageSize}`
                  )
                  .then((data) => {
                      const incomeDryfruit =
                          data.data.data?.incomeDryFruit?.incomeDryFruitGetDtoList?.map(
                              (item) => {
                                  return {
                                      ...item,
                                      date: moment(item?.date).format(
                                          "DD-MM-YYYY"
                                      ),
                                  };
                              }
                          );
                      const index = data.data.data?.incomeDryFruit?.totalDollar
                          ?.toString()
                          .indexOf(".");
                      setTotalsum({
                          totalSumma:
                              data.data.data?.incomeDryFruit?.totalSumma,
                          totalPlastic:
                              data.data.data?.incomeDryFruit?.totalPlastic,
                          totalDollar:
                              data.data.data?.incomeDryFruit?.totalDollar
                                  ?.toString()
                                  .slice(0, index + 3),
                          totalCash: data.data.data?.incomeDryFruit?.totalCash,
                      });
                      getIncomeDryfruitData();
                      setIncomeDryFruit(incomeDryfruit);
                      setTotalItems(data.data.data?.totalItems);
                  })
                  .catch((error) => {
                      console.error(error);
                      if (error.response?.status === 500)
                          navigate("/server-error");
                      message.error(
                          "Kelgan quruq mevalarni yuklashda muammo bo'ldi"
                      );
                  })
                  .finally(() => setLoading(false))
            : instance
                  .get(
                      `api/dry/fruit/incomeDryFruit/getAllPageable?page=${current}&size=${pageSize}`
                  )
                  .then((item) => {
                      const branchItemData = item.data.data?.filter(
                          (data) => data.id === user.branchId
                      );
                      const incomeDryfruit =
                          branchItemData[0]?.totalIncomeDryFruit?.incomeDryFruitGetDtoList?.map(
                              (item) => {
                                  return {
                                      ...item,
                                      date: moment(item?.date).format(
                                          "DD-MM-YYYY"
                                      ),
                                  };
                              }
                          );
                      const index =
                          branchItemData[0]?.totalIncomeDryFruit?.totalDollar
                              ?.toString()
                              ?.indexOf(".");
                      setTotalsum({
                          totalSumma:
                              branchItemData[0]?.totalIncomeDryFruit
                                  ?.totalSumma,
                          totalPlastic:
                              branchItemData[0]?.totalIncomeDryFruit
                                  ?.totalPlastic,
                          totalDollar:
                              branchItemData[0]?.totalIncomeDryFruit?.totalDollar
                                  ?.toString()
                                  .slice(0, index + 3),
                          totalCash:
                              branchItemData[0]?.totalIncomeDryFruit?.totalCash,
                      });
                      getIncomeDryfruitData();
                      setIncomeDryFruit(incomeDryfruit);
                      setTotalItems(branchItemData[0]?.totalItems);
                  })
                  .catch((err) => {
                      console.error(err);
                      if (err.response?.status === 500)
                          navigate("/server-error");
                      message.error(
                          "Kelgan quruq mevalarni yuklashda muammo bo'ldi"
                      );
                  })
                  .finally(() => setLoading(false));
    };

    const columns = [
        {
            title: "Ombor",
            dataIndex: "branchId",
            key: "branchId",
            width: "20%",
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
            title: "Quruq meva turi",
            dataIndex: "dryFruitId",
            key: "dryFruitId",
            width: "15%",
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
            title: "O'lchovi",
            dataIndex: "measurementId",
            key: "measurementId",
            width: "11%",
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
        user.roleId === 1 && {
            title: "Kelish narxi",
            dataIndex: "price",
            key: "price",
            width: "15%",
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
            title: "Kelish vaqti",
            dataIndex: "date",
            key: "date",
            width: "15%",
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
            title: "Qarzdorlik",
            dataIndex: "debt",
            key: "debt",
            width: "7%",
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
        {
            title: "Naqtmi",
            dataIndex: "cash",
            key: "cash",
            width: "7%",
            search: false,
            render: (record) => {
                return record ? "Ha" : "Yo'q";
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
    ];

    const onCreate = (values) => {
        setLoading(true);
        const value = {
            ...values,
            date: moment(values.date, "DD-MM-YYYY").toISOString(),
            cash: values.cash === "true" ? true : false,
            debt: values.debt?.target?.value === "false" ? false : true,
        };
        instance
            .post("api/dry/fruit/incomeDryFruit/add", { ...value })
            .then(function (response) {
                message.success("Kelgan quruq meva muvofaqiyatli qo'shildi");
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
                            incomeDryFruitId: response.data?.data,
                            workerId: null,
                            outcomeDryFruitId: null,
                            given: false,
                            deadline: deadlineValue,
                            borrowAmount:
                                values.price * values.amount * amount -
                                qarzValue,
                        })
                        .then((res) => {
                            message.success(
                                "Qarzga olingan mahsulot muvofaqiyatli qo'shildi"
                            );
                            setDeadlineValue(null);
                            setQarzValue(null);
                            setValueDebt(null);
                        })
                        .catch((err) => {
                            message.error(
                                "Qarzga olingan mahsulotni qo'shishda muammo bo'ldi"
                            );
                            console.error(err);
                        });
                getIncomeDryFruits(current - 1, pageSize);
            })
            .catch(function (error) {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("Kelgan quruq mevani qo'shishda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
                setDeadlineValue(null);
                setQarzValue(null);
                setValueDebt(null);
            });
    };

    const onEdit = (values, initial) => {
        setLoading(true);
        const time = moment(values.date, "DD-MM-YYYY").toISOString();
        const data = {
            ...values,
            debt: values.debt?.target?.value === "true" ? true : false,
            cash: values?.cash === "true" ? true : false,
            date: time,
        };
        instance
            .put(`api/dry/fruit/incomeDryFruit/update${initial.id}`, {
                ...data,
            })
            .then((res) => {
                message.success("Kelgan quruq meva muvaffaqiyatli taxrirlandi");
                getIncomeDryFruits(current - 1, pageSize);
                const ulchov = measurementData.filter(
                    (item) => item.id === values.measurementId
                );
                const amount =
                    ulchov[0].name.toLowerCase() === "tonna"
                        ? 1000
                        : ulchov[0].name.toLowerCase() === "gram"
                        ? 0.001
                        : 1;
                res.data?.data &&
                    instance
                        .post("api/dry/fruit/debt/post", {
                            incomeDryFruitId: res.data?.data,
                            workerId: null,
                            outcomeDryFruitId: null,
                            given: false,
                            deadline: deadlineValue,
                            borrowAmount:
                                values.price * values.amount * amount -
                                qarzValue,
                        })
                        .then((res) => {
                            setDeadlineValue(null);
                            setQarzValue(null);
                            setValueDebt(null);
                        })
                        .catch((err) => console.error(err));
            })
            .catch(function (error) {
                console.error("Error in edit: ", error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("Kelgan quruq mevani taxrirlashda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
                setDeadlineValue(null);
                setQarzValue(null);
                setValueDebt(null);
            });
    };

    const handleDelete = (arr) => {
        setLoading(true);
        arr.map((item) => {
            instance
                .delete(`api/dry/fruit/incomeDryFruit/delete${item}`)
                .then((data) => {
                    getIncomeDryFruits(current - 1, pageSize);
                    message.success(
                        "Kelgan quruq meva muvaffaqiyatli o'chirildi"
                    );
                })
                .catch((error) => {
                    console.error(error);
                    if (error.response?.status === 500)
                        navigate("/server-error");
                    message.error(
                        "Kelgan quruq mevani o'chirishda muammo bo'ldi"
                    );
                });
            return null;
        });
        setLoading(false);
    };

    const getIncomeDryFruitsBranches = (value, current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/incomeDryFruit/getAllPageable?page=${current}&size=${pageSize}`
            )
            .then((item) => {
                const branchItemData = item.data.data?.filter(
                    (data) => data.id === value
                );
                const incomeDryfruit =
                    branchItemData[0]?.totalIncomeDryFruit?.incomeDryFruitGetDtoList?.map(
                        (item) => {
                            return {
                                ...item,
                                date: moment(item?.date).format("DD-MM-YYYY"),
                            };
                        }
                    );
                const index =
                    branchItemData[0]?.totalIncomeDryFruit?.totalDollar
                        ?.toString()
                        ?.indexOf(".");
                setTotalsum({
                    totalSumma:
                        branchItemData[0]?.totalIncomeDryFruit?.totalSumma,
                    totalPlastic:
                        branchItemData[0]?.totalIncomeDryFruit?.totalPlastic,
                    totalDollar:
                        branchItemData[0]?.totalIncomeDryFruit?.totalDollar
                            ?.toString()
                            .slice(0, index + 3),
                    totalCash:
                        branchItemData[0]?.totalIncomeDryFruit?.totalCash,
                });
                setIncomeDryFruit(incomeDryfruit);
                setTotalItems(branchItemData[0]?.totalItems);
            })
            .catch((err) => {
                console.error(err);
                if (err.response?.status === 500) navigate("/server-error");
                message.error("Kelgan quruq mevalarni yuklashda muammo bo'ldi");
            })
            .finally(() => setLoading(false));
    };

    const getIncomeDryFruitsTimely = (value, current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/incomeDryFruit/getAllPageable/${value}?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                const incomeDryfruit =
                    data.data.data?.incomeDryFruit?.incomeDryFruitGetDtoList?.map(
                        (item) => {
                            return {
                                ...item,
                                date: moment(item?.date).format("DD-MM-YYYY"),
                            };
                        }
                    );
                const index = data.data.data?.incomeDryFruit?.totalDollar
                    ?.toString()
                    .indexOf(".");
                setTotalsum({
                    totalSumma: data.data.data?.incomeDryFruit?.totalSumma,
                    totalPlastic: data.data.data?.incomeDryFruit?.totalPlastic,
                    totalDollar: data.data.data?.incomeDryFruit?.totalDollar
                        ?.toString()
                        .slice(0, index + 3),
                    totalCash: data.data.data?.incomeDryFruit?.totalCash,
                });
                setIncomeDryFruit(incomeDryfruit);
                setTotalItems(data.data.data?.totalItems);
            })
            .catch((error) => {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("Kelgan quruq mevalarni yuklashda muammo bo'ldi");
            })
            .finally(() => setLoading(false));
    };

    const dateFilter = (date, current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/incomeDryFruit/getAllPageable/dates?page=${current}&size=${pageSize}&startDate=${moment(
                    date[0]
                ).format("YYYY-MM-DD HH:MM:SS")}&endDate=${moment(
                    date[1]
                ).format("YYYY-MM-DD HH:MM:SS")}`
            )
            .then((data) => {
                const incomeDryfruit =
                    data.data.data.incomeDryFruit.incomeDryFruitGetDtoList.map(
                        (item) => {
                            return {
                                ...item,
                                date: moment(item?.date).format("DD-MM-YYYY"),
                            };
                        }
                    );
                const index = data.data.data?.incomeDryFruit?.totalDollar
                    ?.toString()
                    .indexOf(".");
                setTotalsum({
                    totalSumma: data.data.data?.incomeDryFruit?.totalSumma,
                    totalPlastic: data.data.data?.incomeDryFruit?.totalPlastic,
                    totalDollar: data.data.data?.incomeDryFruit?.totalDollar
                        ?.toString()
                        .slice(0, index + 3),
                    totalCash: data.data.data?.incomeDryFruit?.totalCash,
                });
                setIncomeDryFruit(incomeDryfruit);
                setTotalItems(data.data.data?.totalItems);
            })
            .catch((err) => {
                console.error(err);
                if (err.response?.status === 500) navigate("/server-error");
                message.error("Kelgan quruq mevalarni yuklashda muammo bo'ldi");
            })
            .finally(() => setLoading(false));
    };

    const timelySelect = [
        { title: "Kunlik", value: "daily" },
        { title: "Haftalik", value: "weekly" },
        { title: "Oylik", value: "monthly" },
        { title: "Yillik", value: "yearly" },
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
                                    title="Jami sarflangan summa"
                                    value={totalsum?.totalSumma}
                                    valueStyle={{
                                        color: "#cf1322",
                                    }}
                                    prefix={<ArrowDownOutlined />}
                                    suffix="tenge"
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Card>
                                <Statistic
                                    title="Jami sarflangan summa dollarda"
                                    value={totalsum?.totalDollar}
                                    valueStyle={{
                                        color: "#cf1322",
                                    }}
                                    prefix={<ArrowDownOutlined />}
                                    suffix="$"
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Card>
                                <Statistic
                                    title="Plastikdagi sarflangan summa"
                                    value={totalsum?.totalPlastic}
                                    valueStyle={{
                                        color: "#cf1322",
                                    }}
                                    prefix={<ArrowDownOutlined />}
                                    suffix="tenge"
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Card>
                                <Statistic
                                    title="Naqtdagi sarflangan summa"
                                    value={totalsum?.totalCash}
                                    valueStyle={{
                                        color: "#cf1322",
                                    }}
                                    prefix={<ArrowDownOutlined />}
                                    suffix="tenge"
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            ) : null}
            <CustomTable
                getData={getIncomeDryFruits}
                columns={columns}
                tableData={incomeDryFruit}
                current={current}
                pageSize={pageSize}
                totalItems={totalItems}
                loading={loading}
                timelySelect={timelySelect}
                pageSizeOptions={[10, 20]}
                onEdit={onEdit}
                onCreate={onCreate}
                dateFilter={dateFilter}
                onDelete={handleDelete}
                getDataBranch={getIncomeDryFruitsBranches}
                getDataTimely={getIncomeDryFruitsTimely}
                setLoading={setLoading}
                setCurrent={setCurrent}
                setPageSize={setPageSize}
            />
        </>
    );
};

export default IncomeDryFruit;
