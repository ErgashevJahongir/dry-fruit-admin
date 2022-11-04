import { Card, Row } from "antd";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import instance from "../Api/Axios";
import Loading from "../Components/Loading";

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [totalsum, setTotalsum] = useState();
    const [totalsumOut, setTotalsumOut] = useState();
    const [currency, setCurrency] = useState(null);

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
            });
    };

    useEffect(() => {
        getCurrency();
        getIncomeDryFruitsTimely();
        getOutcomeDryFruitsTimely();
    }, []);

    if (loading) {
        return <Loading />;
    }

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

    return (
        <div style={{ position: "relative" }}>
            <Card
                className="currency"
                style={{
                    width: "350px",
                    float: "right",
                    position: "absolute",
                    right: 0,
                    zIndex: 2,
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
        </div>
    );
};

export default Dashboard;
