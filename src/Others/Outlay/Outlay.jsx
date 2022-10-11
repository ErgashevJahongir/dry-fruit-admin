import { useState } from "react";
import instance from "../../Api/Axios";
import moment from "moment";
import { Card, Col, message, Row, Statistic } from "antd";
import CustomTable from "../../Module/Table/Table";
import { useNavigate } from "react-router-dom";
import { useData } from "../../Hook/UseData";
import { ArrowDownOutlined } from "@ant-design/icons";

const Outlay = () => {
    const [incomeDryFruit, setIncomeDryFruit] = useState([]);
    const [totalsum, setTotalsum] = useState();
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const { usersData, user } = useData();
    const navigate = useNavigate();

    const getIncomeDryFruits = (current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/api/dry/fruit/outlay/getByUserId${user.id}?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                const incomeDryfruit =
                    data.data.data?.outlayAllByUser?.outlayDtoList;
                const index = data.data.data?.outlayAllByUser?.totalDollar
                    ?.toString()
                    .indexOf(".");
                setTotalsum({
                    totalSumma: data.data.data?.outlayAllByUser?.totalSumma,
                    totalDollar: data.data.data?.outlayAllByUser?.totalDollar
                        ?.toString()
                        .slice(0, index + 3),
                });
                setIncomeDryFruit(incomeDryfruit);
                setTotalItems(data.data.data?.totalItems);
            })
            .catch((error) => {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("Chiqimlarni yuklashda muammo bo'ldi");
            })
            .finally(() => setLoading(false));
    };

    const columns = [
        {
            title: "Chiqim nimaga ishlatilganligi",
            dataIndex: "name",
            key: "name",
            width: "40%",
            search: true,
            sorter: (a, b) => {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            },
        },
        {
            title: "Miqdori",
            dataIndex: "outgoings",
            key: "outgoings",
            width: "20%",
            sorter: (a, b) => {
                if (a.outgoings < b.outgoings) {
                    return -1;
                }
                if (a.outgoings > b.outgoings) {
                    return 1;
                }
                return 0;
            },
            search: false,
        },
        {
            title: "Ishlatgan odam",
            dataIndex: "userId",
            key: "userId",
            width: "39%",
            search: false,
            render: (record) => {
                const data = usersData?.filter((item) => item.id === record);
                return data[0]?.fio;
            },
            sorter: (a, b) => {
                if (a.userId < b.userId) {
                    return -1;
                }
                if (a.userId > b.userId) {
                    return 1;
                }
                return 0;
            },
        },
    ];

    const onCreate = (values) => {
        setLoading(true);
        instance
            .post("api/dry/fruit/api/dry/fruit/outlay", { ...values })
            .then(function (response) {
                message.success("Chiqim muvofaqiyatli qo'shildi");
                getIncomeDryFruits(current - 1, pageSize);
            })
            .catch(function (error) {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("Chiqimni qo'shishda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onEdit = (values, initial) => {
        setLoading(true);
        instance
            .put(`api/dry/fruit/api/dry/fruit/outlay/edit${initial.id}`, {
                ...values,
            })
            .then((res) => {
                message.success("Chiqim muvaffaqiyatli taxrirlandi");
                getIncomeDryFruits(current - 1, pageSize);
            })
            .catch(function (error) {
                console.error("Error in edit: ", error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("Chiqimni taxrirlashda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDelete = (arr) => {
        setLoading(true);
        arr.map((item) => {
            instance
                .delete(`api/dry/fruit/api/dry/fruit/outlay/delete${item}`)
                .then((data) => {
                    getIncomeDryFruits(current - 1, pageSize);
                    message.success("Chiqim muvaffaqiyatli o'chirildi");
                })
                .catch((error) => {
                    console.error(error);
                    if (error.response?.status === 500)
                        navigate("/server-error");
                    message.error("Chiqimni o'chirishda muammo bo'ldi");
                })
                .finally(() => setLoading(false));
            return null;
        });
    };

    const getIncomeDryFruitsBranches = (value, current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/api/dry/fruit/outlay/getByBranchId${value}?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                const incomeDryfruit =
                    data.data.data?.outlayAllByBranch?.outlayDtoList;
                const index = data.data.data?.outlayAllByBranch?.totalDollar
                    ?.toString()
                    .indexOf(".");
                setTotalsum({
                    totalSumma: data.data.data?.outlayAllByBranch?.totalSumma,
                    totalDollar: data.data.data?.outlayAllByBranch?.totalDollar
                        ?.toString()
                        .slice(0, index + 3),
                });
                setIncomeDryFruit(incomeDryfruit);
                setTotalItems(data.data.data?.totalItems);
            })
            .catch((err) => {
                console.error(err);
                if (err.response?.status === 500) navigate("/server-error");
                message.error("Chiqimlarni yuklashda muammo bo'ldi");
            })
            .finally(() => setLoading(false));
    };

    const getIncomeDryFruitsTimely = (value, current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/api/dry/fruit/outlay/${value}?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                const incomeDryfruit = data.data.data?.outlayAll?.outlayDtoList;
                const index = data.data.data?.outlayAll?.totalDollar
                    ?.toString()
                    .indexOf(".");
                setTotalsum({
                    totalSumma: data.data.data?.outlayAll?.totalSumma,
                    totalDollar: data.data.data?.outlayAll?.totalDollar
                        ?.toString()
                        .slice(0, index + 3),
                });
                setIncomeDryFruit(incomeDryfruit);
                setTotalItems(data.data.data?.totalItems);
            })
            .catch((error) => {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("Chiqimlarni yuklashda muammo bo'ldi");
            })
            .finally(() => setLoading(false));
    };

    const dateFilter = (date, current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/api/dry/fruit/outlay/getBetween?page=${current}&size=${pageSize}&startDate=${moment(
                    date[0]
                ).format("YYYY-MM-DD HH:MM:SS")}&endDate=${moment(
                    date[1]
                ).format("YYYY-MM-DD HH:MM:SS")}`
            )
            .then((data) => {
                const incomeDryfruit = data.data.data?.outlayAll?.outlayDtoList;
                const index = data.data.data?.outlayAll?.totalDollar
                    ?.toString()
                    .indexOf(".");
                setTotalsum({
                    totalSumma: data.data.data?.outlayAll?.totalSumma,
                    totalDollar: data.data.data?.outlayAll?.totalDollar
                        ?.toString()
                        .slice(0, index + 3),
                });
                setIncomeDryFruit(incomeDryfruit);
                setTotalItems(data.data.data?.totalItems);
            })
            .catch((err) => {
                console.error(err);
                if (err.response?.status === 500) navigate("/server-error");
                message.error("Chiqimlarni yuklashda muammo bo'ldi");
            })
            .finally(() => setLoading(false));
    };

    const timelySelect = [
        { title: "Haftalik", value: "getOneWeek" },
        { title: "Oylik", value: "getOneMonth" },
        { title: "Yillik", value: "getOneYear" },
    ];

    return (
        <>
            {totalsum ? (
                <div
                    style={{ marginBottom: "20px" }}
                    className="site-statistic-demo-card"
                >
                    <Row gutter={[10, 10]}>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
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
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
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

export default Outlay;
