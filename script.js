class Peg{
    constructor(ownerNo,pegNo){
        this.ownerNo=ownerNo;
        this.pegNo=pegNo;
        this.position=200+10*ownerNo+pegNo;
    }//Peg(말) 클래스입니다. 주인의 번호(0~3), 말의 번호(0~3), 위치를 초기화합니다.
}

class Player{
    constructor(name, playerNo){
        this.name=name;
        this.playerNo=playerNo;
        this.peg= [];
    }//Player(플레이어) 클래스입니다. 이름, 플레이어 번호(0~3), 말을 초기화합니다.
    set(){
        for(let i=0; i<4; i++){
            this.peg[i]=new Peg(this.playerNo, i);
        }
    }
}

function whereToGo(playerNo, now, advance){//playerNo: 플레이어의 번호(0,1,2,3) now: 말판 위 현재 위치 advance: 전진할 칸의 수(0~6)
    if(now===-1){//도달 불가에서 시작하면 언제나 도달 불가를 반환
        return -1;
    }

    if(now>=200 && advance===6){//집에 있는 경우 시작 지점으로 이동
        return playerNo*10;
    }
    else if(now>=200){//6이 나왔을 때만.
        return -1;
    }

    for(var i=0; i<advance; i++){//전진 횟수만큼 하나씩 차근차근 값을 변경
        if(now%10===9 && ((now+1)%40)===playerNo*10){//주차장 진입 시점
            now=100+playerNo*10;
        }
        else if(now>=100){//주차장 진입 후
            now++;
        }
        else{//그 외 일반적인 경로 위
            now=(now+1)%40;
        }
    }
    if(now>100 && now%10>3){//주차장 안쪽으로 더 깊이 들어갈 수 없습니다.
        return -1;
    }
    else if(isPeg(now, players)===playerNo){//해당 위치에 내 말이 있어도 갈 수 없습니다.
        return -1;
    }
    else{
        return now;//이 함수는 말판의 현재 위치에서 advance만큼 떨어진 위치의 칸 숫자를 반환합니다.
    }// 그러나 갈 수 있는 칸이 없다면 -1을 반환합니다.
}

function throwDice(){//1,2,3,4,5,6 중 하나를 무작위로 반환합니다.
    var res=Math.floor(Math.random() * 6) + 1;
    
    if(res==7)
        return 6;
    else
        return res;
}

function shuffle(arr){//배열의 대소비교 기능이 망가진 채 정렬합니다.(섞습니다.)
    arr.sort(() => Math.random()-0.5)
}

function isPeg(position,players){//특정 포지션에 어떤 말이 있는지 반환
    for(let i=0; i<4; i++){
        for(let j=0; j<4; j++){
            if(players[i].peg[j].position===position){
                return players[i].peg[j];
            }
        }
    }
    return new Peg(-1,-1);
}

function isAllInHome(me, players){//전부 집에 있을 시 true
    let allInHome=true;
    for(let i=0; i<4; i++){
        if(players[me].peg[i].position<200){
            allInHome=false;
        }
    }
    return allInHome;
}

function isAllInGoal(me, players){//전부 목적지에 있을 시 true
    let allInGoal=true;
    for(let i=0; i<4; i++){
        if(!(players[me].peg[i].position>=100 && players[me].peg[i].position<=133)){
            allInGoal=false;
        }
    }
    return allInGoal;
}

function whatToMove(me, dice, players){//주어진 환경에서 주사위 수가 주어졌을 때 움직일 peg 숫자 반환
    let number=[0,1,2,3];
    shuffle(number);//peg 우선순위를 섞어서 고려합니다

    if(isAllInHome(me,players)){//전부 집에 있으면 0번 말을 움직입니다.
        return 0;
    }

    for(let I=0; I<4; I++){//다른 말을 잡을 수 있는 내 말이 존재하는지를 먼저 검토합니다.
        let i=number[I];

        let dest=whereToGo(me,players[me].peg[i].position,dice);
        if(dest===-1){//해당 말이 움직일 수 없다면 무시
            continue;
        }
        if(isPeg(dest,players).ownerNo!=me && isPeg(dest,players).ownerNo!=-1){//전진할 곳에 잡을 수 있는 말이 있다면 그 말을 우선적으로 선택하여 반환
            return i;
        }
    }

    for(let I=0; I<4; I++){//0부터 3까지 무작위로 고려하되 
        let i=number[I];

        let dest=whereToGo(me,players[me].peg[i].position,dice);
        if(dest===-1){//해당 말이 움직일 수 없다면 무시
            continue;
        }
        if(isPeg(dest,players).ownerNo!=me){//전진할 곳에 내 말이 있지 않으면 그 말을 선택하여 반환
            return i;
        }
    }

    return -1;//옮길 말이 없으면 -1
}

