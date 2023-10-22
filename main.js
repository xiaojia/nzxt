const timeDOM = document.getElementById('time');
const weatherDOM = document.getElementById('weather');
const cpuDOM = document.getElementById('cpu');
const gpuDOM = document.getElementById('gpu');
const ramDOM = document.getElementById('ram');

window.nzxt = {
    v1: {
        onMonitoringDataUpdate: (data) => {
            renderHardware(data);
        }
    }
};

const initHardware = () => {

    const width = 70;
    const bgColor = '#000000';
    const rotateColor = '#ff9600';
    const number = 1;
    const show = '';

    rotate('#cpu .circle').init({
        number: number,
        show: show,
        rotateColor: rotateColor,
        bgColor: bgColor,
        width: width
    });

    rotate('#gpu .circle').init({
        number: number,
        show: show,
        rotateColor: rotateColor,
        bgColor: bgColor,
        width: width
    });

}

const renderHardware = (data) => {
    if (data?.cpus?.length && data?.gpus?.length) {
        rotate('#cpu .circle').init({
            number: (data.cpus[0].load * 100) || 0.1,
            show: parseInt(data.cpus[0].temperature)
        });
        rotate('#gpu .circle').init({
            number: (data.gpus[0].load * 100) || 0.1,
            show: parseInt(data.gpus[0].temperature)
        });
        ramDOM.style.width = (data.ram.inUse / data.ram.totalSize * 100) + '%';
    }
}

const renderBackground = () => {

    let oldBackground = document.getElementById('background');
    let background = document.createElement('div');
    let src = `../background/1%20(${Math.floor(Math.random() * (1 - 490)) + 490}).jpg`;
    let img = new Image();

    background.classList.add('background');
    background.style.backgroundImage = `url(${src.replace(/\(/ig, '\\(').replace(/\)/ig, '\\)')})`;
    background.style.zIndex = 1;
    background.id = 'background'

    document.body.appendChild(background);

    img.src = src;
    img.onload = () => {
        background.style.opacity = 1;
        setTimeout(() => {
            if (oldBackground) {
                document.body.removeChild(oldBackground);
            }
        }, 1000);
    }

}

const fillZero = (n) => {
    return n < 10 ? '0' + n : n;
}

const renderTime = () => {
    let date = new Date();
    timeDOM.innerHTML = `${fillZero(date.getHours())}:${fillZero(date.getMinutes())}`;
}

const renderWeather = (data) => {
    fetch('https://restapi.amap.com/v3/weather/weatherInfo?key=327ea5105343e1356319ec48b91036fe&city=420115&extensions=base').then(async (response) => {
        if (response.ok) {
            let data = (await response.json())?.lives[0];
            if (data) {
                weatherDOM.innerHTML = `<span>${data.temperature}</span>${data.weather}`;
            }
        }
    });
}

const mainBackground = () => {
    renderBackground();
    setInterval(renderBackground, 60 * 1000);
}

const mainTime = () => {
    renderTime();
    setInterval(renderTime, 5 * 1000);
}

const mainWeather = () => {
    renderWeather();
    setInterval(renderWeather, 60 * 1000);
}

const mainHardware = () => {

    initHardware();

    if (location.search.indexOf('kraken=1') === -1) {
        renderHardware({
            cpus: [{
                load: 0.004368910565972328,
                temperature: 60
            }],
            gpus: [{
                load: 0.004368910565972328,
                temperature: 50
            }],
            ram: {
                totalSize: 65268,
                inUse: 13076,
            }
        });
    }

}

mainBackground();
mainTime();
mainWeather();
mainHardware();