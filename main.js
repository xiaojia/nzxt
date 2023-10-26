const wrapDOM = document.getElementById('wrap');
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
}

const renderHardware = (data) => {

    // if (location.search.indexOf('kraken=1') === -1) {
    //     document.body.innerHTML = `<pre>${JSON.stringify(window.nzxt, null, 4)}</pre>`;
    //     document.body.style.color = '#fff';
    // }

    const width = 70;
    const bgColor = '#000000';
    const rotateColor = '#ff9600';

    if (data?.cpus?.length && data?.gpus?.length) {

        wrapDOM.style.display = 'block';
        wrapDOM.style.width = (window.nzxt?.v1?.width || 320) + 'px';
        wrapDOM.style.height = (window.nzxt?.v1?.height || 320) + 'px';

        rotate('#cpu .circle').init({
            number: data.cpus[0].load * 100,
            show: parseInt(data.cpus[0].temperature),
            rotateColor: rotateColor,
            bgColor: bgColor,
            width: width
        });

        rotate('#gpu .circle').init({
            number: data.gpus[0].load * 100,
            show: parseInt(data.gpus[0].temperature),
            rotateColor: rotateColor,
            bgColor: bgColor,
            width: width
        });

        ramDOM.style.width = (data.ram.inUse / data.ram.totalSize * 100) + '%';

    }

}

const renderBackground = (image) => {

    let oldBackground = document.getElementById('background');
    let background = document.createElement('div');
    let src = image || `./background/a${Math.floor(Math.random() * (1 - 13)) + 13}.webp`;
    let img = new Image();

    background.classList.add('background');
    background.style.backgroundImage = `url(${src.replace(/\(/ig, '\\(').replace(/\)/ig, '\\)').replace(/\s/ig, '%20')})`;
    background.style.zIndex = 1;
    background.id = 'background'

    wrapDOM.appendChild(background);

    img.src = src;
    img.onload = () => {
        background.style.opacity = 1;
        setTimeout(() => {
            if (oldBackground) {
                wrapDOM.removeChild(oldBackground);
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

const mainBackground = (image) => {
    renderBackground(image);
    if (!image) {
        setInterval(renderBackground, 60 * 1000);
    }
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

    if (location.search.indexOf('kraken=1') > -1) {
        return;
    }

    let random = function (min, max) {
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    };

    let createNumber = (min, max, current) => {

        let range = max / 20;
        let number = current + random(-range, range);

        if (number > max) {
            number = max;
        }

        if (number < min) {
            number = min;
        }

        return number;

    }

    let cpuTemperature = 50;
    let cpuLoad = 10;
    let gpuTemperature = 50;
    let gpuLoad = 40;
    let ramInUse = 13076;

    setInterval(() => {

        cpuTemperature = createNumber(10, 90, cpuTemperature);
        cpuLoad = createNumber(0, 100, cpuLoad);
        gpuTemperature = createNumber(10, 90, gpuTemperature);
        gpuLoad = createNumber(0, 100, gpuLoad);
        ramInUse = createNumber(10000, 65268, ramInUse);

        renderHardware({
            cpus: [{
                load: cpuLoad / 100,
                temperature: cpuTemperature
            }],
            gpus: [{
                load: gpuLoad / 100,
                temperature: gpuTemperature
            }],
            ram: {
                totalSize: 65268,
                inUse: ramInUse,
            }
        });

    }, 1000);

}

mainBackground();
mainTime();
mainWeather();
mainHardware();