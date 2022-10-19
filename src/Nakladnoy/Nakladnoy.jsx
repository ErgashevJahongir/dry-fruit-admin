import { useState } from "react";
import { message } from "antd";
import { useData } from "../Hook/UseData";
import CustomTable from "../Module/Table/Table";
import instance from "../Api/Axios";
import { useNavigate } from "react-router-dom";

const Nakladnoy = () => {
    const [dryFruitWarehouseData, setDryfruitWarehouseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const { dryfruitData, branchData, getDryfruitWareData } = useData();
    const navigate = useNavigate();

    const getWerehouseDryFruit = (current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/dryFruitWarehouse/getAllPageable?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                setDryfruitWarehouseData(data.data.data?.fuelReports);
                setTotalItems(data.data.data?.totalItems);
                getDryfruitWareData();
            })
            .catch((error) => {
                console.error(error);
                message.error("Ombordagi Mevalarni yuklashda muammo bo'ldi");
                if (error.response?.status === 500) navigate("/server-error");
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
            sorter: (a, b) => {
                if (a.branchId < b.branchId) {
                    return -1;
                }
                if (a.branchId > b.branchId) {
                    return 1;
                }
                return 0;
            },
            render: (initealValue) => {
                const branch = branchData?.filter(
                    (item) => item?.id === initealValue
                );
                return branch[0]?.name;
            },
        },
        {
            title: "Quruq meva turi",
            dataIndex: "dryFruitId",
            key: "dryFruitId",
            width: "35%",
            render: (record) => {
                const data = dryfruitData.filter((item) => item.id === record);
                return data[0]?.name;
            },
            sorter: (a, b) => {
                if (a.dryFruitId < b.dryFruitId) {
                    return -1;
                }
                if (a.dryFruitId > b.dryFruitId) {
                    return 1;
                }
                return 0;
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

    const handleDelete = (arr) => {
        setLoading(true);
        arr.map((item) => {
            instance
                .delete(`api/dry/fruit/dryFruitWarehouse/delete${item}`)
                .then((data) => {
                    getWerehouseDryFruit(current - 1, pageSize);
                    message.success(
                        "Quruq meva ombordan muvaffaqiyatli o'chirildi"
                    );
                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    if (error.response?.status === 500)
                        navigate("/server-error");
                    message.error(
                        "Quruq mevani ombordan o'chirishda muammo bo'ldi"
                    );
                });
            return null;
        });
    };

    return (
        <>
            <CustomTable
                onDelete={handleDelete}
                getData={getWerehouseDryFruit}
                columns={columns}
                tableData={dryFruitWarehouseData}
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

export default Nakladnoy;
