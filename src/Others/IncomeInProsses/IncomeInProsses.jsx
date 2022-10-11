import { useState } from "react";
import instance from "../../Api/Axios";
import moment from "moment";
import { message } from "antd";
import CustomTable from "../../Module/Table/Table";
import { useNavigate } from "react-router-dom";
import { useData } from "../../Hook/UseData";

const IncomeInProsses = () => {
    const [incomeDryFruit, setIncomeDryFruit] = useState([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const { dryfruitData, countryData } = useData();
    const navigate = useNavigate();

    const getIncomeDryFruits = (current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/incomeInProcess/page?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                setIncomeDryFruit(
                    data.data?.data?.incomeInProcesses.map((item) => {
                        return {
                            ...item,
                            startDate: moment(item.startDate).format(
                                "DD-MM-YYYY"
                            ),
                            arrivalDate: moment(item.arrivalDate).format(
                                "DD-MM-YYYY"
                            ),
                        };
                    })
                );
                setTotalItems(data.data?.data?.totalItems);
            })
            .catch((error) => {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error(
                    "Kelayotgan quruq mevalarni yuklashda muammo bo'ldi"
                );
            })
            .finally(() => setLoading(false));
    };

    const columns = [
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
            title: "Narxi",
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
            title: "Jami narx",
            dataIndex: "totalPrice",
            key: "totalPrice",
            width: "15%",
            search: false,
            sorter: (a, b) => {
                if (a.totalPrice < b.totalPrice) {
                    return -1;
                }
                if (a.totalPrice > b.totalPrice) {
                    return 1;
                }
                return 0;
            },
        },
        {
            title: "Kelish davlati",
            dataIndex: "countryId",
            key: "countryId",
            width: "15%",
            search: false,
            render: (record) => {
                const data = countryData?.filter((item) => item.id === record);
                return data[0]?.name;
            },
            sorter: (a, b) => {
                if (a.countryId < b.countryId) {
                    return -1;
                }
                if (a.countryId > b.countryId) {
                    return 1;
                }
                return 0;
            },
        },
        {
            title: "Yo'lga chiqish vaqti",
            dataIndex: "startDate",
            key: "startDate",
            width: "15%",
            search: false,
            sorter: (a, b) => {
                if (a.startDate < b.startDate) {
                    return -1;
                }
                if (a.startDate > b.startDate) {
                    return 1;
                }
                return 0;
            },
        },
        {
            title: "Yetib kelish vaqti",
            dataIndex: "arrivalDate",
            key: "arrivalDate",
            width: "15%",
            search: false,
            sorter: (a, b) => {
                if (a.arrivalDate < b.arrivalDate) {
                    return -1;
                }
                if (a.arrivalDate > b.arrivalDate) {
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
            startDate: moment(values.startDate, "DD-MM-YYYY").toISOString(),
            arrivalDate: moment(values.arrivalDate, "DD-MM-YYYY").toISOString(),
        };
        instance
            .post("api/dry/fruit/incomeInProcess", { ...value })
            .then(function (response) {
                getIncomeDryFruits(current - 1, pageSize);
                message.success(
                    "Kelayotgan quruq meva muvaffaqiyatli qo'shildi"
                );
            })
            .catch(function (error) {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error(
                    "Kelayotgan quruq mevani qo'shishda muammo bo'ldi"
                );
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onEdit = (values, initial) => {
        setLoading(true);
        const value = {
            ...values,
            startDate: moment(values.startDate, "DD-MM-YYYY").toISOString(),
            arrivalDate: moment(values.arrivalDate, "DD-MM-YYYY").toISOString(),
        };
        instance
            .put(`api/dry/fruit/incomeInProcess/edit?id=${initial.id}`, {
                ...value,
            })
            .then((res) => {
                message.success(
                    "Kelayotgan quruq meva muvaffaqiyatli taxrirlandi"
                );
                getIncomeDryFruits(current - 1, pageSize);
            })
            .catch(function (error) {
                console.error("Error in edit: ", error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error(
                    "Kelayotgan quruq mevani taxrirlashda muammo bo'ldi"
                );
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const getIncomeDryFruitsTimely = (value, current, pageSize) => {
        setLoading(true);
        instance
            .get(`api/dry/fruit/incomeInProcess/dryFruit?dryFruitId=${value}`)
            .then((data) => {
                setIncomeDryFruit(
                    data.data?.data?.map((item) => {
                        return {
                            ...item,
                            startDate: moment(item.startDate).format(
                                "DD-MM-YYYY"
                            ),
                            arrivalDate: moment(item.arrivalDate).format(
                                "DD-MM-YYYY"
                            ),
                        };
                    })
                );
            })
            .catch((error) => {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error(
                    "Kelayotgan quruq mevalarni yuklashda muammo bo'ldi"
                );
            })
            .finally(() => setLoading(false));
    };

    const timelySelect = dryfruitData.map((data) => {
        return { title: data.name, value: data.id };
    });

    return (
        <>
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
                getDataTimely={getIncomeDryFruitsTimely}
                setLoading={setLoading}
                setCurrent={setCurrent}
                setPageSize={setPageSize}
            />
        </>
    );
};

export default IncomeInProsses;
