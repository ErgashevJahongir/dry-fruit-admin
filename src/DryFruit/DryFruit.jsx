import { useState } from "react";
import instance from "../Api/Axios";
import { useNavigate } from "react-router-dom";
import CustomTable from "../Module/Table/Table";
import { useData } from "../Hook/UseData";
import { message } from "antd";

const DryFruit = () => {
    const [dryFruits, setDryFruits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const { categoryData, countryData, getDryfruitData, user } = useData();
    const navigate = useNavigate();

    const getDryFruits = (current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `api/dry/fruit/dryFruit/getAllPageable?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                setDryFruits(data.data.data?.dryFruit);
                setTotalItems(data.data.data?.totalItems);
            })
            .catch((error) => {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("Quruq mevalarni yuklashda muammo bo'ldi");
            })
            .finally(() => setLoading(false));
    };

    const columns = [
        {
            title: "Mahsulot nomi",
            dataIndex: "name",
            key: "name",
            width: "20%",
            search: true,
        },
        {
            title: "Mahsulot kategoriyasi",
            dataIndex: "categoryId",
            key: "categoryId",
            width: "20%",
            render: (id) => {
                const data = categoryData.filter((item) => item.id === id);
                return data[0]?.name;
            },
            sorter: (a, b) => {
                if (a.categoryId < b.categoryId) {
                    return -1;
                }
                if (a.categoryId > b.categoryId) {
                    return 1;
                }
                return 0;
            },
            search: false,
        },
        {
            title: "Yuk keluvchi davlat",
            dataIndex: "countryId",
            key: "countryId",
            width: "20%",
            render: (id) => {
                const data = countryData.filter((item) => item.id === id);
                return data[0]?.name;
            },
            sorter: (a, b) => {
                if (a.countryId < b.countryId) {
                    return -1;
                }
                if (a.countryId > b.countryId) {
                    return 1;
                }
                return 0;
            },
            search: false,
        },
        user.roleId === 1 && {
            title: "Kelish narxi",
            dataIndex: "incomePrice",
            key: "incomePrice",
            width: "13%",
            search: false,
            sorter: (a, b) => {
                if (a.incomePrice < b.incomePrice) {
                    return -1;
                }
                if (a.incomePrice > b.incomePrice) {
                    return 1;
                }
                return 0;
            },
        },
        {
            title: "Sotilish narxi",
            dataIndex: "outcomePrice",
            key: "outcomePrice",
            width: "14%",
            search: false,
            sorter: (a, b) => {
                if (a.outcomePrice < b.outcomePrice) {
                    return -1;
                }
                if (a.outcomePrice > b.outcomePrice) {
                    return 1;
                }
                return 0;
            },
        },
        {
            title: "Optom narxi",
            dataIndex: "wholesalePrice",
            key: "wholesalePrice",
            width: "13%",
            search: false,
            sorter: (a, b) => {
                if (a.wholesalePrice < b.wholesalePrice) {
                    return -1;
                }
                if (a.wholesalePrice > b.wholesalePrice) {
                    return 1;
                }
                return 0;
            },
        },
    ];

    const onCreate = (values) => {
        setLoading(true);
        instance
            .post("api/dry/fruit/dryFruit/add", { ...values })
            .then(function (response) {
                message.success("Quruq meva muvaffaqiyatli qo'shildi");
                getDryFruits(current - 1, pageSize);
                getDryfruitData();
            })
            .catch(function (error) {
                console.error(error);
                if (error.response.status === 500) navigate("/server-error");
                message.error("Quruq mevani qo'shishda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onEdit = (values, initial) => {
        setLoading(true);
        instance
            .put(`api/dry/fruit/dryFruit/update${initial.id}`, { ...values })
            .then((res) => {
                message.success("Quruq meva muvaffaqiyatli taxrirlandi");
                getDryFruits(current - 1, pageSize);
                getDryfruitData();
            })
            .catch(function (error) {
                console.error("Error in edit: ", error);
                if (error.response.status === 500) navigate("/server-error");
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
                .delete(`api/dry/fruit/dryFruit/delete${item}`)
                .then((data) => {
                    getDryFruits(current - 1, pageSize);
                    getDryfruitData();
                    message.success("Quruq meva muvaffaqiyatli o'chirildi");
                })
                .catch((error) => {
                    console.error(error);
                    if (error.response.status === 500)
                        navigate("/server-error");
                    message.error("Quruq mevani o'chirishda muammo bo'ldi");
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
                getData={getDryFruits}
                columns={columns}
                tableData={dryFruits}
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

export default DryFruit;
