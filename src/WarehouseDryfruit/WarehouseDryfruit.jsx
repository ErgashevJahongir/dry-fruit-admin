import { useState } from "react";
import { message } from "antd";
import { useData } from "../Hook/UseData";
import CustomTable from "../Module/Table/Table";
import instance from "../Api/Axios";

const WarehouseDryfruit = () => {
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
                `api/dry/fruit/dryFruitWarehouse/page?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                console.log(data);
                setWorkers(data.data.data.dryFruitWarehouse);
                setTotalItems(data.data.data.totalItems);
            })
            .catch((error) => {
                console.error(error);
                message.error("Mevalarni yuklashda muammo bo'ldi");
            })
            .finally(() => setLoading(false));
    };

    const columns = [
        {
            title: "Meva nomi",
            dataIndex: "name",
            key: "name",
            width: "48%",
            search: true,
        },
        {
            title: "Meva id",
            dataIndex: "id",
            key: "id",
            width: "48%",
            search: false,
        },
    ];

    const onCreate = (values) => {
        setLoading(true);
        const value = {
            ...values,
            incomeTime: values.incomeTime.toISOString(),
            debt: values.debt.target.value,
        };
        instance
            .post("api/dry/fruit/dryFruitWarehouse/", { ...value })
            .then(function (response) {
                message.success("Sotilgan meva muvaffaqiyatli qo'shildi");
                getWorkers(current - 1, pageSize);
            })
            .catch(function (error) {
                console.error(error);
                message.error("Sotilgan mevani qo'shishda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const onEdit = (values, initial) => {
        setLoading(true);
        const time = values.incomeTime.toISOString().substr(0, 10);
        const data = {
            ...values,
            debt: values.debt.target.value,
            incomeTime: time,
            id: initial.id,
        };
        instance
            .put(`api/dry/fruit/dryFruitWarehouse/${initial.id}`, { ...data })
            .then((res) => {
                message.success("Sotilgan meva muvaffaqiyatli taxrirlandi");
                getWorkers(current - 1, pageSize);
            })
            .catch(function (error) {
                console.error("Error in edit: ", error);
                message.error("Sotilgan mevani taxrirlashda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDelete = (arr) => {
        setLoading(true);
        arr.map((item) => {
            instance
                .delete(`api/dry/fruit/dryFruitWarehouse/${item}`)
                .then((data) => {
                    getWorkers(current - 1, pageSize);
                    message.success("Sotilgan meva muvaffaqiyatli o'chirildi");
                })
                .catch((error) => {
                    console.error(error);
                    message.error(
                        "Sotilgan mevani o'chirishda muammo bo'ldi"
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

export default WarehouseDryfruit;


