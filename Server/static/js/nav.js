let nav = document.getElementsByClassName('nav-left')[0];
let navSousItem = document.getElementsByClassName('nav-item_sub-menu');

function toggleNav(i){
	console.log(i);
	console.log(navSousItem);
	console.log(navSousItem[i]);
	if (navSousItem[i].classList.contains("active")) {
		navSousItem[i].classList.remove("active");
	} else {
		navSousItem[i].classList.add("active");
		if (!nav.classList.contains("active")) {
			nav.classList.add("active");
		}
	};
	for (var o = 0; o < navSousItem.length; o++) {
		if (o != i) {
			navSousItem[o].classList.remove("active");
			console.log(navSousItem[o]);
		}
	};
}

function getOrder(oEvent){
	var oLi = oEvent.currentTarget,
	iIndex = oLi.getAttribute('data-order');
	toggleNav(iIndex-1);
};

document.addEventListener('DOMContentLoaded',function(){
	var oUl = document.getElementsByClassName("nav-sub_menu_group")[0];
	for(let i=0; i< oUl.children.length;i++){
		let oLi = oUl.children[i];
		oLi.addEventListener('click', getOrder);
		oLi.setAttribute('data-order', i+1);
	}
});