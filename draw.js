var ele_canvas = document.getElementById("p-canvas");
      
var draw = ele_canvas.getContext("2d");

//가장 기본적인 칸
draw.beginPath();
draw.fillStyle = "white";
draw.strokeStyle = "black";
draw.lineWidth = "1";
for (let i = 0; i < 11; i++){
    for (let j = 0; j < 11; j++){
        draw.rect(2+i*50, 2+j*50, 49, 49)
    }
}
draw.stroke();
draw.fill();
draw.closePath();


//빨간색 경계
draw.beginPath();
draw.fillStyle = "red"; 
for (let i = 0; i < 5; i++){
    draw.rect(2+i*40, 2, 40, 40);
    draw.rect(2, 2+i*40, 40, 40);
    draw.rect(162, 2+i*40, 40, 40);
    draw.rect(2+i*40, 162, 40, 40);   
}
draw.fill(); 
draw.closePath();

//빨간색 시작 칸
draw.beginPath();
draw.strokeStyle = "red";
draw.lineWidth = "3"
draw.rect(2, 202, 50, 50);
draw.stroke();
draw.closePath();

//빨간색 길
draw.beginPath();
draw.fillStyle = "red"
draw.strokeStyle = "red"
draw.lineWidth = "1"
for (let i = 0; i < 5; i++){
    draw.rect(2+i*50, 252, 49, 49)
}
draw.fill()
draw.closePath();


//노란색 경계
draw.beginPath();
draw.fillStyle = "yellow";
draw.strokeStyle = "yellow";
for (let i = 0; i < 5; i++){
    draw.rect(352+i*40, 2, 40, 40);
    draw.rect(352, 2+i*40, 40, 40);
    draw.rect(512, 2+i*40, 40, 40);
    draw.rect(352+i*40, 162, 40, 40);        
    draw.fill();  
}
draw.closePath();

//노란색 시작 칸
draw.beginPath();
draw.strokeStyle = "yellow";
draw.lineWidth = "3"
draw.rect(302, 2, 50, 50);
draw.stroke();
draw.closePath();

//노란색 길
draw.beginPath();
draw.fillStyle = "yellow"
draw.strokeStyle = "yellow"
draw.lineWidth = "1"
for (let i = 0; i < 5; i++){
    draw.rect(252, 2+i*50, 49, 49)
}
draw.fill()
draw.closePath();


//파란색 경계
draw.beginPath();
draw.fillStyle = "blue";
draw.strokeStyle = "blue";
for (let i = 0; i < 5; i++){
    draw.rect(2+i*40, 352, 40, 40); 
    draw.rect(2, 352+i*40, 40, 40);
    draw.rect(162, 352+i*40, 40, 40);
    draw.rect(2+i*40, 512, 40, 40);        
    draw.fill();  
}
draw.closePath();

//파란색 시작 칸
draw.beginPath();
draw.strokeStyle = "blue";
draw.lineWidth = "3"
draw.rect(202, 502, 50, 50);
draw.stroke();
draw.closePath();

//파란색 길
draw.beginPath();
draw.fillStyle = "blue"
draw.strokeStyle = "blue"
draw.lineWidth = "1"
for (let i = 0; i < 5; i++){
    draw.rect(252, 302+i*50, 49, 49)
}
draw.fill()
draw.closePath();


//초록색 경계
draw.beginPath();
draw.fillStyle = "green";
draw.strokeStyle = "green";
for (let i = 0; i < 5; i++){
    draw.rect(352+i*40, 352, 40, 40);
    draw.rect(352, 352+i*40, 40, 40);
    draw.rect(512, 352+i*40, 40, 40);
    draw.rect(352+i*40, 512, 40, 40);        
    draw.fill();   
}
draw.closePath();

//초록색 시작 칸
draw.beginPath();
draw.strokeStyle = "green";
draw.lineWidth = "3"
draw.rect(502, 302, 50, 50);
draw.stroke();
draw.closePath();

//초록색 길
draw.beginPath();
draw.fillStyle = "green"
draw.strokeStyle = "green"
draw.lineWidth = "1"
for (let i = 0; i < 5; i++){
    draw.rect(302+i*50, 252, 49, 49)
}
draw.fill()
draw.closePath();

//검은색 부분
//보드의 정중앙을 나타내기 위함
draw.beginPath();
draw.fillStyle = "black";
draw.strokeStyle = "black";
draw.rect(252, 252, 49, 49);
draw.fill();
draw.closePath();

