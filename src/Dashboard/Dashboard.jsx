import { message, notification } from "antd";
import { useEffect, useState } from "react";
import instance from "../Api/Axios";

let son = 1;

const Dashboard = () => {
    const [notificationn, setNotificationn] = useState([]);
    const getNotification = () => {
        instance
            .get(`api/dry/fruit/notification/get`)
            .then((data) => {
                setNotificationn(data.data.data);
            })
            .catch((error) => {
                console.error(error);
                message.error("Yoqilg'i miqdorini yuklashda muammo bo'ldi");
            });
    };

    useEffect(() => {
        getNotification();
    }, []);
    return (
        <>
            {son === 1 &&
                notificationn.map((item) => {
                    const args = {
                        message: item.title,
                        description: item.text,
                        duration: 0,
                        onClose: () => {
                            instance
                                .put(
                                    `api/dry/fruit/notification/update?id=${item.id}`
                                )
                                .then((data) => null)
                                .catch((err) => console.error(err));
                        },
                    };
                    son = 2;
                    notification.warning(args);
                    return null;
                })}
            <h1>Salom</h1>
        </>
    );
};

export default Dashboard;
