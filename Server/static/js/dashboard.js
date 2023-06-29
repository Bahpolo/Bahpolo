var headerItem_date = document.getElementsByClassName("header_item-date")[0];
var headerItem_hour = document.getElementsByClassName("header_item-hour")[0];
var headerItem_ip_client = document.getElementsByClassName("header_item-ip_client")[0];
var headerItem_navigator = document.getElementsByClassName("header_item-navigator")[0];
var headerItem_os = document.getElementsByClassName("header_item-os")[0];
var headerItem_ip_serveur = document.getElementsByClassName("header_item-ip_serveur")[0];

var item_date = document.getElementsByClassName("item-date");
var item_hour = document.getElementsByClassName("item-hour");
var item_ip_client = document.getElementsByClassName("item-ip_client");
var item_navigator = document.getElementsByClassName("item-navigator");
var item_os = document.getElementsByClassName("item-os");
var item_ip_serveur = document.getElementsByClassName("item-ip_serveur");

var headerItem_machine_name = document.getElementsByClassName("header_item-machine_name")[0];
var headerItem_machine_ip = document.getElementsByClassName("header_item-machine_ip")[0];
var headerItem_UUID = document.getElementsByClassName("header_item-UUID")[0];
var headerItem_statut = document.getElementsByClassName("header_item-statut")[0];

var item_machine_name = document.getElementsByClassName("item-machine_name");
var item_machine_ip = document.getElementsByClassName("item-machine_ip");
var item_UUID = document.getElementsByClassName("item-UUID");
var item_statut = document.getElementsByClassName("item-statut");

for (var i = 0; i < item_date.length; i++) {
    headerItem_date.style.width = item_date[0].offsetWidth+"px";
    headerItem_hour.style.width = item_hour[0].offsetWidth+"px";
    headerItem_ip_client.style.width = item_ip_client[0].offsetWidth+"px";
    headerItem_navigator.style.width = item_navigator[0].offsetWidth+"px";
    headerItem_os.style.width = item_os[0].offsetWidth+"px";
    headerItem_ip_serveur.style.width = item_ip_serveur[0].offsetWidth+"px";
    
    item_date[i].style.width = headerItem_date.offsetWidth+"px";
    item_hour[i].style.width = headerItem_hour.offsetWidth+"px";
    item_ip_client[i].style.width = headerItem_ip_client.offsetWidth+"px";
    item_navigator[i].style.width = headerItem_navigator.offsetWidth+"px";
    item_os[i].style.width = headerItem_os.offsetWidth+"px";
    item_ip_serveur[i].style.width = headerItem_ip_serveur.offsetWidth+"px";
}
    
for (var i = 0; i < item_machine_name.length; i++) {
    headerItem_machine_name.style.width = item_machine_name[0].offsetWidth+"px";
    headerItem_machine_ip.style.width = item_machine_ip[0].offsetWidth+"px";
    headerItem_UUID.style.width = item_UUID[0].offsetWidth+"px";
    headerItem_statut.style.width = item_statut[0].offsetWidth+"px";
    
    item_machine_name[i].style.width = headerItem_machine_name.offsetWidth+"px";
    item_machine_ip[i].style.width = headerItem_machine_ip.offsetWidth+"px";
    item_UUID[i].style.width = headerItem_UUID.offsetWidth+"px";
    item_statut[i].style.width = headerItem_statut.offsetWidth+"px";
}