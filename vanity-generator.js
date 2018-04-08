importScripts('stellar.js');

var forever = false;

onmessage = function(event) {
    if(event.data.type=='run'){
        forever = true;
        generate(event.data);
    } else {
        forever = false;
    }
}

function generate(data) {
    console.log('Generating...', data);
    var find   = data.find;
    var place  = data.place;
    var num    = data.num;
    var prefix = data.prefix;
    var max    = [9,999,9999,99999,999999][find.length];
    var count  = 0;
    try {
        while (forever) {
            var keypair = StellarSdk.Keypair.random();
            var address = keypair.publicKey();
            var secret  = keypair.secret();
            var account = {publicKey:address, secretKey:secret};
            //console.log(account);
            count++;
            if(count % 100 == 0){ postMessage({type:'count', index:count}); }
            if(count > max){ forever = false; break; }
            if(place==1){ part = address.substr(56-num); }
            else { part = address.substr(prefix?0:2,num); }
            if(part==find){
                console.log('FOUND: ', account);
                postMessage({type:'found', index:count, account:account});
            }
        }
    } catch(ex) { 
        postMessage({type:'error', text:ex.message});
        return;
    }
    postMessage({type:'done', index:count});
}

