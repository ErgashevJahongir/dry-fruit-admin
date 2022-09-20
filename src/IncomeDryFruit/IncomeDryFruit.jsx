import { useState } from "react";
import instance from "../Api/Axios";
import moment from "moment";
import { Card, Col, message, Row, Statistic } from "antd";
import CustomTable from "../Module/Table/Table";
import { useNavigate } from "react-router-dom";
import { useData } from "../Hook/UseData";
import { ArrowDownOutlined } from "@ant-design/icons";

const IncomeDryFruit = () => {
    const [incomeFuel, setIncomeFuel] = useState([]);
    const [totalsum, setTotalsum] = useState();
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const {
        newDryFruitData,
        measurementData,
        newDryFruitWerehouseData,
        qarzValue,
    } = useData();
    const navigate = useNavigate();

    const getIncomeDryFruits = (current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/incomeDryFruit/getAllPageable?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                console.log(data);
                // const fuel =
                //     data.data.data[0].totalIncomeDryFruit.incomeDryFruitGetDtoList.map(
                //         (item) => {
                //             return {
                //                 ...item,
                //                 date: moment(item.date).format("DD-MM-YYYY"),
                //             };
                //         }
                //     );
                // setTotalsum(data.data.data[0].totalIncomeDryFruit.totalSumma);
                // setIncomeFuel(fuel);
                // setTotalItems(data.data.data[0].totalItems);
            })
            .catch((error) => {
                console.error(error);
                if (error.response.status === 500) navigate("/server-error");
                message.error("Kelgan quruq mevalarni yuklashda muammo bo'ldi");
            })
            .finally(() => setLoading(false));
    };

    const columns = [
        {
            title: "Ombordagi quruq meva",
            dataIndex: "dryFruitWarehouseId",
            key: "dryFruitWarehouseId",
            width: "20%",
            render: (record) => {
                const data = newDryFruitWerehouseData.filter(
                    (item) => item.id === record
                );
                return data[0]?.name;
            },
            search: false,
        },
        {
            title: "Quruq meva turi",
            dataIndex: "dryFruitId",
            key: "dryFruitId",
            width: "15%",
            render: (record) => {
                const data = newDryFruitData.filter(
                    (item) => item.id === record
                );
                return data[0]?.name;
            },
            search: false,
        },
        {
            title: "O'lchovi",
            dataIndex: "measurementId",
            key: "measurementId",
            width: "15%",
            render: (record) => {
                const data = measurementData.filter(
                    (item) => item.id === record
                );
                return data[0]?.name;
            },
            search: false,
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
            title: "Kelish narxi",
            dataIndex: "price",
            key: "price",
            width: "15%",
            search: false,
        },
        {
            title: "Kelish vaqti",
            dataIndex: "date",
            key: "date",
            width: "15%",
            search: false,
        },
        {
            title: "Qarzdorlik",
            dataIndex: "debt",
            key: "debt",
            width: "10%",
            search: false,
            render: (record) => {
                return record ? "Bor" : "Yo'q";
            },
        },
    ];

    const onCreate = (values) => {
        setLoading(true);
        const value = {
            ...values,
            date: values.date.toISOString(),
            debt: values.debt.target.value === "false" ? false : true,
        };
        instance
            .post("api/dry/fruit/incomeDryFruit/add", { ...value })
            .then(function (response) {
                message.success("Kelgan quruq meva muvofaqiyatli qo'shildi");
                instance
                    .post("api/dry/fruit/debt/post", {
                        incomeDryFruitId: response.data.data,
                        workerId: null,
                        outcomeDryFruitId: null,
                        given: false,
                        borrowAmount: values.price * values.amount - qarzValue,
                    })
                    .then((res) => {
                        console.log(res);
                    })
                    .catch((err) => console.error(err));
                getIncomeDryFruits(current - 1, pageSize);
            })
            .catch(function (error) {
                console.error(error);
                if (error.response.status === 500) navigate("/server-error");
                message.error("Kelgan quruq mevani qo'shishda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onEdit = (values, initial) => {
        setLoading(true);
        const time = moment(values.date, "DD-MM-YYYY").toISOString();
        const data = {
            ...values,
            debt: values.debt.target.value,
            date: time,
        };
        instance
            .put(`api/dry/fruit/incomeDryFruit/update${initial.id}`, {
                ...data,
            })
            .then((res) => {
                message.success("Kelgan quruq meva muvaffaqiyatli taxrirlandi");
                getIncomeDryFruits(current - 1, pageSize);
            })
            .catch(function (error) {
                console.error("Error in edit: ", error);
                if (error.response.status === 500) navigate("/server-error");
                message.error("Kelgan quruq mevani taxrirlashda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
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
                    if (error.response.status === 500)
                        navigate("/server-error");
                    message.error(
                        "Kelgan quruq mevani o'chirishda muammo bo'ldi"
                    );
                });
            return null;
        });
        setLoading(false);
    };

    return (
        <>
            {totalsum ? (
                <div className="site-statistic-demo-card">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Card>
                                <Statistic
                                    title="Jami sarflangan pul"
                                    value={totalsum}
                                    valueStyle={{
                                        color: "#cf1322",
                                    }}
                                    prefix={<ArrowDownOutlined />}
                                    suffix="so'm"
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
                getData={getIncomeDryFruits}
                columns={columns}
                tableData={incomeFuel}
                current={current}
                pageSize={pageSize}
                totalItems={totalItems}
                loading={loading}
                setLoading={setLoading}
                setCurrent={setCurrent}
                setPageSize={setPageSize}
                pageSizeOptions={[10, 20]}
            />
        </>
    );
};

export default IncomeDryFruit;
