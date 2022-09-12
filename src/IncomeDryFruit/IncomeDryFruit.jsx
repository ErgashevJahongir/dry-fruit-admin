import { useState } from "react";
import instance from "../Api/Axios";
import moment from "moment";
import { message } from "antd";
import CustomTable from "../Module/Table/Table";
import { useNavigate } from "react-router-dom";
import { useData } from "../Hook/UseData";

const IncomeDryFruit = () => {
    const [incomeFuel, setIncomeFuel] = useState([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const { newDryFruitData, measurementData, dryfruitWarehouseData } =
        useData();
    const navigate = useNavigate();

    const getIncomeDryFruits = (current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/incomeDryFruit/getAllPageable?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                const fuel = data.data.data.dryFruit.map((item) => {
                    console.log(item);
                    return {
                        ...item,
                        date: moment(item.date).format("DD-MM-YYYY"),
                    };
                });
                setIncomeFuel(fuel);
                setTotalItems(data.data.data.totalItems);
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
                const data = dryfruitWarehouseData.filter(
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
            debt: values.debt.target.value,
        };
        instance
            .post("api/dry/fruit/incomeDryFruit/add", { ...value })
            .then(function (response) {
                message.success("Kelgan quruq meva muvaffaqiyatli qo'shildi");
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
