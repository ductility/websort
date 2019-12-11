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

//*******************************COM포트 확인!!!********************************************** */
//serialPort 설정
var ArdoinoPort = new serialPort('COM3',{
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
        ArdoinoPort.write(queryData.sendNum+'\n');
        //white black 데이터 보내기
        var DataObj = {white : queryData.white, black: queryData.black};
        Request.post({
            headers: {'content-type': 'application/json'},
            url : 'http://sior2.run.goorm.io/',
            body : DataObj,
            json: true
        },
        function(error,res){}
        );
    }
 
    if(request.method == 'GET' && _url == '/'){
        response.writeHead(200,{"Content-Type":"text/html"}); // 웹페이지 출력
        fs.createReadStream("./index.html").pipe(response); // 같은 디렉토리에 있는 index.html를 response 함
    }else {
        // file이 존재 하지않을때,
        send404Message(response);
    } 
}


var Myport = 1398;
http.createServer(onRequest).listen(Myport, function(){
    console.log("Server Listening on port number", Myport);
});