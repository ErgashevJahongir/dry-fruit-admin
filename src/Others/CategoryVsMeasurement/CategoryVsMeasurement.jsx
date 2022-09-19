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
    const { getCategoryData, getMeasurementData } = useData();
    const navigate = useNavigate();

    const getCategory = (current, pageSize) => {
        setLoadingCategory(true);
        instance
            .get(
                `/api/dry/fruit/category/page?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                setCategory(data.data.data.categories);
                setTotalItemsCategory(data.data.data.totalItems);
            })
            .catch((error) => {
                console.error(error);
                if (error.response.status === 500) navigate("/server-error");
                message.error("Kategoriyalarni yuklashda muammo bo'ldi");
            })
            .finally(() => setLoadingCategory(false));
    };

    const onCreateCategory = (values) => {
        setLoadingCategory(true);
        instance
            .post(`api/dry/fruit/category?name=${values.name}`)
            .then(function (response) {
                getCategory(currentCategory - 1, pageSizeCategory);
                getCategoryData();
                message.success("Kategoriya muvaffaqiyatli qo'shildi");
            })
            .catch(function (error) {
                console.error(error);
                if (error.response.status === 500) navigate("/server-error");
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
                getCategory(currentCategory - 1, pageSizeCategory);
                getCategoryData();
                message.success("Kategoriya muvaffaqiyatli qo'shildi");
            })
            .catch(function (error) {
                console.error(error);
                if (error.response.status === 500) navigate("/server-error");
                message.error("Kategoriyani qo'shishda muammo bo'ldi");
            })
            .finally(() => {
                setLoadingCategory(false);
            });
    };

    const handleDeleteCategory = (arr) => {
        console.log(arr);
        setLoadingCategory(true);
        arr.map((item) => {
            instance
                .delete(`api/dry/fruit/category?id=${item}`)
                .then((data) => {
                    getCategoryData();
                    getCategory(currentCategory - 1, pageSizeCategory);
                    message.success("Kategoriya muvaffaqiyatli o'chirildi");
                })
                .catch((error) => {
                    console.error(error);
                    if (error.response.status === 500)
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
            search: false,
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
                if (error.response.status === 500) navigate("/server-error");
                message.error("O'lchov birligilarni yuklashda muammo bo'ldi");
            })
            .finally(() => setLoading(false));
    };

    const onCreate = (values) => {
        setLoading(true);
        instance
            .post("api/dry/fruit/measurement/post", {
                ...values,
            })
            .then(function (response) {
                getMeasurment();
                getMeasurementData();
                message.success("O'lchov birligi muvaffaqiyatli qo'shildi");
            })
            .catch(function (error) {
                console.error(error);
                if (error.response.status === 500) navigate("/server-error");
                message.error("O'lchov birligini qo'shishda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onEdit = (values, initial) => {
        setLoading(true);
        console.log(values, initial);
        instance
            .put(`api/dry/fruit/measurement/update${initial.id}`, { values })
            .then(function (response) {
                getMeasurment();
                getMeasurementData();
                message.success("O'lchov birligi muvofaqiyatli taxrirlandi");
            })
            .catch(function (error) {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("O'lchov birligini taxrirlashda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDelete = (arr) => {
        console.log(arr);
        setLoading(true);
        arr.map((item) => {
            instance
                .delete(`api/dry/fruit/measurement/delete${item}`)
                .then((data) => {
                    getMeasurment();
                    getMeasurementData();
                    message.success("O'lchov birligi muvofaqiyatli o'chirildi");
                })
                .catch((error) => {
                    console.error(error);
                    if (error.response.status === 500)
                        navigate("/server-error");
                    message.error(
                        "O'lchov birligini o'chirishda muammo bo'ldi"
                    );
                });
            return null;
        });
        setLoading(false);
    };

    const columns = [
        {
            title: "O'lchov nomi",
            dataIndex: "name",
            key: "name",
            width: "100%",
            search: false,
        },
    ];

    return (
        <div className="category">
            <div className="others">
                <div>
                    <h3>Kategoriya</h3>
                    <CustomTable
                        onEdit={onEditCategory}
                        onCreate={onCreateCategory}
                        getData={getCategory}
                        onDelete={handleDeleteCategory}
                        columns={columnsCategory}
                        tableData={category}
                        current={currentCategory}
                        pageSize={pageSizeCategory}
                        totalItems={totalItemsCategory}
                        loading={loadingCategory}
                        setLoading={setLoadingCategory}
                        setCurrent={setCurrentCategory}
                        setPageSize={setPageSizeCategory}
                        pageSizeOptions={[10, 20]}
                    />
                </div>
                <div>
                    <h3>O'lchov birligi</h3>
                    <CustomTable
                        setCurrent={setCurrent}
                        current={current}
                        setPageSize={setPageSize}
                        pageSize={pageSize}
                        onEdit={onEdit}
                        onCreate={onCreate}
                        getData={getMeasurment}
                        onDelete={handleDelete}
                        columns={columns}
                        tableData={measurement}
                        loading={loading}
                        setLoading={setLoading}
                        pageSizeOptions={[10, 20]}
                    />
                </div>
            </div>
        </div>
    );
};

export default CategoryVsMeasurement;