function moveToThere(me,pegNo,dest,players){//내 말을 전진시키고 필요하다면 그 자리에 있던 말을 잡아 원래 집으로 돌려보냄.
    let catched=isPeg(dest,players);//잡을 말의 정보를 받습니다.
    
    if(catched.ownerNo===-1){//전진할 곳이 비어 있다면 내 말을 그 곳으로 교체
        players[me].peg[pegNo].position=dest;
        return -1;
    }
    else if(catched.ownerNo!=me){//전진할 곳에 어떤 말이 있다면 내 말을 그 곳에 두고 그 말을 제자리로 돌려보냄
        let catchedPlayer=catched.ownerNo;

        players[me].peg[pegNo].position=dest;
        catched.position=200+catched.ownerNo*10+catched.pegNo;
        return catchedPlayer;
    }
}

function wait(sec){
    let start=Date.now(), now=start;
    while(now-start<sec*1000){
        now=Date.now();
    }
}

function changePlayer(tothisman){
    document.querySelectorAll(".player").forEach(player=>{
        player.innerText='';
    })
    document.getElementById("player"+tothisman).innerText="⬇️";
}

function indicateDice(){
    dicenum=dice;
    document.getElementById("dice").src="./diceroll.gif";
    setTimeout(function(){
        document.getElementById("dice").src="./diceroll"+dicenum+".png";
    },1200)
}

function updateInterface(){
    while(previousPositions.length) {
        const position = previousPositions.pop();

        document.getElementById(`pixel-${position}`).innerText = "";
    }

    const emojis = ["🔵","🔴","🟡","🟢"]
    players.forEach((player, i) => {
        const pegs = player.peg;

        pegs.forEach((peg) => {
            const target = document.getElementById(`pixel-${peg.position}`);

            if(target) {
                previousPositions.push(peg.position);

                target.innerText = emojis[i];
            }
        })
    })

    if(nowPlayer===0){
        enableRoll=true;
    }
    changePlayer(nowPlayer);
}

