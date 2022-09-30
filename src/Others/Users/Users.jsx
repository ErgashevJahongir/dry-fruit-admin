import { useState } from "react";
import instance from "../../Api/Axios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import CustomTable from "../../Module/Table/Table";
import { useData } from "../../Hook/UseData";

const Users = () => {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const { roleData, branchData, getUsersData, getWorkerData } = useData();
    const navigate = useNavigate();

    const getWorkers = (current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/api/dry/fruit/user/all-pageable?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                setWorkers(data.data.data?.fuelReports);
                setTotalItems(data.data.data?.totalItems);
                getUsersData();
                getWorkerData();
            })
            .catch((error) => {
                console.error(error);
                if (error.response.status === 500) navigate("/server-error");
                message.error("Foydalanuvchilarni yuklashda muammo bo'ldi");
            })
            .finally(() => setLoading(false));
    };

    const onCreate = (values) => {
        setLoading(true);
        instance
            .post("api/dry/fruit/api/dry/fruit/user/post", {
                ...values,
                deleted: false,
                block: false,
            })
            .then(function (response) {
                message.success("Foydalanuvchi muvaffaqiyatli qo'shildi");
                getWorkers(current - 1, pageSize);
            })
            .catch(function (error) {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("Foydalanuvchini qo'shishda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onEdit = (values, initial) => {
        setLoading(true);
        const val = values?.block === "true" ? true : false;
        instance
            .put(`api/dry/fruit/api/dry/fruit/user/update${initial.id}`, {
                ...values,
                block: val,
                password: null,
                deleted: false,
            })
            .then((res) => {
                message.success("Foydalanuvchi muvaffaqiyatli taxrirlandi");
                getWorkers(current - 1, pageSize);
            })
            .catch(function (error) {
                console.error("Error in edit: ", error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("Foydalanuvchini taxrirlashda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDelete = (arr) => {
        setLoading(true);
        arr.map((item) => {
            instance
                .delete(`api/dry/fruit/api/dry/fruit/user/delete${item}`)
                .then((data) => {
                    getWorkers(current - 1, pageSize);
                    message.success("Foydalanuvchi muvaffaqiyatli o'chirildi");
                })
                .catch((error) => {
                    console.error(error);
                    if (error.response?.status === 500)
                        navigate("/server-error");
                    message.error("Foydalanuvchini o'chirishda muammo bo'ldi");
                });
            return null;
        });
        setLoading(false);
    };

    const getUsersBranches = (value, current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/api/dry/fruit/user/getAllByBranchId${value}?page=${current}&size=${pageSize}`
            )
            .then((item) => {
                setWorkers(item.data.data?.allUsers);
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
            title: "Foydalanuvchi nomi",
            dataIndex: "fio",
            key: "fio",
            width: "20%",
            search: true,
        },
        {
            title: "Foydalanuvchi nomeri",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            width: "20%",
            search: false,
        },
        {
            title: "Ishlash filiali",
            dataIndex: "branchId",
            key: "branchId",
            width: "20%",
            search: false,
            render: (initealValue) => {
                const branch = branchData?.filter(
                    (item) => item?.id === initealValue
                );
                return branch[0]?.name;
            },
        },
        {
            title: "Role",
            dataIndex: "roleId",
            key: "roleId",
            width: "20%",
            search: false,
            render: (initealValue) => {
                const role = roleData?.filter(
                    (item) => item?.id === initealValue
                );
                return role[0]?.name;
            },
        },
        {
            title: "Bloklangan",
            dataIndex: "block",
            key: "block",
            width: "20%",
            search: false,
            render: (record) => {
                return record ? "Ha" : "Yo'q";
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
                pageSizeOptions={[10, 20]}
                loading={loading}
                onEdit={onEdit}
                onCreate={onCreate}
                onDelete={handleDelete}
                getDataBranch={getUsersBranches}
                setLoading={setLoading}
                setCurrent={setCurrent}
                setPageSize={setPageSize}
            />
        </>
    );
};

export default Users;
