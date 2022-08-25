const {Parser} = require('json2csv');
const fs = require('fs');

// in iso 2 coding, value defined by un coding. holds only countries wuth direct flights to/from israel
//countries = {'AT':40};
// in iata coding. value defined by number of airports with direct flights to/from israel + country un code * 1000. total 147
airports = {'VIE':40001, 'BRU':56001, 'CRL':56002, 'BAH':48001, 'SOF':100001, 'VAR':100002, 'YUL':124001, 'YYZ':124002, 'PEK':156001, 'SZX':156002, 'CAN':156003,
'HKG':156004, 'PVG':156005, 'CTU':156006, 'LCA':196001, 'PFO':196002, 'PRG':203001, 'CPH':208001, 'CAI':818001, 'HEL':246001, 'LBG':250001, 'CDG':250002, 'ORY':250003,
'LYS':250004, 'BOD':250005, 'MRS':250006, 'NTE':250007, 'NCE':250008, 'TLS':250009, 'FKB':276001, 'BER':276002, 'DUS':276003, 'FRA':276004, 'HAM':276005, 'FMM':276006,
'MUC':276007, 'ATH':300001, 'SKG':300002, 'HER':300003, 'JTR':300004, 'JMK':300005, 'PAS':300006, 'CHQ':300007, 'CFU':300008, 'RHO':300009, 'ZTH':300010, 'KGS':300011,
'KLX':300012, 'BUD':348001, 'DEB':348002, 'BLR':356001, 'BOM':356002, 'DEL':356003, 'TLV':376001, 'BRI':380001, 'BLQ':380002, 'CTA':380003, 'MXP':380004, 'NAP':380005,
'FCO':380006, 'TRN':380007, 'VCE':380008, 'TSF':380009, 'VRN':380010, 'NRT':392001, 'VNO':440001, 'CAS':504001, 'RAK':504002, 'AMS':528001, 'EIN':528002, 'OSL':578001,
'MNL':608001, 'GDN':616001, 'KTW':616002, 'KRK':616003, 'LUZ':616004, 'POZ':616005, 'RZE':616006, 'WAW':616007, 'LIS':620001, 'OTP':642001, 'CLJ':642002, 'IAS':642003,
'SEZ':690001, 'LED':643001, 'DME':643002, 'KRR':643003, 'ROV':643004, 'AER':643005, 'MRV':643006, 'SVX':643007, 'LJU':705001, 'ZAG':191001, 'DBV':191002, 'RJK':191003,
'KBP':804001, 'HRK':804002, 'LWO':804003, 'ODS':804004, 'VIN':804005, 'OZH':804006, 'DNK':804007, 'GYD':31001, 'BUS':268001, 'TBS':268002, 'NVI':860001, 'TAS':860002,
'JNB':710001, 'CPT':710002, 'ARN':752001, 'GVA':756001, 'BSL':756002, 'MLH':756002, 'EAP':756002, 'ZRH':756003, 'BKK':764001, 'IST':792001, 'ADB':792002,  // bsl has 3 iata codes
'AYT':792003, 'AUH':784001, 'DXB':784002, 'LTN':826001, 'LHR':826002, 'MAN':826003, 'LGW':826004, 'ATL':840001, 'BOS':840002, 'ORD':840003, 'LAX':840004, 'MIA':840005,
'JFK':840006, 'SFO':840007, 'IAD':840008, 'MLA':470001, 'MEX':484001, 'RIX':428001, 'MAD':724001, 'BCN':724002, 'SAW':792004, 'EWR':840009, 'BOJ':100003, 'KIV':498001,
'ZIA':643008, 'DLM':792005, 'CMN':504003, 'BEG':688001, 'ADD':231001, 'PDL':620002, 'PVK':300013, 'BGY':380011, 'SSH':818002, 'AMM':400001, 'ETM':376002
};

//var d = new Date('2022-08-21 19:00:00');
//console.log(d.getHours());
//console.log(d.getDate())    
//console.log(d.getDay()+1);    // day of the week sun = 0, sat = 6
//console.log(d.getMonth()+1);  // jan = 0, dec = 11
//console.log(d.getFullYear());

// dep_airport | arr_airport | month | day-date | day_week | hour | duration | delay (result)
const fields = ['dep_airport', 'arr_airport', 'month', 'day_date', 'day_week', 'hour', 'duration', 'delay'];
const opt = {fields};
const parser = new Parser(opt);


fs.readFile('./ml/data.txt', 'utf-8', function(err, data){
    if(err){ console.log(err)}
    var d1 = JSON.parse(data);
    d1.forEach(element => {
        if(!airports[element.dep_iata]) {console.log(`dep: ${element.dep_iata}`)}
        if(!airports[element.arr_iata]) {console.log(`arr: ${element.arr_iata}`)}
        if(element.status == 'active' && airports[element.dep_iata] && airports[element.arr_iata] && element.duration){
            var delay = 0
            if(element.delayed){
                if(element.delayed > 15){ delay = 1}
                if(element.delayed > 60){ delay = 2}
            }
            try{
                var d = new Date(element.dep_time);
                var j = {
                    dep_airport: airports[element.dep_iata],
                    arr_airport: airports[element.arr_iata],
                    month: d.getMonth() + 1,
                    day_date: d.getDate(),
                    day_week: d.getDay() + 1,
                    hour: d.getHours(),
                    duration: element.duration,
                    delay: delay
                } 
                var js = parser.parse(j)
                fs.appendFile('./ml/dataset.csv', js.slice(83), function(error){
                    if(error) {throw error}
                })
            }
            catch (error) {
                console.log(error);
            }
        }
    });
})
