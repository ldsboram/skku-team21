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

let players = [];
for(let i=0; i<4; i++){
    players[i]= new Player("AI"+i,i);
    players[i].set();
}// 플레이어 생성

let turns=0;
//게임 진행 코드
let nowPlayer=0;//0번 플레이어부터 시작
while(true){
    console.log("\nPlayer no."+nowPlayer+" takes the turn!");
    turns++;

    let dice=1;
    if(!isAllInHome(nowPlayer,players)){//말이 전부 집에 있지 않으면
        dice=throwDice();//주사위를 던짐
        console.log("Player no."+nowPlayer+" rolled the dice and the result is "+dice+"!");
    }
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
        break;
    }

    if(dice!=6){//주사위 숫자가 6이 아니라면
        console.log("Player no."+nowPlayer+" finishes the turn!");
        nowPlayer=(nowPlayer+1)%4;//턴 넘김
    }
    else{//주사위 숫자가 6이라면 한번 더 할 수 있음.
        console.log("Player no."+nowPlayer+" can roll the dice again!");
    }

    //wait(8);//디버깅용, 8초 대기
    
}
console.log(turns+" turns passed to finish the game.");

export{
    Peg,
    Player,
    whereToGo,
    throwDice,
    isPeg,
    isAllInHome,
    isAllInGoal,
    whatToMove,
    moveToThere,
}