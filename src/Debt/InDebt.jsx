import { useState } from "react";
import instance from "../Api/Axios";
import { message } from "antd";
import CustomTable from "../Module/Table/Table";
import moment from "moment/moment";
import { useData } from "../Hook/UseData";

const InDebt = () => {
    const [debts, setDebts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const { usersData, branchData, dryfruitData } = useData();

    const getDebts = (current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/debt/get-income?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                console.log(data);
                const value = data.data.data.debts.map((item) => {
                    return {
                        ...item,
                    };
                });
                setDebts(value);
                setTotalItems(data.data.data.totalItems);
            })
            .catch((error) => {
                console.error(error);
                message.error("Ichki qarzlarni yuklashda muammo bo'ldi");
            })
            .finally(() => setLoading(false));
    };

    const onCreate = (values) => {
        setLoading(true);
        instance
            .post("api/dry/fruit/debt/post", {
                ...values,
                outcomeDryFruitId: null,
                workerId: null,
            })
            .then(function (response) {
                message.success("Ichki qarz muvofaqiyatli qo'shildi");
                getDebts(current - 1, pageSize);
            })
            .catch(function (error) {
                console.error(error);
                message.error("Ichki qarzni qo'shishda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onEdit = (values, initial) => {
        const val = values.given === "true" ? true : false;
        setLoading(true);
        const givenTime = moment(values.givenTime, "DD-MM-YYYY").toISOString();
        const returnTime = moment(
            values.returnTime,
            "DD-MM-YYYY"
        ).toISOString();
        instance
            .put(`api/dry/fruit/debt/update${initial.id}`, {
                ...values,
                lenderId: null,
                givenTime: givenTime,
                returnTime: returnTime,
                given: val,
            })
            .then(function (response) {
                message.success("Ichki qarz muvofaqiyatli qo'shildi");
                getDebts(current - 1, pageSize);
            })
            .catch(function (error) {
                console.error(error);
                message.error("Ichki qarzni qo'shishda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDelete = (arr) => {
        setLoading(true);
        arr.map((item) => {
            instance
                .delete(`api/oil/station/debt/delete${item}`)
                .then((data) => {
                    message.success("Ichki qarz muvofaqiyatli o'chirildi");
                    getDebts(current - 1, pageSize);
                })
                .catch((error) => {
                    console.error(error);
                    message.error("Ichki qarzni o'chirishda muammo bo'ldi");
                });
            return null;
        });
        setLoading(false);
    };

    const columns = [
        {
            title: "Qarzdor filial",
            dataIndex: "branchId",
            key: "branchId",
            width: "20%",
            search: false,
            render: (record) => {
                const name = branchData?.filter((item) => item.id === record);
                return name[0]?.name;
            },
        },
        {
            title: "Qarz oluvchi",
            dataIndex: "createdBy",
            key: "createdBy",
            width: "15%",
            search: false,
            render: (record) => {
                const name = usersData?.filter((item) => item.id === record);
                return name[0]?.fio;
            },
        },
        {
            title: "Qarz olingan mahsulot",
            dataIndex: "dryFruitId",
            key: "dryFruitId",
            width: "15%",
            search: false,
            render: (record) => {
                const name = dryfruitData?.filter((item) => item.id === record);
                return name[0]?.name;
            },
        },
        {
            title: "Qarz miqdori",
            dataIndex: "borrowAmount",
            key: "borrowAmount",
            width: "15%",
            search: false,
        },
        {
            title: "Berilgan vaqt",
            dataIndex: "givenTime",
            key: "givenTime",
            width: "20%",
            search: false,
        },
        {
            title: "To'liq uzilganmi",
            dataIndex: "given",
            key: "given",
            width: "15%",
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
            <h3>Ichki qarzlari</h3>
            <CustomTable
                onEdit={onEdit}
                onCreate={onCreate}
                getData={getDebts}
                onDelete={handleDelete}
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

export default InDebt;
