import { useState } from "react";
import instance from "../../Api/Axios";
import { useNavigate } from "react-router-dom";
import CustomTable from "../../Module/Table/Table";
import { useData } from "../../Hook/UseData";
import { message } from "antd";

const DryFruitLimit = () => {
    const [dryFruitLimit, setDryFruitLimit] = useState([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const { dryfruitData } = useData();
    const navigate = useNavigate();

    const getDryFruitLimit = (current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/limitOfDryFruit/page?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                setDryFruitLimit(data.data.data?.notifications);
                setTotalItems(data.data.data?.totalItems);
            })
            .catch((error) => {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("Quruq meva limitilarni yuklashda muammo bo'ldi");
            })
            .finally(() => setLoading(false));
    };

    const columns = [
        {
            title: "Mahsulot kategoriyasi",
            dataIndex: "dryFruitId",
            key: "dryFruitId",
            width: "50%",
            render: (id) => {
                const data = dryfruitData.filter((item) => item.id === id);
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
            title: "Mahsulot nomi",
            dataIndex: "limit",
            key: "limit",
            width: "49%",
            search: true,
            sorter: (a, b) => {
                if (a.limit < b.limit) {
                    return -1;
                }
                if (a.limit > b.limit) {
                    return 1;
                }
                return 0;
            },
        },
    ];

    const onCreate = (values) => {
        setLoading(true);
        instance
            .post("api/dry/fruit/limitOfDryFruit", { ...values })
            .then(function (response) {
                message.success("Quruq meva limiti muvaffaqiyatli qo'shildi");
                getDryFruitLimit(current - 1, pageSize);
            })
            .catch(function (error) {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("Quruq meva limitini qo'shishda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onEdit = (values, initial) => {
        setLoading(true);
        instance
            .put(
                `api/dry/fruit/limitOfDryFruit/update?id=${initial.id}&limit=${values.limit}`
            )
            .then((res) => {
                message.success("Quruq meva limiti muvaffaqiyatli taxrirlandi");
                getDryFruitLimit(current - 1, pageSize);
            })
            .catch(function (error) {
                console.error("Error in edit: ", error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("Quruq meva limitini taxrirlashda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <CustomTable
                onEdit={onEdit}
                onCreate={onCreate}
                getData={getDryFruitLimit}
                columns={columns}
                tableData={dryFruitLimit}
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

export default DryFruitLimit;
