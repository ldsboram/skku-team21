var ele_canvas = document.getElementById("p-canvas");
      
var draw = ele_canvas.getContext("2d");


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


//빨간색 부분
draw.beginPath();
draw.fillStyle = "red"; 
draw.strokeStyle = "red";       
for (let i = 0; i < 5; i++){
    draw.rect(2+i*40, 2, 40, 40);
    draw.rect(2, 2+i*40, 40, 40);
    draw.rect(162, 2+i*40, 40, 40);
    draw.rect(2+i*40, 162, 40, 40);        
}
draw.fill(); 
draw.closePath();


//노란색 부분
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

//파란색 부분
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


//초록색 부분
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

//검은색 부분
//보드의 정중앙을 나타내기 위함
draw.beginPath();
draw.fillStyle = "black";
draw.strokeStyle = "black";
draw.rect(252, 252, 49, 49);
draw.fill();
draw.closePath();

