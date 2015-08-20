var d=[];
for(var i = 0; i < 10; i++){
	d.push(i);
}
console.log(d.join());
d=d.map(function(o,k){
	return o*3+k;
});
console.log(d.join());
