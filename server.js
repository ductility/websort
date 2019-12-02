var http = require('http');
var fs = require('fs'); // 파일 읽기, 쓰기 등 을 할 수 있는 모듈
var Request = require('request'); // Post 요청을 하기 위한 request 모듈
var serialPort  = require('serialport');
var url = require('url');
 
// 404 error message : 페이지 오류가 발생했을때,
function send404Message(response){
    response.writeHead(404,{"Content-Type":"text/plain"}); // 단순한 글자 출력
    response.write("404 ERROR... ");
    response.end();
}

//serialPort 설정

var ArdoinoPort = new serialPort('COM6',{
    baudRate : 9600,
    // defaults for Arduino serial communication
    dataBits : 8,
    parity : 'none',
    stopBits: 1,
    flowControl: false,
})

ArdoinoPort.on('open', function () {
    console.log('open serial communication');
})

 
// 200 Okay : 정상적인 요청
function onRequest(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;

    if(request.method == 'GET' && queryData.sendNum !=null){
        response.writeHead(200);
        console.log(queryData);
        console.log(queryData.sendNum,queryData.white,queryData.black);
        ArdoinoPort.write(queryData.sendNum+'\n');
    }
 
    if(request.method == 'GET' && _url == '/'){
        response.writeHead(200,{"Content-Type":"text/html"}); // 웹페이지 출력
        fs.createReadStream("./index.html").pipe(response); // 같은 디렉토리에 있는 index.html를 response 함
        
    }else if(request.method == 'GET' && _url == '/0'){
        response.writeHead(200,{"Content-Type":"text/html"}); //view열기
        //fs.createReadStream("./index.html").pipe(response);
        console.log('0');
        ArdoinoPort.write('0\n');
    
    }else if(request.method == 'GET' && _url == '/1'){
        response.writeHead(200,{"Content-Type":"text/html"}); //view열기
        //fs.createReadStream("./index.html").pipe(response);
        console.log('1');
        ArdoinoPort.write('1\n');
 
    }else if(request.method == 'GET' && _url == '/2'){
        response.writeHead(200,{"Content-Type":"text/html"}); //view열기
        //fs.createReadStream("./index.html").pipe(response);
        console.log('2');
        ArdoinoPort.write('2\n');
 
    }else {
        // file이 존재 하지않을때,
        send404Message(response);
 
    } 
}

    var whiteNum = null;
    var blackNum = null;
    //white black 데이터 보내기
    var DataObj = {white : whiteNum, black: blackNum};
    Request.post({
        headers: {'content-type': 'application/json'},
        url : 'http://sior2.run.goorm.io/',
        body : DataObj,
        json: true
    },
    function(error,res){}
    );




var Myport = 8000;
http.createServer(onRequest).listen(Myport, function(){
    console.log("Server Listening on port number", Myport);
});