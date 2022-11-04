import { message } from "antd";
import moment from "moment";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../Api/Axios";
import { useData } from "../Hook/UseData";
import CustomTable from "../Module/Table/Table";

const WorkerDebt = () => {
    const [debts, setDebts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const { workerData, usersData, getWorkerData } = useData();
    const navigate = useNavigate();

    const getDebts = (current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/debt/get-worker?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                console.log(data);
                const value = [
                    ...data.data?.data?.debts.map((item) => {
                        return {
                            ...item,
                            deadline: moment(item.deadline).format(
                                "DD-MM-YYYY"
                            ),
                        };
                    }),
                ];
                setDebts(value);
                setTotalItems(data.data?.data?.totalItems);
                getWorkerData();
            })
            .catch((error) => {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("Ishchi qarzlarni yuklashda muammo bo'ldi");
            })
            .finally(() => setLoading(false));
    };

    const onCreate = (values) => {
        setLoading(true);
        instance
            .post("api/dry/fruit/debt/post", {
                ...values,
                incomeDryFruitId: null,
            })
            .then(function (response) {
                message.success("Ishchi qarzlari muvofaqiyatli qo'shildi");
                getDebts(current - 1, pageSize);
            })
            .catch(function (error) {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("Ishchi qarzini qo'shishda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onEdit = (values, initial) => {
        const val = values.given === "true" ? true : false;
        setLoading(true);
        const deadline = moment(values.deadline, "DD-MM-YYYY").toISOString();
        instance
            .put(`api/dry/fruit/debt/update${initial.id}`, {
                ...values,
                incomeDryFruitId: null,
                deadline: deadline,
                given: val,
            })
            .then(function (response) {
                message.success("Ishchi qarzi muvofaqiyatli qo'shildi");
                getDebts(current - 1, pageSize);
            })
            .catch(function (error) {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("Ishchi qarzni qo'shishda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const columns = [
        {
            title: "Qarzdor",
            dataIndex: "workerId",
            key: "workerId",
            width: "25%",
            search: false,
            render: (record) => {
                const name = workerData?.filter((item) => item.id === record);
                return name[0]?.fio;
            },
            sorter: (a, b) => {
                if (a.workerId < b.workerId) {
                    return -1;
                }
                if (a.workerId > b.workerId) {
                    return 1;
                }
                return 0;
            },
        },
        {
            title: "Qarz miqdori",
            dataIndex: "borrowAmount",
            key: "borrowAmount",
            width: "15%",
            search: false,
            sorter: (a, b) => {
                if (a.borrowAmount < b.borrowAmount) {
                    return -1;
                }
                if (a.borrowAmount > b.borrowAmount) {
                    return 1;
                }
                return 0;
            },
        },
        {
            title: "Qarz beruvchi",
            dataIndex: "createdBy",
            key: "createdBy",
            width: "25%",
            search: false,
            render: (record) => {
                const name = usersData?.filter((item) => item.id === record);
                return name[0]?.fio;
            },
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
            title: "Qaytarish vaqti",
            dataIndex: "deadline",
            key: "deadline",
            width: "20%",
            search: false,
        },
        {
            title: "To'liq uzilganmi",
            dataIndex: "given",
            key: "given",
            width: "14%",
            search: false,
            sorter: (a, b) => {
                if (a.given < b.given) {
                    return -1;
                }
                if (a.given > b.given) {
                    return 1;
                }
                return 0;
            },
            render: (record) => {
                return record ? "Ha" : "Yo'q";
            },
        },
    ];

    return (
        <>
            <h3>Ishchilar qarzlari</h3>
            <CustomTable
                onEdit={onEdit}
                onCreate={onCreate}
                getData={getDebts}
                columns={columns}
                tableData={debts}
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

export default WorkerDebt;
