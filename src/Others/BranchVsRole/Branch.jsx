import { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../Api/Axios";
import CustomTable from "../../Module/Table/Table";
import { useData } from "../../Hook/UseData";
import { message } from "antd";
import "./Branch.css";

const Branch = () => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const { getBranchData } = useData();
    const navigate = useNavigate();

    const getBranches = (current, pageSize) => {
        setLoading(true);
        instance
            .get(
                `/api/dry/fruit/api/dry/fruit/branch/page?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                setBranches(data.data.data?.fuelReports);
                setTotalItems(data.data.data?.totalItems);
            })
            .catch((error) => {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("Filiallarni yuklashda muammo bo'ldi");
            })
            .finally(() => setLoading(false));
    };

    const onCreate = (values) => {
        setLoading(true);
        instance
            .post(
                `api/dry/fruit/api/dry/fruit/branch?name=${values.name}&main=${values.main}`
            )
            .then(function (response) {
                message.success("Filial muvaffaqiyatli qo'shildi");
                getBranches(current - 1, pageSize);
                getBranchData();
            })
            .catch(function (error) {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("Filialni qo'shishda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onEdit = (values, initial) => {
        setLoading(true);
        instance
            .put(
                `api/dry/fruit/api/dry/fruit/branch?id=${initial.id}&name=${values.name}&main=${values.main}&deleted=false`,
                {
                    id: initial.id,
                    name: values.name,
                    main: values.main,
                    deleted: false,
                }
            )
            .then(function (response) {
                message.success("Filial muvaffaqiyatli qo'shildi");
                getBranches(current - 1, pageSize);
                getBranchData();
            })
            .catch(function (error) {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("Filialni taxrirlashda muammo bo'ldi");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDelete = (arr) => {
        setLoading(true);
        arr.map((item) => {
            instance
                .delete(`api/dry/fruit/api/dry/fruit/branch/${item}`)
                .then((data) => {
                    message.success("Filial muvaffaqiyatli o'chirildi");
                    getBranches(current - 1, pageSize);
                    getBranchData();
                })
                .catch((error) => {
                    console.error(error);
                    if (error.response?.status === 500)
                        navigate("/server-error");
                    message.error("Filialni o'chirishda muammo bo'ldi");
                });
            return null;
        });
        setLoading(false);
    };

    const columns = [
        {
            title: "Filial nomi",
            dataIndex: "name",
            key: "name",
            width: "50%",
            search: false,
        },
        {
            title: "Bu filial asosiymi",
            dataIndex: "main",
            key: "main",
            width: "49%",
            search: false,
            render: (record) => {
                return record ? "Ha" : "Yo'q";
            },
        },
    ];

    return (
        <div className="others">
            <div>
                <h3>Filiallar</h3>
                <CustomTable
                    getData={getBranches}
                    columns={columns}
                    tableData={branches}
                    current={current}
                    pageSize={pageSize}
                    totalItems={totalItems}
                    loading={loading}
                    pageSizeOptions={[10, 20]}
                    onEdit={onEdit}
                    onCreate={onCreate}
                    onDelete={handleDelete}
                    setLoading={setLoading}
                    setCurrent={setCurrent}
                    setPageSize={setPageSize}
                />
            </div>
        </div>
    );
};

export default Branch;
