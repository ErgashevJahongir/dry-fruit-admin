import { useState } from "react";
import instance from "../../Api/Axios";
import { message } from "antd";
import { useData } from "../../Hook/UseData";
import CustomTable from "../../Module/Table/Table";

const Users = () => {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const { categoryData, branch, role } = useData();

    const getWorkers = (current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/api/dry/fruit/user/all-pageable?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                setWorkers(data.data.data.fuelReports);
                setTotalItems(data.data.data.totalItems);
            })
            .catch((error) => {
                console.error(error);
                message.error("Foydalanuvchilarni yuklashda muammo bo'ldi");
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
        // {
        //     title: "Foydalanuvchi passwordi",
        //     dataIndex: "password",
        //     key: "password",
        //     width: "20%",
        //     search: false,
        // },
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
            // render: (record) => {
                //         const fuel = branch.filter((item) => item.id === record);
                //         return fuel[0]?.name;
                //     },
        },
        {
            title: "Role",
            dataIndex: "roleId",
            key: "roleId",
            width: "20%",
            search: false,
        //     render: (record) => {
        //         const fuel = role.filter((item) => item.id === record);
        //         return fuel[0]?.name;
        //     },
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

    const onCreate = (values) => {
        setLoading(true);
        instance
            .post("api/dry/fruit/api/dry/fruit/user/post", {
                ...values,
                roleId: 3,
                deleted: false,
            })
            .then(function (response) {
                message.success("Foydalanuvchi muvaffaqiyatli qo'shildi");
                getWorkers(current - 1, pageSize);
            })
            .catch(function (error) {
                console.error(error);
                message.error("Foydalanuvchini qo'shishda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onEdit = (values, initial) => {
        console.log(initial.id);
        setLoading(true);
        const blocked = values.block === "true" ? true : false;
        instance
            .put(`api/dry/fruit/api/dry/fruit/user/update${initial.id}`, {
                ...values,
                deleted: false,
                block: blocked,
            })
            .then((res) => {
                message.success("Foydalanuvchi muvaffaqiyatli taxrirlandi");
                getWorkers(current - 1, pageSize);
            })
            .catch(function (error) {
                console.error("Error in edit: ", error);
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
                    message.error("Foydalanuvchini o'chirishda muammo bo'ldi");
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
                getData={getWorkers}
                columns={columns}
                tableData={workers}
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

export default Users;

