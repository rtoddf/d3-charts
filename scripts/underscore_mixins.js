var stateDefault = {
    'shortName': 'al',
    'longName': 'alabama'
}

function getTokens(){
    var tokens = [];
    var query = location.search
    query = query.slice(1);
    query = query.split('&');

    $.each(query, function(i,value){
        var token = value.split('=');
        var key = decodeURIComponent(token[0]);
        var data = decodeURIComponent(token[1]);
        tokens[key] = data;
    });

    return tokens;
}

function isDefined(obj){
    return typeof(obj) !== 'undefined' && obj !== null ? obj : ''
}

// underscore mixins
_.mixin({
    convertTitle: function(string) {
        if(string == 'senators'){
            string = string.substring(0, string.length - 1)
            return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
        } else {
            return 'Congress'
        }
    },
    capitalize: function(string) {
        return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
    },
    uppercase: function(string){
        return string.toUpperCase()
    },
    photo: function(string){
        return string.toLowerCase().replace(/ |\//g,'_').replace(/\(|\)|\.|\'|\,/g, '').replace('é', 'e').replace('ë', 'e').replace('á', 'a')
    },
    avatar: function(string){
        return string.toLowerCase().replace(/ |\//g,'_').replace(/\(|\)|\.|\'|\,/g, '').replace('é', 'e').replace('ë', 'e').replace('á', 'a')
    },
    initial: function(string){
        return string.charAt(0).toUpperCase()
    },
    convertTime: function(string){
        return moment(string).format('MM/DD/YYYY')
    },
    convertDate: function(string){
        return moment(string).format('MMMM D, YYYY')
    },
    convertDateTime: function(string){
        // return moment(moment(string), "YYYYMMDD").fromNow(true)
        return moment(string).format('MMMM D, YYYY, h:mm a')
    },
    convertTermDate: function(string){
        return moment(string, ['MM-DD-YYYY', 'YYYY-MM-DD']).format('MMMM D, YYYY')
    },
    convertUnixDate: function(string){
        return moment.unix(string).format('MMMM D, YYYY');
    },
    district: function(int){
        if(int == 0){
            return 'At Large'
        } else {
            return 'District ' + int
        }
    },
    percent: function(string) {
        return (parseFloat(string) * 100).toFixed(4)
    },
    population: function(string){
        while (/(\d+)(\d{3})/.test(string.toString())){
            string = string.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
        }
        return string;
    },
    toFixed: function(string) {
        return parseFloat(string).toFixed(2)
    },
    shortNamify: function(string) {
        return string.replace(/ |\//g,'_').replace(/\'|\,/g, '').toLowerCase()
    },
    terms: function(string){
        if(string == 1){
            return string + ' term'
        } else {
            return string + ' terms'
        }
    }
});
