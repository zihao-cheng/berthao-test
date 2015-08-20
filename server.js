var http = require('http');
var fs = require('fs');
var url = require('url');
var filedir = [];
fs.readdir('www',function(err,file){
	console.log('readdir');
	lengthlast = file.length;//initzien lengthlast
	console.log('lengthlast:'+lengthlast);
	if (err) {
		throw('you have no "www" dir');
	};
for(var n=0;n<file.length;n++){
	filedir[n]=file[n];
}

fs.watch('www',function(event,filename){//observe dir.if dir is not changed,it doesn't work; someting error
	if (filename!== '.DS_Store') {
		print(filename+'changed');
		fs.readdir('www', function(err,file){
			if (err) {
				;
			};
			if (file.length>lengthlast) {//append file

			filedir.push(filename);
			lengthlast = file.length;
			console.log('append:'+lengthlast);
			}
			else if(file.length<lengthlast){
				 
				for(var j = 0;j<filedir.length;j++){
					if (filedir[j]==filename) {
						filedir.splice(j,1);
						lengthlast = file.length;
						console.log('remove:'+lengthlast);
					};
				}
				print(file);
			}
			else{
				print('save ok');
			}
		})
	}
	
});

http.createServer(function(req,res){
	var length = filedir.length;
	console.log('connact server');
	var urlobj = url.parse(req.url);
    if(urlobj&&urlobj.path!=='/favicon.ico'){	
	var filepath = urlobj.path;
}

	
	if (filepath == undefined) {

		res.writeHead(200,{
		'Content-Type':'text/html'
	});
	res.end('404 NOT FOUND');
		return;
	};

	function removefirst(str){
	var string = str;
	var arr = string.split('');
	arr.shift();
	return arr.join('');
   }
   var reqfile=removefirst(filepath);

 	
	for(var i=0;i<length;i++){//loop 2 ? why

		if ('/'+filedir[i]==filepath) {

		var data = fs.readFileSync('www'+filepath);//这里异步有问题，你异步去读文件，但是循环继续了，很快完成，报not found 文件来了已经over
		
		res.writeHead(200,{
		'Content-Type':'text/html'
	});
		if (!data) {
		res.end('something erro');
		};
	
		res.write(data,'bindary');
		res.end();
		break;
	    };
		if (i==(length-1)) {
			 
			res.end('404 NOT FOUND');
		};
	}
	
		
	}).listen(8080,'127.0.0.1');

 
 

});
console.log("server start");

function print(something){
	console.log(something);
}

