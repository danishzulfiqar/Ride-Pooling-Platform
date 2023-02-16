var flag = 0;

function navChange() {
    var sideNav = document.getElementById("controls");
    var mapi = document.getElementById("map");

    if (flag == 0) {
        sideNav.style.display = "none";
        mapi.style.width = "100%";
        flag = 1;
    }

    else if(flag==1)
    {
        sideNav.style.display = "flex";
        mapi.style.width = "80%";
        flag = 0;
    }
}