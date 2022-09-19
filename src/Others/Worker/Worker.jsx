import { useState } from "react";
import instance from "../../Api/Axios";
import { message } from "antd";
import { useData } from "../../Hook/UseData";
import CustomTable from "../../Module/Table/Table";

const Worker = () => {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const { categoryData } = useData();

    const getWorkers = (current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/api/dry/fruit/worker/page?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                setWorkers(data.data.data.fuelReports);
                setTotalItems(data.data.data.totalItems);
            })
            .catch((error) => {
                console.error(error);
                message.error("Ishchilarni yuklashda muammo bo'ldi");
            })
            .finally(() => setLoading(false));
    };

    const columns = [
        {
            title: "Ishchi nomi",
            dataIndex: "fio",
            key: "fio",
            width: "48%",
            search: true,
        },
        {
            title: "Ishchi nomeri",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            width: "48%",
            search: false,
        },
    ];

    const onCreate = (values) => {
        setLoading(true);
        instance
            .post(
                `api/dry/fruit/api/dry/fruit/worker?fio=${values.fio}&phoneNumber=${values.phoneNumber}`
            )
            .then(function (response) {
                message.success("Ishchi muvaffaqiyatli qo'shildi");
                getWorkers(current - 1, pageSize);
            })
            .catch(function (error) {
                console.error(error);
                message.error("Ishchini qo'shishda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onEdit = (values, initial) => {
        setLoading(true);
        instance
            .put(
                `api/dry/fruit/api/dry/fruit/worker?id=${initial.id}&fio=${values.fio}&phoneNumber=${values.phoneNumber}&deleted=false`
            )
            .then((res) => {
                message.success("Ishchi muvaffaqiyatli taxrirlandi");
                getWorkers(current - 1, pageSize);
            })
            .catch(function (error) {
                console.error("Error in edit: ", error);
                message.error("Ishchini taxrirlashda muammo bo'ldi");
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
                })
                .catch((error) => {
                    console.error(error);
                    message.error("Ishchini o'chirishda muammo bo'ldi");
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

export default Worker;
