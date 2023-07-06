var ctx_year = document.getElementById('area-chart-year').getContext('2d');
var ctx_mouth = document.getElementById('area-chart-mouth').getContext('2d');
var ctx_week = document.getElementById('area-chart-week').getContext('2d');
var ctx_day = document.getElementById('area-chart-day').getContext('2d');

const labels_year = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const labels_mouth = ['01', '04', '08', '12', '16', '20', '24', '28', '31'];
const labels_week = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Samedi', 'Dimanche'];
const labels_day = ['0h', '2h', '4h', '6h', '8h', '10h', '12h', '14h', '16h', '18h', '20h', '22h'];

const data_year = {
    labels: labels_year,
    datasets: [
        {
            label: "Nombre de machines connectée à l'année",
            // data: ['83', '20', '30', '40', '50', '60', '10', '100', '25', '113', '43', '59'],
            data: document.getElementById('area-chart-year').getAttribute("data")?.split(';') ?? [],
            borderColor: '#820f68',
            borderWidth: 3,
            backgroundColor: '#2487a6',
            fill: true,
            tension: 0.2
        },
    ]
};
const data_mouth = {
    labels: labels_mouth,
    datasets: [
        {
            label: "Nombre de machines connectée sur le mois",
            data: document.getElementById('area-chart-mouth').getAttribute("data")?.split(';') ?? [],
            borderColor: '#820f68',
            borderWidth: 3,
            backgroundColor: '#2487a6',
            fill: true,
            tension: 0.2
        },
    ]
};
const data_week = {
    labels: labels_week,
    datasets: [
        {
            label: "Nombre de machines connectée à sur la semaine",
            data: document.getElementById('area-chart-week').getAttribute("data")?.split(';') ?? [],
            borderColor: '#820f68',
            borderWidth: 3,
            backgroundColor: '#2487a6',
            fill: true,
            tension: 0.2
        },
    ]
};
const data_day = {
    labels: labels_day,
    datasets: [
        {
            label: "Nombre de machines connectée sur la journée",
            data: document.getElementById('area-chart-day').getAttribute("data")?.split(';') ?? [],
            borderColor: '#820f68',
            borderWidth: 3,
            backgroundColor: '#2487a6',
            fill: true,
            tension: 0.2
        },
    ]
};

const config_year = {
    type: 'line',
    data: data_year,
    options: {
        responsive: true,
        radius: 5,
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    }
};

const config_mouth = {
    type: 'line',
    data: data_mouth,
    options: {
        responsive: true,
        radius: 5,
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    }
};

const config_week = {
    type: 'line',
    data: data_week,
    options: {
        responsive: true,
        radius: 5,
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    }
};

const config_day = {
    type: 'line',
    data: data_day,
    options: {
        responsive: true,
        radius: 5,
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    }
};

var areaChart_year = new Chart(ctx_year, config_year);
var areaChart_mouth = new Chart(ctx_mouth, config_mouth);
var areaChart_week = new Chart(ctx_week, config_week);
var areaChart_day = new Chart(ctx_day, config_day);

var btnCanva_year = document.getElementById('btn-canva-year');
var btnCanva_mouth = document.getElementById('btn-canva-mouth');
var btnCanva_week = document.getElementById('btn-canva-week');
var btnCanva_day = document.getElementById('btn-canva-day');

btnCanva_year.onclick = function() {
    document.getElementById('area-chart-year').classList.add('active');
    document.getElementById('area-chart-mouth').classList.remove('active');
    document.getElementById('area-chart-week').classList.remove('active');
    document.getElementById('area-chart-day').classList.remove('active');

    btnCanva_year.classList.add('active');
    btnCanva_mouth.classList.remove('active');
    btnCanva_week.classList.remove('active');
    btnCanva_day.classList.remove('active');
}
btnCanva_mouth.onclick = function() {
    document.getElementById('area-chart-year').classList.remove('active');
    document.getElementById('area-chart-mouth').classList.add('active');
    document.getElementById('area-chart-week').classList.remove('active');
    document.getElementById('area-chart-day').classList.remove('active');

    btnCanva_year.classList.remove('active');
    btnCanva_mouth.classList.add('active');
    btnCanva_week.classList.remove('active');
    btnCanva_day.classList.remove('active');
}
btnCanva_week.onclick = function() {
    document.getElementById('area-chart-year').classList.remove('active');
    document.getElementById('area-chart-mouth').classList.remove('active');
    document.getElementById('area-chart-week').classList.add('active');
    document.getElementById('area-chart-day').classList.remove('active');

    btnCanva_year.classList.remove('active');
    btnCanva_mouth.classList.remove('active');
    btnCanva_week.classList.add('active');
    btnCanva_day.classList.remove('active');
}
btnCanva_day.onclick = function() {
    document.getElementById('area-chart-year').classList.remove('active');
    document.getElementById('area-chart-mouth').classList.remove('active');
    document.getElementById('area-chart-week').classList.remove('active');
    document.getElementById('area-chart-day').classList.add('active');

    btnCanva_year.classList.remove('active');
    btnCanva_mouth.classList.remove('active');
    btnCanva_week.classList.remove('active');
    btnCanva_day.classList.add('active');
}