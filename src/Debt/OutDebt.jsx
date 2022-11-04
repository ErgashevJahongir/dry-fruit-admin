import { useState } from "react";
import instance from "../Api/Axios";
import { message } from "antd";
import CustomTable from "../Module/Table/Table";
import moment from "moment/moment";
import { useData } from "../Hook/UseData";

const OutDebt = () => {
    const [debts, setDebts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const { dryfruitData, usersData, branchData, clientData } = useData();

    const getDebts = (current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/debt/get-outcome?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                let value = data.data?.data?.debts?.map((df) => {
                    const createdDate = moment(df.createdDate).format(
                        "DD-MM-YYYY"
                    );
                    return {
                        ...df,
                        createdDate: createdDate,
                    };
                });
                setDebts(value);
                setTotalItems(data.data?.data?.totalItems);
            })
            .catch((error) => {
                console.error(error);
                message.error("Tashqi qarzni yuklashda muammo bo'ldi");
            })
            .finally(() => setLoading(false));
    };

    const onEdit = (values, initial) => {
        console.log(initial);
        setLoading(true);
        const val = values.given === "true" ? true : false;
        instance
            .put(`api/dry/fruit/debt/update${initial.id}`, {
                ...values,
                clientId: initial.clientId,
                branchId: initial.branchId,
                given: val,
                date: null,
                workerId: null,
                incomeDryFruitId: null,
            })
            .then(function (response) {
                message.success("Tashqi qarz muvofaqiyatli qo'shildi");
                getDebts(current - 1, pageSize);
            })
            .catch(function (error) {
                console.error(error);
                message.error("Tashqi qarzni qo'shishda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const columns = [
        {
            title: "Qarzdor klient",
            dataIndex: "clientId",
            key: "clientId",
            width: "20%",
            search: false,
            render: (record) => {
                const name = clientData?.filter((item) => item.id === record);
                return name[0]?.fio;
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
            title: "Qarzdor bergan filial",
            dataIndex: "branchId",
            key: "branchId",
            width: "20%",
            search: false,
            render: (record) => {
                const name = branchData?.filter((item) => item.id === record);
                return name[0]?.name;
            },
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
            title: "Qarz beruvchi",
            dataIndex: "createdBy",
            key: "createdBy",
            width: "20%",
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
            title: "Olingan vaqt",
            dataIndex: "createdDate",
            key: "createdDate",
            width: "20%",
            search: false,
            sorter: (a, b) => {
                if (a.createdDate < b.createdDate) {
                    return -1;
                }
                if (a.createdDate > b.createdDate) {
                    return 1;
                }
                return 0;
            },
        },
        {
            title: "Qarz miqdori",
            dataIndex: "borrowAmount",
            key: "borrowAmount",
            width: "10%",
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
            title: "To'liq uzilganmi",
            dataIndex: "given",
            key: "given",
            width: "10%",
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
            <h3>Klientlar qarzlari</h3>
            <CustomTable
                onEdit={onEdit}
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

export default OutDebt;
