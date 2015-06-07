function mhcArrayContains(a, obj) {
    console.log("Seeking obj in array.  Object sought is: " + obj);
    console.log("Array size is: ");
    console.log(a);
    for (var i = 0; i < a.length; i++) {
        console.log("Array element " + i + ": ");
        console.log(a[i]);
        if (a[i] == obj) {
            return true;
        }
    }
    return false;
}

function mhcEventIsConfirmed(event) {
    if (event.extendedProperties) {
    return true;
}
}
function mhcEventHasStaff(event) {
    if (event.extendedProperties) {
    return true;
}
}

function mhcEventIsComplete(event) {
    return true;
}