window.addEventListener("load", () => {

    // pixel click
    document.querySelectorAll(".pixel").forEach(pixel => {
        /*
        Fill here
        */
        pixel.addEventListener("click", () => {//칸 클릭 시 
            if(pixel.classList.contains('select')){// 이동 가능한 곳이면(강조된 곳이면)
                let movingPeg;
                let advance=dice;
                if(isAllInHome(nowPlayer,players)){//내 말이 다 집에 있으면 전진량은 6인 셈 침.(집에서 나가기 위해)
                    advance=6;
                }

                let movablePeg=0;
                for(let i=0; i<4; i++){;//어떤 말의 이동인지 계산
                    if("pixel-"+selectableDest[i]===pixel.id){
                        movingPeg=i;
                        movablePeg++;
                    }
                }

                if(movablePeg!==1){//다수의 보기가 있는 경우
                    for(let i=0; i<4; i++){;//어떤 말의 이동인지 계산
                        if("pixel-"+selectableDest[i]===pixel.id){//다수의 보기 강조하기
                            document.getElementById("pixel-"+players[nowPlayer].peg[i].position).classList.add('moveable');
                        }
                    }
                    pixel.classList.add('here');
                    document.querySelectorAll(".pixel").forEach(pixel => {//강조된 칸 되돌리기
                        pixel.classList.remove('select');
                    })
                    return;
                }

                //말을 움직임.
                let dest=selectableDest[movingPeg];//그 말이 갈 곳을 계산 후
                console.log("Player no."+nowPlayer+" moved his peg no."+movingPeg+" which is in square no. "+players[nowPlayer].peg[movingPeg].position+",");
                let catchedPlayer=moveToThere(nowPlayer,movingPeg,dest,players);//그 칸으로 움직임
                console.log(" to square no. "+dest+"!");
        
                if(catchedPlayer!=-1){
                    console.log("Player no."+catchedPlayer+" loses a Peg!");
                }

                document.querySelectorAll(".pixel").forEach(pixel => {//강조된 칸 되돌리기
                    pixel.classList.remove('select');
                })
                updateInterface();

                if(isAllInGoal(nowPlayer,players)){//승리 체크
                    console.log("Player no."+nowPlayer+" WIN!!");
                    winFlag=true;
                    declareOfWin();
                    return;
                }

                if(dice!==6){//턴 넘기기
                    nowPlayer=(nowPlayer+1)%4;
                }
                
                otherTurns();
            }

            else if(pixel.classList.contains('moveable')){
                let clickedPeg=0;
                for(let i=0; i<4; i++){
                    if(pixel.id==="pixel-"+players[nowPlayer].peg[i].position){
                        clickedPeg=i;
                    }
                }

                let movingPeg=clickedPeg;
                let dest=selectableDest[movingPeg];//그 말이 갈 곳을 계산 후
                console.log("Player no."+nowPlayer+" moved his peg no."+movingPeg+" which is in square no. "+players[nowPlayer].peg[movingPeg].position+",");
                let catchedPlayer=moveToThere(nowPlayer,movingPeg,dest,players);//그 칸으로 움직임
                console.log(" to square no. "+dest+"!");
        
                if(catchedPlayer!=-1){
                    console.log("Player no."+catchedPlayer+" loses a Peg!");
                }

                document.querySelectorAll(".pixel").forEach(pixel => {//강조된 칸 되돌리기
                    pixel.classList.remove('moveable');
                    pixel.classList.remove('here');
                })
                updateInterface();

                if(isAllInGoal(nowPlayer,players)){//승리 체크
                    console.log("Player no."+nowPlayer+" WIN!!");
                    winFlag=true;
                    declareOfWin();
                    return;
                }

                if(dice!=6){//주사위 숫자가 6이 아니라면
                    console.log("Player no."+nowPlayer+" finishes the turn!");
                    nowPlayer=(nowPlayer+1)%4;//턴 넘김
                }
                else{//주사위 숫자가 6이라면 한번 더 할 수 있음.
                    console.log("Player no."+nowPlayer+" can roll the dice again!");
                }
                
                
                otherTurns();
            }
        })
    })

    // roll click
    document.querySelector("#roll").addEventListener("click", () => {
        if(enableRoll && nowPlayer===0){//내 차례가 아니면 굴려지지 않음
            Turn();
        }
    })
/*
    document.querySelector("#skip").addEventListener("click", () => {
        nowPlayer=(nowPlayer+1)%4;
        otherTurns();
    })//디버깅용 버튼
*/

});

let players = [];
for(let i=0; i<4; i++){
    players[i]= new Player("AI"+i,i);
    players[i].set();
}// 플레이어 생성

let turns=0;
//게임 진행 코드
let nowPlayer=0;//0번 플레이어부터 시작
let dice=1;
let enableRoll=true;
let winFlag=false;
let selectableDest=[];

let previousPositions = [];
updateInterface();

