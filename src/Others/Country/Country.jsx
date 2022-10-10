import { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../Api/Axios";
import CustomTable from "../../Module/Table/Table";
import { useData } from "../../Hook/UseData";
import { message } from "antd";

const Country = () => {
    const [country, setCountry] = useState([]);
    const [loadingCountry, setLoadingCountry] = useState(true);
    const [currentCountry, setCurrentCountry] = useState(1);
    const [pageSizeCountry, setPageSizeCountry] = useState(10);
    const [totalItemsCountry, setTotalItemsCountry] = useState(0);
    const { getCountryData } = useData();
    const navigate = useNavigate();

    const getCountry = (current, pageSize) => {
        setLoadingCountry(true);
        instance
            .get(
                `api/dry/fruit/country/pageable?page=${current}&size=${pageSize}`
            )
            .then((data) => {
                getCountryData();
                setCountry(data.data.data?.allWorkers);
                setTotalItemsCountry(data.data.data?.totalItems);
            })
            .catch((error) => {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error(
                    "Yuk keluvchi davlatlarni yuklashda muammo bo'ldi"
                );
            })
            .finally(() => setLoadingCountry(false));
    };

    const onCreate = (values) => {
        setLoadingCountry(true);
        instance
            .post(`api/dry/fruit/country`, { ...values })
            .then(function (response) {
                message.success("Yuk keluvchi davlat muvaffaqiyatli qo'shildi");
                getCountry(currentCountry - 1, pageSizeCountry);
            })
            .catch(function (error) {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error("Yuk keluvchi davlatni qo'shishda muammo bo'ldi");
            })
            .finally(() => {
                setLoadingCountry(false);
            });
    };

    const onEdit = (values, initial) => {
        setLoadingCountry(true);
        instance
            .put(`api/dry/fruit/country`, {
                id: initial.id,
                name: values.name,
            })
            .then(function (response) {
                message.success("Yuk keluvchi davlat muvaffaqiyatli qo'shildi");
                getCountry(currentCountry - 1, pageSizeCountry);
            })
            .catch(function (error) {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
                message.error(
                    "Yuk keluvchi davlatni taxrirlashda muammo bo'ldi"
                );
            })
            .finally(() => {
                setLoadingCountry(false);
            });
    };

    const columns = [
        {
            title: "Yuk keluvchi davlat nomi",
            dataIndex: "name",
            key: "name",
            width: "99%",
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
        <div>
            <h3>Yuk keluvchi davlatlar</h3>
            <CustomTable
                getData={getCountry}
                columns={columns}
                tableData={country}
                current={currentCountry}
                pageSize={pageSizeCountry}
                totalItems={totalItemsCountry}
                loading={loadingCountry}
                pageSizeOptions={[10, 20]}
                onEdit={onEdit}
                onCreate={onCreate}
                setLoading={setLoadingCountry}
                setCurrent={setCurrentCountry}
                setPageSize={setPageSizeCountry}
            />
        </div>
    );
};

export default Country;
