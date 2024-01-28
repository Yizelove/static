const dateElement = document.querySelector('.label');
const now = new Date();
dateElement.textContent = now.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
});

axios.get('./condition', {})
    .then(function(response) {
        if (response.data.service === 200) {
            document.querySelector("#status").innerHTML = '正常';
            document.querySelector("#status").style.color = 'green';
        } else {
            document.querySelector("#status").innerHTML = '异常';
            document.querySelector("#status").style.color = 'red';
        }
    })
    .catch(function(error) {
        console.log(error);
    });

let nowtime = now.getFullYear() + "-" + ('0' + (now.getMonth() + 1)).slice(-2) + "-" + ('0' + now.getDate()).slice(-2);

const nowtimes = new Date();
nowtimes.setDate(nowtimes.getDate() + 1);
const year = nowtimes.getFullYear();
const month = ('0' + (nowtimes.getMonth() + 1)).slice(-2);
const day = ('0' + nowtimes.getDate()).slice(-2);
let tomorrow = year + "-" + month + "-" + day;

let ninetyDaysAgo = new Date();
ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
const n = ninetyDaysAgo.getFullYear();
const y = ('0' + (ninetyDaysAgo.getMonth() + 1)).slice(-2);
const r = ('0' + ninetyDaysAgo.getDate()).slice(-2);
ninetyDaysAgo = n + "-" + y + "-" + r;

let link = `./api/traffic?from=${ninetyDaysAgo}&to=${tomorrow}`;

axios.get(link, {})
    .then(function(response) {
        let yl = 0;
        for (const item of response.data.data) {
            yl += item.value;
        }
        if (yl < 1048576) {
            var ll = yl / 1024;
            document.getElementById("traffic").innerHTML = ll.toFixed(2) + "KB";
        } else if (yl >= 1048576 && yl < 1073741824) {
            var ll = yl / 1048576;
            document.getElementById("traffic").innerHTML = ll.toFixed(2) + "MB";
        } else if (yl >= 1073741824) {
            var ll = yl / 1073741824;
            document.getElementById("traffic").innerHTML = ll.toFixed(2) + "GB";
        }
    })
    .catch(function(error) {
        console.log(error);
    });

function sendRequest() {
    let link2 = `./api/traffic?from=${nowtime}&to=${tomorrow}`;
    axios.get(link2, {})
        .then(function(response) {
            let ss = 0;
            for (const item of response.data.data) {
                ss += item.value;
            }
            if (ss < 1048576) {
                var ll = ss / 1024;
                document.getElementById("real_time").innerHTML = ll.toFixed(2) + "KB";
            } else if (ss >= 1048576 && ss < 1073741824) {
                var ll = ss / 1048576;
                document.getElementById("real_time").innerHTML = ll.toFixed(2) + "MB";
            } else if (ss >= 1073741824) {
                var ll = ss / 1073741824;
                document.getElementById("real_time").innerHTML = ll.toFixed(2) + "GB";
            }
        })
        .catch(function(error) {
            console.log(error);
        });
}
setInterval(sendRequest, 3000);

function computeTimeDifference(startDate, endDate) {
    const diff = endDate - startDate;
    const diffInMinutes = diff / 60000;
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;
    const diffInMonths = diffInDays / 30;
    const months = Math.floor(diffInMonths);
    const days = Math.floor(diffInDays % 30);
    const hours = Math.floor(diffInHours % 24);
    const minutes = Math.floor(diffInMinutes % 60);
    return `${months}月${days}天 ${hours}小时${minutes}分`;
}
const startDate = new Date(2024, 0, 20, 6, 30);
const endDate = new Date();
const timeDifference = computeTimeDifference(startDate, endDate);
document.querySelector("#total_time").textContent = timeDifference;