function Turn() {
    console.log("\nPlayer no."+nowPlayer+" takes the turn!");
    changePlayer(nowPlayer);//상태창 변경

    enableRoll=false;//주사위 굴리기 일시중지
    turns++;

    dice=1;
    if(!isAllInHome(nowPlayer,players)){//말이 전부 집에 있지 않으면
        dice=throwDice();//주사위를 던짐
        console.log("Player no."+nowPlayer+" rolled the dice and the result is "+dice+"!");
        indicateDice();//주사위 애니메이션
    }

    if(nowPlayer!==0){//내 차례가 아닌 경우
        let movingPeg=whatToMove(nowPlayer,dice,players);//움직일 말을 고르기

        if(movingPeg!=-1){//움직일 말이 있다면
            let advance=dice;
            if(isAllInHome(nowPlayer,players)){//내 말이 다 집에 있으면 전진량은 6인 셈 침.(집에서 나가기 위해)
                advance=6;
            }
            let dest=whereToGo(nowPlayer,players[nowPlayer].peg[movingPeg].position,advance);//그 말이 갈 곳을 계산 후
            console.log("Player no."+nowPlayer+" moved his peg no."+movingPeg+" which is in square no. "+players[nowPlayer].peg[movingPeg].position+",");
            let catchedPlayer=moveToThere(nowPlayer,movingPeg,dest,players);//그 칸으로 움직임
            console.log(" to square no. "+dest+"!");
    
            if(catchedPlayer!=-1){
                console.log("Player no."+catchedPlayer+" loses a Peg!");
            }
        }
        else{//없으면 패스
            console.log("Nothing to move! PASS!");
        }
    
        console.log("\nState of board:")//디버그용 보드 체커
        for(let i=0; i<4; i++){
            let str="Player no."+i+" || ";
            for(let j=0; j<4; j++){
                str+="Peg "+j+": "+players[i].peg[j].position+" | ";
            }
            console.log(str);
        }
    
        if(isAllInGoal(nowPlayer,players)){//승리 체크
            console.log("Player no."+nowPlayer+" WIN!!");
            winFlag=true;
            declareOfWin();
            return;
        }
    
        if(dice!=6){//주사위 숫자가 6이 아니라면
            console.log("Player no."+nowPlayer+" finishes the turn!");
            nowPlayer=(nowPlayer+1)%4;//턴 넘김
        }
        else{//주사위 숫자가 6이라면 한번 더 할 수 있음.
            console.log("Player no."+nowPlayer+" can roll the dice again!");
        }
    
        
        setTimeout(updateInterface,1500);//인터페이스 업데이트 후 주사위 굴리기 허용
    }
    else{//내 차례인 경우
        let movingPeg=whatToMove(nowPlayer,dice,players);//움직일 말을 고르기

        if(movingPeg!=-1){//움직일 말이 있다면

            let advance=dice;
            if(isAllInHome(nowPlayer,players)){//내 말이 다 집에 있으면 전진량은 6인 셈 침.(집에서 나가기 위해)
                advance=6;
            }
            for(let i=0; i<4; i++){
                selectableDest[i]=whereToGo(nowPlayer,players[nowPlayer].peg[i].position,advance);//말이 갈 곳을 각각 계산 한 뒤
            }

            setTimeout(()=>{
                for(let i=0; i<4; i++){
                    if(selectableDest[i]!==-1 && isPeg(selectableDest[i],players).ownerNo!==0){
                        document.getElementById("pixel-"+selectableDest[i]).classList.add('select');
                    }
                }
            },1250)//주사위가 굴러간 뒤 표시

        }
        else{//없으면 패스
            console.log("Nothing to move! PASS!");

            console.log("\nState of board:")//디버그용 보드 체커
            for(let i=0; i<4; i++){
                let str="Player no."+i+" || ";
                for(let j=0; j<4; j++){
                    str+="Peg "+j+": "+players[i].peg[j].position+" | ";
                }
                console.log(str);
            }
        
            if(isAllInGoal(nowPlayer,players)){//승리 체크
                console.log("Player no."+nowPlayer+" WIN!!");
                winFlag=true;
                declareOfWin();
                return;
            }
        
            if(dice!=6){//주사위 숫자가 6이 아니라면
                console.log("Player no."+nowPlayer+" finishes the turn!");
                nowPlayer=(nowPlayer+1)%4;//턴 넘김
            }
            else{//주사위 숫자가 6이라면 한번 더 할 수 있음.
                console.log("Player no."+nowPlayer+" can roll the dice again!");
            }
        
            
            setTimeout(updateInterface,1500);//인터페이스 업데이트 후 주사위 굴리기 허용
            setTimeout(otherTurns,1500);//그 외 턴 진행
        }
    }


    
}

function otherTurns(){//내 턴이 돌아올 때까지 턴을 계속함
    if(!(nowPlayer===0 || winFlag)){
        Turn();
    }
    var timer=setInterval(function(){
        if(nowPlayer===0 || winFlag){
            clearInterval(timer);
        }
        if(!(nowPlayer===0 || winFlag)){
            Turn();
        }
        if(nowPlayer===0 || winFlag){
            clearInterval(timer);
        }
    },2000) 
}

function declareOfWin(){// 승리 시 선언되는 함수
    updateInterface();
    alert(nowPlayer+" Win!!")
}


