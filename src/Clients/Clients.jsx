import { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../Api/Axios";
import { useData } from "../Hook/UseData";
import CustomTable from "../Module/Table/Table";
import { message } from "antd";

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const { getClientData } = useData();
    const navigate = useNavigate();

    const getClients = (current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/api/dry/fruit/client/pageable?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                setClients(data.data.data?.fuelReports);
                setTotalItems(data.data.data?.totalItems);
            })
            .catch((error) => {
                console.error(error);
                if (error?.response?.status === 500) navigate("/server-error");
                message.error("Klientlarni yuklashda muammo bo'ldi");
            })
            .finally(() => setLoading(false));
    };

    const onCreate = (values) => {
        setLoading(true);
        instance
            .post(
                `api/dry/fruit/api/dry/fruit/client?fio=${values.fio}&phoneNumber=${values.phoneNumber}&address=${values.address}`
            )
            .then(function (response) {
                message.success("Klient muvaffaqiyatli qo'shildi");
                getClients(current - 1, pageSize);
                getClientData();
            })
            .catch(function (error) {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("Klientni qo'shishda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onEdit = (values, initial) => {
        setLoading(true);
        instance
            .put(
                `api/dry/fruit/api/dry/fruit/client?id=${initial.id}&fio=${values.fio}&phoneNumber=${values.phoneNumber}&address=${values.address}&deleted=false`
            )
            .then((res) => {
                message.success("Klient muvaffaqiyatli taxrirlandi");
                getClients(current - 1, pageSize);
                getClientData();
            })
            .catch(function (error) {
                console.error("Error in edit: ", error);
                if (error?.response?.status === 500) navigate("/server-error");
                message.error("Klientni taxrirlashda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDelete = (arr) => {
        setLoading(true);
        arr.map((item) => {
            instance
                .delete(`api/dry/fruit/api/dry/fruit/client/${item}`)
                .then((data) => {
                    getClients(current - 1, pageSize);
                    message.success("Klient muvaffaqiyatli o'chirildi");
                    getClientData();
                })
                .catch((error) => {
                    console.error(error);
                    if (error?.response?.status === 500)
                        navigate("/server-error");
                    message.error("Klientni o'chirishda muammo bo'ldi");
                })
                .finally(() => setLoading(false));
            return null;
        });
    };

    const columns = [
        {
            title: "Klient nomi",
            dataIndex: "fio",
            key: "fio",
            width: "33%",
            search: true,
        },
        {
            title: "Klient nomeri",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            width: "33%",
            search: false,
        },
        {
            title: "Klient addressi",
            dataIndex: "address",
            key: "address",
            width: "33%",
            search: false,
            sorter: (a, b) => {
                if (a.address < b.address) {
                    return -1;
                }
                if (a.address > b.address) {
                    return 1;
                }
                return 0;
            },
        },
    ];

    return (
        <>
            <CustomTable
                getData={getClients}
                columns={columns}
                tableData={clients}
                current={current}
                pageSize={pageSize}
                totalItems={totalItems}
                loading={loading}
                pageSizeOptions={[10, 20]}
                onEdit={onEdit}
                onCreate={onCreate}
                onDelete={handleDelete}
                setLoading={setLoading}
                setCurrent={setCurrent}
                setPageSize={setPageSize}
            />
        </>
    );
};

export default Clients;
