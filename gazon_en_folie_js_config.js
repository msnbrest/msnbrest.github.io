const version= "0.23-09-28",



dev_prod= {

is_prod: true,

diapospeed: _=> dev_prod.is_prod? 1: 0.1,

};
