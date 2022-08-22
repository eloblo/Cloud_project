// in iso 2 coding, value defined by un coding. holds only countries wuth direct flights to/from israel
countries = {'AT':40};
// in iata coding. value defined by number of airports with direct flights to/from israel + country value * 1000. total 136
airports = {'VIE':40001, 'BRU':56001, 'CRL':56002, 'BAH':48001, 'SOF':100001, 'VAR':100002, 'YUL':124001, 'YYZ':124002, 'PEK':156001, 'SZX':156002, 'CAN':156003,
'HKG':156004, 'PVG':156005, 'CTU':156006, 'LCA':196001, 'PFO':196002, 'PRG':203001, 'CPH':208001, 'CAI':818001, 'HEL':246001, 'LBG':250001, 'CDG':250002, 'ORY':250003,
'LYS':250004, 'BOD':250005, 'MRS':250006, 'NTE':250007, 'NCE':250008, 'TLS':250009, 'FKB':276001, 'BER':276002, 'DUS':276003, 'FRA':276004, 'HAM':276005, 'FMM':276006,
'MUC':276007, 'ATH':300001, 'SKG':300002, 'HER':300003, 'JTR':300004, 'JMK':300005, 'PAS':300006, 'CHQ':300007, 'CFU':300008, 'RHO':300009, 'ZTH':300010, 'KGS':300011,
'KLX':300012, 'BUD':348001, 'DEB':348002, 'BLR':356001, 'BOM':356002, 'DEL':356003, 'TLV':376001, 'BRI':380001, 'BLQ':380002, 'CTA':380003, 'MXP':380004, 'NAP':380005,
'FCO':380006, 'TRN':380007, 'VCE':380008, 'TSF':380009, 'VRN':380010, 'NRT':392001, 'VNO':440001, 'CAS':504001, 'RAK':504001, 'AMS':528001, 'EIN':528002, 'OSL':578001,
'MNL':608001, 'GDN':616001, 'KTW':616002, 'KRK':616003, 'LUZ':616004, 'POZ':616005, 'RZE':616006, 'WAW':616007, 'LIS':620001, 'OTP':642001, 'CLJ':642002, 'IAS':642003,
'SEZ':690001, 'LED':643001, 'DME':643002, 'KRR':643003, 'ROV':643004, 'AER':643005, 'MRV':643006, 'SVX':643007, 'LJU':705001, 'ZAG':191001, 'DBV':191002, 'RJK':191003,
'KBP':804001, 'HRK':804002, 'LWO':804003, 'ODS':804004, 'VIN':804005, 'OZH':804006, 'DNK':804007, 'GYD':31001, 'BUS':268001, 'TBS':268002, 'NVI':860001, 'TAS':860002,
'JNB':710001, 'CPT':710002, 'ARN':752001, 'GVA':756001, 'BSL':756002, 'MLH':756002, 'EAP':756002, 'ZRH':756003, 'BKK':764001, 'IST':762001, 'ADB':762002,  // bsl has 3 iata codes
'AYT':762003, 'AUH':784001, 'DXB':784002, 'LTN':826001, 'LHR':826002, 'MAN':826003, 'LGW':826004, 'ATL':840001, 'BOS':840002, 'ORD':840003, 'LAX':840004, 'MIA':840005,
'JFK':840006, 'SFO':840007, 'IAD':840008, 'MLA':470001, 'MEX':484001, 'RIX':428001
};
// in iata coding. value defined by arbetrary numbering.
airlines = {};