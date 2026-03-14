export var BoolStorage = {
    set: function(name, type, value) {
        value = value ? '1' : '0'
        sessionStorage.setItem( type + '_' + name, value )
    },
    get: function(name) {
        return sessionStorage.getItem(name) === '1'
    },
    exist: function(name) {
        return !!sessionStorage.getItem(name);
    }
}
