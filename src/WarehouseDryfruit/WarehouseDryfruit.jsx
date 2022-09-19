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
    const { categoryData, newDryFruitData } = useData();

    const getWorkers = (current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/dryFruitWarehouse/getAllPageable?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                setWorkers(data.data.data.fuelReports);
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
            title: "Filial",
            dataIndex: "branchId",
            key: "branchId",
            width: "35%",
            search: false,
        },
        {
            title: "Quruq meva turi",
            dataIndex: "dryFruitId",
            key: "dryFruitId",
            width: "35%",
            render: (record) => {
                const data = newDryFruitData.filter(
                    (item) => item.id === record
                );
                return data[0]?.name;
            },
            search: false,
        },
        {
            title: "Miqdori",
            dataIndex: "amount",
            key: "amount",
            width: "30%",
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
    ];

    const onCreate = (values) => {
        setLoading(true);
        instance
            .post("api/dry/fruit/dryFruitWarehouse/add", { ...values })
            .then(function (response) {
                message.success("Quruq meva omborga muvaffaqiyatli qo'shildi");
                getWorkers(current - 1, pageSize);
            })
            .catch(function (error) {
                console.error(error);
                message.error("Quruq mevani omborga qo'shishda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const onEdit = (values, initial) => {
        setLoading(true);
        instance
            .put(`api/dry/fruit/dryFruitWarehouse/update${initial.id}`, { ...values })
            .then((res) => {
                message.success("Quruq meva muvaffaqiyatli taxrirlandi");
                getWorkers(current - 1, pageSize);
            })
            .catch(function (error) {
                console.error("Error in edit: ", error);
                message.error("Quruq mevani taxrirlashda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDelete = (arr) => {
        setLoading(true);
        arr.map((item) => {
            instance
                .delete(`api/dry/fruit/dryFruitWarehouse/delete${item}`)
                .then((data) => {
                    getWorkers(current - 1, pageSize);
                    message.success("Quruq meva ombordan muvaffaqiyatli o'chirildi");
                })
                .catch((error) => {
                    console.error(error);
                    message.error(
                        "Quruq mevani ombordan o'chirishda muammo bo'ldi"
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


