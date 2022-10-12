import { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../Api/Axios";
import { message } from "antd";
import CustomTable from "../../Module/Table/Table";
import { useData } from "../../Hook/UseData";
import "./CategoryVsMeasurment.css";

const CategoryVsMeasurement = () => {
    const [category, setCategory] = useState([]);
    const [measurement, setMeasurment] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loadingCategory, setLoadingCategory] = useState(true);
    const [loading, setLoading] = useState(true);
    const [currentCategory, setCurrentCategory] = useState(1);
    const [pageSizeCategory, setPageSizeCategory] = useState(10);
    const [totalItemsCategory, setTotalItemsCategory] = useState(0);
    const { getCategoryData } = useData();
    const navigate = useNavigate();

    const getCategory = (current, pageSize) => {
        setLoadingCategory(true);
        instance
            .get(
                `/api/dry/fruit/category/page?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                setCategory(data.data.data?.categories);
                setTotalItemsCategory(data.data.data?.totalItems);
            })
            .catch((error) => {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("Kategoriyalarni yuklashda muammo bo'ldi");
            })
            .finally(() => setLoadingCategory(false));
    };

    const onCreateCategory = (values) => {
        setLoadingCategory(true);
        instance
            .post(`api/dry/fruit/category?name=${values.name}`)
            .then(function (response) {
                message.success("Kategoriya muvaffaqiyatli qo'shildi");
                getCategory(currentCategory - 1, pageSizeCategory);
                getCategoryData();
            })
            .catch(function (error) {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("Kategoriyani qo'shishda muammo bo'ldi");
            })
            .finally(() => {
                setLoadingCategory(false);
            });
    };

    const onEditCategory = (values, initial) => {
        setLoadingCategory(true);
        instance
            .put(`api/dry/fruit/category?id=${initial.id}&name=${values.name}`)
            .then(function (response) {
                message.success("Kategoriya muvaffaqiyatli qo'shildi");
                getCategory(currentCategory - 1, pageSizeCategory);
                getCategoryData();
            })
            .catch(function (error) {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("Kategoriyani qo'shishda muammo bo'ldi");
            })
            .finally(() => {
                setLoadingCategory(false);
            });
    };

    const handleDeleteCategory = (arr) => {
        setLoadingCategory(true);
        arr.map((item) => {
            instance
                .delete(`api/dry/fruit/category?id=${item}`)
                .then((data) => {
                    message.success("Kategoriya muvaffaqiyatli o'chirildi");
                    getCategory(currentCategory - 1, pageSizeCategory);
                    getCategoryData();
                })
                .catch((error) => {
                    console.error(error);
                    if (error.response?.status === 500)
                        navigate("/server-error");
                    message.error("Kategoriyani o'chirishda muammo bo'ldi");
                });
            return null;
        });
        setLoadingCategory(false);
    };

    const columnsCategory = [
        {
            title: "Kategoriya nomi",
            dataIndex: "name",
            key: "name",
            width: "100%",
            search: true,
            sorter: (a, b) => {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            },
        },
    ];

    const getMeasurment = () => {
        setLoading(true);
        instance
            .get("api/dry/fruit/measurement/all")
            .then((data) => {
                setMeasurment(data.data.data);
            })
            .catch((error) => {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("O'lchov birligilarni yuklashda muammo bo'ldi");
            })
            .finally(() => setLoading(false));
    };

    const onCreate = (values) => {
        message.error("O'lchov birligini qo'shib bo'lmaydi");
    };

    const onEdit = (values, initial) => {
        message.error("O'lchov birligini taxrirlab bo'lmaydi");
    };

    const handleDelete = (arr) => {
        message.error("O'lchov birligini o'chirib bo'lmaydi");
    };

    const columns = [
        {
            title: "O'lchov nomi",
            dataIndex: "name",
            key: "name",
            width: "100%",
            search: true,
            sorter: (a, b) => {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            },
        },
    ];

    return (
        <div className="category">
            <div className="others">
                <div>
                    <h3>Kategoriya</h3>
                    <CustomTable
                        getData={getCategory}
                        columns={columnsCategory}
                        tableData={category}
                        current={currentCategory}
                        pageSize={pageSizeCategory}
                        totalItems={totalItemsCategory}
                        loading={loadingCategory}
                        pageSizeOptions={[10, 20]}
                        onEdit={onEditCategory}
                        onCreate={onCreateCategory}
                        onDelete={handleDeleteCategory}
                        setLoading={setLoadingCategory}
                        setCurrent={setCurrentCategory}
                        setPageSize={setPageSizeCategory}
                    />
                </div>
                <div>
                    <h3>O'lchov birligi</h3>
                    <CustomTable
                        getData={getMeasurment}
                        current={current}
                        pageSize={pageSize}
                        columns={columns}
                        tableData={measurement}
                        loading={loading}
                        pageSizeOptions={[10, 20]}
                        setCurrent={setCurrent}
                        setPageSize={setPageSize}
                        onEdit={onEdit}
                        onCreate={onCreate}
                        onDelete={handleDelete}
                        setLoading={setLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default CategoryVsMeasurement;
