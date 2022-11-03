import { SearchOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import instance from "../Api/Axios";
import { useData } from "../Hook/UseData";
import { useSidebar } from "../Hook/UseSidebar";

const style = {
    height: 30,
    border: "1px solid green",
    margin: 6,
    padding: 8,
    cursor: "pointer",
};

export default function OutcomeScannerDataInfinitiScroll() {
    const [data, setData] = useState([]);
    const [current, setCurrent] = useState(0);
    const [totalItems, setTotalItems] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [hasSearch, setHasSearch] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const { dryfruitData } = useData();
    const { setTableData } = useSidebar();
    const navigate = useNavigate();

    const fetchMoreData = () => {
        if (totalItems > data.length + 2) {
            getWerehouseDryFruitScroll(current);
        } else {
            setHasMore(false);
        }
    };

    const getWerehouseDryFruit = (current) => {
        instance
            .get(
                `api/dry/fruit/dryFruitWarehouse/getAllPageable?page=${current}&size=20`
            )
            .then((data) => {
                const dataDry = data.data.data?.fuelReports;
                setData(dataDry);
                setTotalItems(data.data.data?.totalItems);
                setCurrent(data.data.data?.currentPage + 1);
            })
            .catch((error) => {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
            });
    };

    const getWerehouseDryFruitScroll = (current) => {
        instance
            .get(
                `api/dry/fruit/dryFruitWarehouse/getAllPageable?page=${current}&size=20`
            )
            .then((data) => {
                const dataDry = data.data.data?.fuelReports;
                setData((prev) => [...prev, ...dataDry]);
                setTotalItems(data.data.data?.totalItems);
                setCurrent(data.data.data?.currentPage + 1);
            })
            .catch((error) => {
                console.error(error);
                if (error.response?.status === 500) navigate("/server-error");
            });
    };

    const searchItems = (searchValue) => {
        setHasSearch(true);
        if (searchValue !== "") {
            instance
                .get(`api/dry/fruit/dryFruit/search?word=${searchValue}`)
                .then((data) => {
                    setSearchData(
                        data.data.data.map((item) => {
                            return {
                                id: item.id,
                                key: item.id,
                                dryFruitId: item.id,
                                name: item.name,
                                amount: item?.amount ? item?.amount : 1,
                                productPrice: item?.outcomePrice,
                                measurment: item?.amount ? "kg" : "шт",
                                measurementId: item?.amount ? 1 : 4,
                                productTotalPrice:
                                    (item?.amount ? item?.amount : 1) *
                                    item?.outcomePrice,
                            };
                        })
                    );
                });
        } else {
            setSearchData([]);
            getWerehouseDryFruitScroll(0);
            setHasSearch(false);
        }
    };

    useEffect(() => {
        getWerehouseDryFruit(current);
    }, []);

    return (
        <div>
            <h1 style={{ fontSize: 20, margin: "10px 0 15px" }}>
                Quruq mevalar soni: {totalItems}
            </h1>
            <Input
                style={{ padding: 10, marginBottom: "20px" }}
                icon={<SearchOutlined />}
                placeholder={"Mahsulot nomi bo'yicha qidirish"}
                onChange={(e) => {
                    searchItems(e.target.value);
                }}
            />
            <hr />
            {!hasSearch ? (
                <>
                    <InfiniteScroll
                        dataLength={data.length}
                        hasMore={hasMore}
                        endMessage={
                            <p style={{ textAlign: "center" }}>
                                <b>Ombordagi quruq mevalar tugadi!</b>
                            </p>
                        }
                    >
                        {data.map((item, index) => {
                            const dryFruit = dryfruitData.filter(
                                (data) => data.id === item.dryFruitId
                            );
                            return (
                                <div
                                    style={style}
                                    key={index}
                                    onClick={() => {
                                        setTableData((prev) => {
                                            const product = prev.filter(
                                                (data) =>
                                                    data.id === dryFruit[0]?.id
                                            );
                                            const field = {
                                                id: dryFruit[0].id,
                                                key: dryFruit[0].id,
                                                name: dryFruit[0].name,
                                                amount: dryFruit[0]?.amount
                                                    ? dryFruit[0]?.amount
                                                    : 1,
                                                productPrice:
                                                    dryFruit[0]?.outcomePrice,
                                                measurment: dryFruit[0]?.amount
                                                    ? "kg"
                                                    : "шт",
                                                measurementId: dryFruit[0]
                                                    ?.amount
                                                    ? 1
                                                    : 4,
                                                productTotalPrice:
                                                    (dryFruit[0]?.amount
                                                        ? dryFruit[0]?.amount
                                                        : 1) *
                                                    dryFruit[0]?.outcomePrice,
                                            };
                                            if (product[0]) {
                                                return prev.map((itemData) => {
                                                    return itemData.id ===
                                                        product[0].id
                                                        ? {
                                                              ...itemData,
                                                              key: itemData.id,
                                                              amount:
                                                                  itemData.amount +
                                                                  field.amount,
                                                              productTotalPrice:
                                                                  (itemData.amount +
                                                                      field.amount) *
                                                                  itemData.productPrice,
                                                          }
                                                        : {
                                                              ...itemData,
                                                              key: itemData.id,
                                                          };
                                                });
                                            } else {
                                                return [...prev, field];
                                            }
                                        });
                                    }}
                                >
                                    {index + 1} {dryFruit[0]?.name}
                                </div>
                            );
                        })}
                    </InfiniteScroll>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Button type={"primary"} onClick={fetchMoreData}>
                            Yana yuklash
                        </Button>
                    </div>
                </>
            ) : (
                <div>
                    {searchData.map((qism, index) => {
                        return (
                            <div
                                style={style}
                                key={index}
                                onClick={() => {
                                    setTableData((prev) => {
                                        const product = prev.filter(
                                            (data) => data.id === qism?.id
                                        );
                                        if (product[0]) {
                                            return prev.map((itemData) => {
                                                return itemData.id ===
                                                    product[0].id
                                                    ? {
                                                          ...itemData,
                                                          key: itemData.id,
                                                          amount:
                                                              itemData.amount +
                                                              qism.amount,
                                                          productTotalPrice:
                                                              (itemData.amount +
                                                                  qism.amount) *
                                                              itemData.productPrice,
                                                      }
                                                    : {
                                                          ...itemData,
                                                          key: itemData.id,
                                                      };
                                            });
                                        } else {
                                            return [...prev, qism];
                                        }
                                    });
                                }}
                            >
                                {index + 1} {qism?.name}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
