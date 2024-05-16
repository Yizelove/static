document.addEventListener('DOMContentLoaded', function() {
    const dateElement = document.querySelector('.label');
    const now = new Date();
    dateElement.textContent = now.toLocaleDateString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });

    const updateStatus = (status, color) => {
        const statusElement = document.querySelector("#status");
        statusElement.textContent = status;
        statusElement.style.color = color;
    };

    axios.get('./condition/', { timeout: 30000 })
        .then(response => {
            if (response.data.service === 200) {
                updateStatus('正常', 'green');
            } else {
                updateStatus('异常', 'red');
            }
        })
        .catch(error => {
            console.log(error);
        });

    const formatDate = date => date.toISOString().split('T')[0];
    const nowtime = formatDate(now);
    const tomorrow = formatDate(new Date(now.setDate(now.getDate() + 1)));
    const ninetyDaysAgo = formatDate(new Date(now.setDate(now.getDate() - 90)));

    const fetchTrafficData = (link, elementId) => {
        axios.get(link, { timeout: 30000 })
            .then(response => {
                let totalTraffic = response.data.data.reduce((sum, item) => sum + item.value, 0);
                let displayTraffic;
                if (totalTraffic < 1048576) {
                    displayTraffic = (totalTraffic / 1024).toFixed(2) + "KB";
                } else if (totalTraffic < 1073741824) {
                    displayTraffic = (totalTraffic / 1048576).toFixed(2) + "MB";
                } else {
                    displayTraffic = (totalTraffic / 1073741824).toFixed(2) + "GB";
                }
                document.getElementById(elementId).textContent = displayTraffic;
            })
            .catch(error => {
                console.log(error);
            });
    };

    fetchTrafficData(`./api/traffic/?from=${ninetyDaysAgo}&to=${tomorrow}`, "traffic");

    const sendRequest = () => {
        fetchTrafficData(`./api/traffic/?from=${nowtime}&to=${tomorrow}`, "real_time");
    };
    setInterval(sendRequest, 5000);

    const computeTimeDifference = (startDate, endDate) => {
        const diff = endDate - startDate;
        const diffDate = new Date(diff);
        const years = diffDate.getUTCFullYear() - 1970;
        const months = diffDate.getUTCMonth();
        const days = diffDate.getUTCDate() - 1;
        const hours = diffDate.getUTCHours();
        const minutes = diffDate.getUTCMinutes();
        return `${years ? years + '年' : ''}${months ? months + '月' : ''}${days}天 ${hours}小时${minutes}分`;
    };

    const startDate = new Date(2024, 0, 20, 6, 30);
    const updateTimeDifference = () => {
        const endDate = new Date();
        const timeDifference = computeTimeDifference(startDate, endDate);
        document.querySelector("#total_time").textContent = timeDifference;
    };
    updateTimeDifference();
    setInterval(updateTimeDifference, 60000); // 每分钟更新一次
});
