import { Card, message, Row } from "antd";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import instance from "../Api/Axios";
import { useData } from "../Hook/UseData";

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [totalsum, setTotalsum] = useState();
    const [totalsumOut, setTotalsumOut] = useState();
    const [currency, setCurrency] = useState(null);
    const { branchData, dryfruitData } = useData();

    const getCurrency = () => {
        setLoading(true);
        instance
            .get(`api/dry/fruit/api/dry/fruit/currency`)
            .then((data) => {
                const index = data.data.data?.rate.toString().indexOf(".");
                const dollar = data.data.data?.rate
                    .toString()
                    .slice(0, index + 3);
                setCurrency({ ...data.data.data, rate: dollar });
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => setLoading(false));
    };

    const getWerehouseDryFruit = () => {
        instance
            .get(`api/dry/fruit/dryFruitWarehouse/getAll`)
            .then((data) => {
                setData(data.data.data);
            })
            .catch((error) => {
                console.error(error);
                message.error("Ombordagi Mevalarni yuklashda muammo bo'ldi");
            });
    };

    const getIncomeDryFruitsTimely = () => {
        instance
            .get(
                `api/dry/fruit/incomeDryFruit/getAllPageable/monthly?page=0&size=10`
            )
            .then((data) => {
                setTotalsum([
                    data.data.data?.incomeDryFruit?.totalSumma,
                    data.data.data?.incomeDryFruit?.totalPlastic,
                    data.data.data?.incomeDryFruit?.totalCash,
                ]);
            })
            .catch((error) => {
                console.error(error);
                message.error("Kelgan quruq mevalarni yuklashda muammo bo'ldi");
            });
    };

    const getOutcomeDryFruitsTimely = () => {
        instance
            .get(
                `api/dry/fruit/outcomeFruit/getAllPageable/monthly?page=0&size=10`
            )
            .then((data) => {
                setTotalsumOut([
                    data.data.data?.dryFruits.totalSumma,
                    data.data.data?.dryFruits.totalPlastic,
                    data.data.data?.dryFruits.totalCash,
                ]);
            })
            .catch((error) => {
                console.error(error);
                message.error("Kelgan yoqilg'ilarni yuklashda muammo bo'ldi");
            });
    };

    useEffect(() => {
        getCurrency();
        getWerehouseDryFruit();
        getIncomeDryFruitsTimely();
        getOutcomeDryFruitsTimely();
    }, []);

    const ApexChartLine = () => {
        const [miqdor, setMiqdor] = useState({
            series: [
                {
                    name: "Kelgan mahsulotlar",
                    data: totalsum || [],
                },
                {
                    name: "Sotilgan mahsulotlar",
                    data: totalsumOut || [],
                },
            ],
            options: {
                chart: {
                    type: "bar",
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: "55%",
                        endingShape: "rounded",
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ["transparent"],
                },
                xaxis: {
                    categories: [
                        "Jami summa",
                        "Plastikdagi summa",
                        "Naqtdagi summa",
                    ],
                },
                yaxis: {
                    title: {
                        text: "tenge ",
                    },
                },
                title: {
                    text: "Bir oylik kirim chiqimlar",
                    align: "center",
                    floating: true,
                },
                subtitle: {
                    text: "O'tgan oyning hozirgi kunigacha bo'lgan kirim chiqimlar",
                    align: "center",
                },
                fill: {
                    opacity: 1,
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return "tenge " + val;
                        },
                    },
                },
            },
        });

        return (
            <div id="chart">
                <ReactApexChart
                    options={miqdor.options}
                    series={miqdor.series}
                    type="bar"
                    height={400}
                />
            </div>
        );
    };

    const ApexChart = () => {
        const [options, setOptions] = useState({
            chart: {
                type: "bar",
            },
            plotOptions: {
                bar: {
                    barHeight: "100%",
                    distributed: true,
                    horizontal: true,
                    dataLabels: {
                        position: "bottom",
                    },
                },
            },
            colors: data.map((item) => {
                const color =
                    item?.amount > 1000
                        ? "#0f0"
                        : item?.amount > 100
                        ? "#ff0"
                        : "#f00";
                return color;
            }),
            dataLabels: {
                enabled: true,
                textAnchor: "start",
                style: {
                    colors: ["#fff"],
                },
                formatter: function (val, opt) {
                    return (
                        opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
                    );
                },
                offsetX: 0,
                dropShadow: {
                    enabled: true,
                },
            },
            stroke: {
                width: 1,
                colors: ["#fff"],
            },
            xaxis: {
                categories: data?.map((item) => {
                    const socks = dryfruitData?.filter(
                        (data) => data?.id === item?.dryFruitId
                    );
                    const branch = branchData?.filter(
                        (data) => data?.id === item?.branchId
                    );
                    return (
                        `${socks[0]?.name}(${branch[0]?.name})` ||
                        "tur o'chirilgan"
                    );
                }),
            },
            yaxis: {
                labels: {
                    show: false,
                },
            },
            title: {
                text: "Mahsulotlar soni",
                align: "center",
                floating: true,
            },
            subtitle: {
                text: "Mahsulotlar soni haqida malumot",
                align: "center",
            },
            tooltip: {
                theme: "dark",
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: function () {
                            return "";
                        },
                    },
                },
            },
        });
        const [series, setSeries] = useState([
            {
                data: data
                    ? data?.map((item) => {
                          return item?.amount;
                      })
                    : [],
            },
        ]);

        return (
            <div id="chart">
                <ReactApexChart
                    options={options}
                    series={series}
                    type="bar"
                    height={
                        data?.length > 15 ? 900 : data?.length > 10 ? 500 : 400
                    }
                />
            </div>
        );
    };

    return (
        <>
            <Card
                className="currency"
                style={{
                    width: "350px",
                    float: "right",
                    zIndex: 1,
                    borderRadius: 5,
                    fontSize: 14,
                    marginTop: "-75px",
                }}
            >
                1 $ ={" "}
                <span style={{ fontWeight: 700, fontSize: 16 }}>
                    {currency?.rate}
                </span>{" "}
                ({currency?.ccy}) {currency?.ccyNmUZ}
            </Card>
            <div style={{ marginTop: 50 }}>
                <Card
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                    xxl={24}
                    key={"amount"}
                >
                    <ApexChart />
                </Card>
                <Row className="lineAmount">
                    <Card
                        xs={24}
                        sm={24}
                        md={24}
                        lg={12}
                        xl={12}
                        key={"lineAmount"}
                    >
                        <ApexChartLine />
                    </Card>
                </Row>
            </div>
        </>
    );
};

export default Dashboard;
