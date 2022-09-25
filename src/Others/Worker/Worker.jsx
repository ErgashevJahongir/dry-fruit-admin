import { useState } from "react";
import instance from "../../Api/Axios";
import { useNavigate } from "react-router-dom";
import { useData } from "../../Hook/UseData";
import CustomTable from "../../Module/Table/Table";
import { message } from "antd";

const Worker = () => {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const { branchData, getWorkerData } = useData();
    const navigate = useNavigate();

    const getWorkers = (current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/api/dry/fruit/worker/page?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                setWorkers(data.data.data?.fuelReports);
                setTotalItems(data.data.data?.totalItems);
            })
            .catch((error) => {
                console.error(error);
                message.error("Ishchilarni yuklashda muammo bo'ldi");
                if (error.response?.status === 500) navigate("/server-error");
            })
            .finally(() => setLoading(false));
    };

    const onCreate = (values) => {
        setLoading(true);
        instance
            .post(
                `api/dry/fruit/api/dry/fruit/worker?fio=${values.fio}&phoneNumber=${values.phoneNumber}&branchId=${values.branchId}`
            )
            .then(function (response) {
                message.success("Ishchi muvaffaqiyatli qo'shildi");
                getWorkers(current - 1, pageSize);
                getWorkerData();
            })
            .catch(function (error) {
                console.error(error);
                message.error("Ishchini qo'shishda muammo bo'ldi");
                if (error.response?.status === 500) navigate("/server-error");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onEdit = (values, initial) => {
        setLoading(true);
        instance
            .put(
                `api/dry/fruit/api/dry/fruit/worker?id=${initial.id}&fio=${values.fio}&phoneNumber=${values.phoneNumber}&branchId=${values.branchId}&deleted=false`
            )
            .then((res) => {
                message.success("Ishchi muvaffaqiyatli taxrirlandi");
                getWorkers(current - 1, pageSize);
                getWorkerData();
            })
            .catch(function (error) {
                console.error("Error in edit: ", error);
                message.error("Ishchini taxrirlashda muammo bo'ldi");
                if (error.response?.status === 500) navigate("/server-error");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDelete = (arr) => {
        setLoading(true);
        arr.map((item) => {
            instance
                .delete(`api/dry/fruit/api/dry/fruit/worker/${item}`)
                .then((data) => {
                    getWorkers(current - 1, pageSize);
                    message.success("Ishchi muvaffaqiyatli o'chirildi");
                    getWorkerData();
                })
                .catch((error) => {
                    console.error(error);
                    message.error("Ishchini o'chirishda muammo bo'ldi");
                    if (error.response?.status === 500)
                        navigate("/server-error");
                });
            return null;
        });
        setLoading(false);
    };

    const getWorkersBranches = (value, current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/api/dry/fruit/worker/getAllByBranchId${value}?page=${current}&size=${pageSize}`
            )
            .then((item) => {
                setWorkers(item.data.data?.allWorkers);
                setTotalItems(item.data.data?.totalItems);
            })
            .catch((err) => {
                console.error(err);
                if (err.response?.status === 500) navigate("/server-error");
            })
            .finally(() => setLoading(false));
    };

    const columns = [
        {
            title: "Ishchi nomi",
            dataIndex: "fio",
            key: "fio",
            width: "33%",
            search: true,
        },
        {
            title: "Ishchi nomeri",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            width: "33%",
            search: false,
        },
        {
            title: "Ishlash filiali",
            dataIndex: "branchId",
            key: "branchId",
            width: "33%",
            search: false,
            render: (initealValue) => {
                const branch = branchData?.filter(
                    (item) => item?.id === initealValue
                );
                return branch[0]?.name;
            },
        },
    ];

    return (
        <>
            <CustomTable
                getData={getWorkers}
                columns={columns}
                tableData={workers}
                current={current}
                pageSize={pageSize}
                totalItems={totalItems}
                loading={loading}
                pageSizeOptions={[10, 20]}
                onEdit={onEdit}
                onCreate={onCreate}
                onDelete={handleDelete}
                getDataBranch={getWorkersBranches}
                setLoading={setLoading}
                setCurrent={setCurrent}
                setPageSize={setPageSize}
            />
        </>
    );
};

export default Worker;
