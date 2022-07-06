/* 10として扱うカードを定義 */
const treat10Card:string[] = new Array("J","Q","K")

/* カードの種類データ(A~K)を作成 */
const cardType:string[] = new Array//
cardType.push("A")
for(let i:number=2;i<=10;i++){
    cardType.push(String(i))
}
for(let i:number=0;i<treat10Card.length;i++){
    cardType.push(treat10Card[i])
}

/* アクションコマンド定義(これに合致するものがあればコマンドを実行) */
const hit:string[] = new Array("HIT","Hit","hit","ヒット","ひっと")
const stand:string[] = new Array("STAND","Stand","stand","スタンド","すたんど","STAY","Stay","stay","ステイ","すてい")
const split:string[] = new Array("SPLIT","Split","split","スプリット","すぷりっと")
const doubleDown:string[] = new Array("DOUBLE DOWN","Double Down","Double down","double down","DOUBLEDOWN","DoubleDown","Doubledown","doubledown","DOUBLE","Double","double","ダブルダウン","だぶるだうん","ダブル","だぶる")
const surrender:string[] = new Array("SURRENDER","Surrender","surrender","サレンダー","されんだー")
const insurance:string[] = new Array("INSURANCE","Insurance","insurance","インシュアランス","いんしゅあらんす","インシュランス","いんしゅらんす")

/* 変数・配列定義 */
let deck:string[] = new Array//山札用の配列
let dealerHand:string[] = new Array//ディーラーの手札用の配列
let playerHand:string[] = new Array//プレイヤーの手札用の配列
let pocket:number=1000//所持金変数
const defaultLatch:number=100//初期掛け金設定
let latch:number//掛け金変数
let insuranceMoney:number=0//保険金変数
let countInsurance:boolean=false//インシュアランスしたことがあるかどうか
let playTimes:number=0//プレイ回数
let totalWin:number=0//総勝ち金
let totalLose:number=0//総負け金
let splitPhase:number=0//スプリット用段階変数
let splitHand:string[]=new Array//スプリット手札用配列
let splitLatch:number=0//スプリット用掛け金



/* ★0.ブラックジャックを終了するメソッド */
function endBlackJack():void{
    console.log("GAME END")
    console.log("Finally you won "+totalWin+"$.")
    console.log("Finally you lost "+totalLose+"$.")
    console.log("Finally you got "+pocket+"$.")
    if(playTimes == 0){
        console.log("You played Black Jack no times.")
    }else if(playTimes == 1){
        console.log("You played Black Jack "+playTimes+" time.")
    }else{
        console.log("You played Black Jack "+playTimes+" times.")
    }//最終所持金と総プレイ回数を表示
}

/* ★1.掛け金を提示させるメソッド */
function declareLatch():void{
    insuranceMoney=0//保険金の初期化
    countInsurance=false//インシュランスしたことがあるかどうかの初期化
    splitPhase=0//スプリット段階の初期化
    splitHand.splice(0)//スプリット手札の初期化
    splitLatch=0//スプリット掛け金の初期化
    bet(window.prompt(showPOCKET()+"\n"+"How much money do you bet?",String(defaultLatch)))//ベットする、"3桁処理をして所持金を表示 改行 いくらベットするか聞く"
}

/* ベットするメソッド */
function bet(latchStr:string):void{
    latch=Number(latchStr)//window.promptは文字列しか入力できないので数列に変換
    if(isNaN(latch)){//文字列をベットしようとしていた場合、数列をベットするように警告し、もう一度ベットさせる
        window.alert("Please enter a \"Number\".")
        declareLatch()
    }else if(latchStr == null){//null(入力がキャンセルされた)の場合、ブラックジャックゲームを終了する
        endBlackJack()//★0.ブラックジャックゲームを終了
    }else if(latch == 0 || latchStr == ""){//空文字か0でベットしようとしていた場合、ベットするように警告し、もう一度ベットさせる
        window.alert("Please bet.")
        declareLatch()
    }else if(latch < 0){//負の数をベットしようとしていた場合、自然数でベットするように警告し、もう一度ベットさせる
        window.alert("Please enter a \"Natural number\".")
        declareLatch()
    }else if(latch > pocket){//所持金より多くのお金をベットしようとしていた場合、ベットできる数をベットするように警告し、もう一度ベットさせる
        window.alert("Please enter a \"Number you can bet\".")
        declareLatch()
    }else if(latch % 1 != 0){//整数じゃないお金をベットしようとしていた場合、整数でベットするように警告し、もう一度ベットさせる
        window.alert("Please enter a \"Whole number\".")
        declareLatch()
    }else{//ベット処理
        makeDeck()//★2．山札を作成
    }
}

/* ★2.山札を作成するメソッド */
function makeDeck():void{
    deck.splice(0)//山札を初期化(中身を全消去)
    for(let i:number=0;i<cardType.length;i++){//カードの種類分を
        for(let j:number=0;j<4;j++){//それぞれ4枚山札に追加
            deck.push(cardType[i])
        }
    }
    dealCard()//★3.ディーラーとプレイヤーにカードを配る
}

/* ★3.ディーラーとプレイヤーにカードを配るメソッド */
function dealCard():void{//[ディーラーから先に山札を引く仕様]
    dealerHand.splice(0)//ディーラーの手札を初期化(中身を全消去)
    for(let i:number=0;i<2;i++){//ディーラーのカードを2枚配る処理
        drawCard("dealer")
    }
    playerHand.splice(0)//プレイヤーの手札を初期化(中身を全消去)
    for(let i:number=0;i<2;i++){//プレイヤーのカードを2枚配る処理
        drawCard("player")
    }
    declareAction()//★4.行動を提示
}

/* カードを配るメソッド */
function drawCard(side:string):string{
    let drawPlace:number=Math.floor(Math.random()*deck.length)//ランダムに山札から1枚指定
    if(side == "player"){
        playerHand.push(deck[drawPlace])//指定したカードをプレイヤーの手札に追加
        deck.splice(drawPlace,1)//指定したカードを1枚山札から削除
        return playerHand[(playerHand.length)-1]//戻り値として引いたカードを返す
    }else if(side == "dealer"){
        dealerHand.push(deck[drawPlace])//指定したカードをディーラーの手札に追加
        deck.splice(drawPlace,1)//指定したカードを1枚山札から削除
        return dealerHand[(dealerHand.length)-1]//戻り値として引いたカードを返す
    }else{
        return "error"
    }
}

/* ★4.行動を提示させるメソッド */
function declareAction():void{//プレイヤーのバースト(とナチュラルブラックジャック)はここで処理する
    if(calculateSum("player") > 21){//プレイヤーがバーストなら強制バースト処理
        processResult("player")
        return
    }
    playerAction(window.prompt(showUPCARD()+"\n"+showHAND("player")+"\n"+showTOTAL("player")+"\n"+showBET()+"\n"+showPOCKET()+"\n"+"Please enter the your action.","stand"))//★5.プレイヤーに行動を提示させ、行動を処理
    /* 
    ディーラーのアップカードを表示
    プレイヤーの手札を表示
    プレイヤーの合計数を計算して表示
    プレイヤーの掛け金を表示
    プレイヤーに行動を提示させる
     */
}

/* 色々表示する用メソッド達 */
function showPOCKET():string{//プレイヤーの持ち金を表示
    return　"You have "+pocket.toLocaleString()+"$."
}
function showUPCARD():string{//ディーラーのアップカードを表示
    return "The dealer's the UP CARD is \""+dealerHand[0]+"\"."
}
function showHAND(side:string=""):string{//手札を表示
    if(side == "player"){//プレイヤーの手札を表示
        let showPlayerHand:string=""//プレイヤーの手札用配列を1つに統合して代入する用の変数
        for(let i:number=0;i<playerHand.length;i++){//プレイヤーの手札の回数、
            showPlayerHand=showPlayerHand+"\""+playerHand[i]+"\","//プレイヤーの手札の配列を、「,」で分けて変数に統合
        }
        showPlayerHand=showPlayerHand.slice(0,-1)//末尾の「,」を削除
        return "YOUR HAND:"+showPlayerHand
    }else if(side == "dealer"){
        let showDealerHand:string=""//ディーラーの手札用配列を1つに統合して代入する用の変数
        for(let i:number=0;i<dealerHand.length;i++){//ディーラーの手札の回数、
            showDealerHand=showDealerHand+"\""+dealerHand[i]+"\","//ディーラーの手札の配列を、「,」で分けて変数に統合
        }
        showDealerHand=showDealerHand.slice(0,-1)//末尾の「,」を削除
        return "DEALER's HAND:"+showDealerHand
    }else{
        return "error"
    }

}
function showTOTAL(side:string=""):string{//合計数を計算して表示
    if(side == "player"){
        return "YOUR TOTAL:"+calculateSum("player")
    }else if(side == "dealer"){
        return "DEALER's TOTAL:"+calculateSum("dealer")
    }
    //return "TOTAL:"+calculateSum("player")
    return ""
}
function showBET():string{//プレイヤーの掛け金を表示
    return "BET:"+latch+"$"
}
function showSPLITHAND():string{//スプリット用手札を表示
if(splitPhase==0){
    return ""
}else{
    return "SPLIT HAND:"+splitHand
}
}

/* カードの合計値を計算するメソッド */
function calculateSum(subject:string):number{
    /* 一度手札配列をAが最後になるように並べ替える */
    let countA:number=0//Aが手札に何枚あるか数える用の変数
    let cashHand:string[]= new Array//Aを最後になるように並べ替える用の配列
    if(subject == "player"){//プレイヤーの手札配列をAが最後になるように並べ替えた仮配列を作成する処理
        for(let i:number=0;i<playerHand.length;i++){//プレイヤーの手札のAの枚数を数えて、
            if(playerHand[i] == "A"){
                countA++
            }
        }
        cashHand=playerHand.filter(function(item:string):boolean{//プレイヤーの手札配列を元にAが抜かれた配列を作成し、
          return item != "A"
        })
        for(let i:number=0;i<countA;i++){//Aが抜かれた配列の最後にAを追加する
            cashHand.push("A")
        }
    }else if(subject == "dealer"){//ディーラーの手札配列をAが最後になるように並べ替え
        for(let i:number=0;i<dealerHand.length;i++){//ディーラーの手札のAの枚数を数えて、
            if(dealerHand[i] == "A"){
                countA++
            }
        }
        cashHand=dealerHand.filter(function(item:string):boolean{//ディーラーの手札配列を元にAが抜かれた配列を作成し、
          return item != "A"
        })
        for(let i:number=0;i<countA;i++){//Aが抜かれた配列の最後にAを追加する
            cashHand.push("A")
        }
    }

    /* 合計数を計算する */
    let cardSum:number=0
    for(let i:number=0;i<cashHand.length;i++){
        if(treat10Card.includes(cashHand[i])){//J,Q,Kを10として扱う
            cardSum+=10
        }else if(cashHand[i] == "A"){//Aを1か11として扱う
            if(countA > 1){//手札にAが2枚以上ある場合、最後のA以外はすべて1として扱う
                cardSum+=1
                countA--//処理したAを～～～……なんて書いたらいいかわかんないのでソースコードを自分で読もう！！！
            }else{//Aを1か11として扱う
                cardSum+=processA(cardSum)
            }
        }else{
            cardSum+=Number(cashHand[i])
        }
    }
    return cardSum

    /* Aを1と扱うか11と扱うか判断するメソッド */
    function processA(sum:number):number{//現在合計数を入れると、Aの扱い方を判断して、1か11を返してくれる
        if(sum+11>21){//Aを11として扱ってバーストする場合、
            return 1
        }else{//バーストしない場合、
            return 11
        }
    }
}

/* ★5.プレイヤーの行動を処理するメソッド */
function playerAction(action:string):void{
    const dealerInformation:string=showHAND("dealer")+"\n"+showTOTAL("dealer")
    const playerInformation:string=showHAND("player")+"\n"+showTOTAL("player")  
    if(stand.includes(action)){//スタンド処理
        window.alert("You choiced \""+stand[0]+"\"."+"\n"+showHAND("player")+"\n"+showTOTAL("player")+"\n"+"Now's the dealer's turn.")
        dealerAction()//ディーラーの行動
    }else if(hit.includes(action)){//ヒット処理
        window.alert("You choiced \""+hit[0]+"\"."+"\n"+showHAND("player")+"\n"+showTOTAL("player"))
        actionHit()
    }else if(surrender.includes(action)){//サレンダー処理
        window.alert("You choiced \""+surrender[0]+"\"."+"\n"+showBET()+"\n"+"Now check the dealer's hand.")
        actionSurrender()
    }else if(doubleDown.includes(action)){//ダブルダウン処理
        if(pocket >= latch*2){//ダブルダウンするだけの所持金があるかどうか
            latch*=2//掛け金を2倍にする
            window.alert("You choiced \""+doubleDown[0]+"\"."+"\n"+showBET()+"\n"+showPOCKET()+"\n"+showHAND("player")+"\n"+showTOTAL("player"))
            window.alert("The card you drew is \""+drawCard("player")+"\"."+"\n"+showHAND("player")+"\n"+showTOTAL("player"))//プレイヤーが1枚カードを引き、引いたカードを見せる
            if(calculateSum("player") > 21){//プレイヤーがバーストなら強制バースト処理
                processResult("player")
                return
            }
            dealerAction()//強制スタンド
        }else{//ダブルダウンするだけの所持金がない場合、
            window.alert("You don't have money you choice \""+doubleDown[0]+"\".")
            declareAction()//もう一度行動を提示させる
        }
    }else if(insurance.includes(action)){//インシュアランス処理
        if(!countInsurance){//インシュアランスしたことがないなら
            if(dealerHand[0] == "A"){//ディーラーのアップカードがAかどうか
                if(pocket >= Math.ceil(latch*3/2)){//保険金を掛けるだけの所持金があるかどうか
                    insuranceMoney=Math.ceil(latch/2)//掛け金の半分を保険金に追加
                    window.alert("You choiced \""+insurance[0]+"\"."+"\n"+showBET()+"\n"+showPOCKET()+"\n"+showHAND("player")+"\n"+showTOTAL("player"))
                    if(checkNatural21("dealer")){//インシュアランス成功
                        let insuranceSentence:string=""//インシュアランス処理用の文章
                        if(checkNatural21("player")){//プレイヤーもナチュラルブラックジャックのとき、勝負は引き分けになるので、
                            pocket+=latch//保険として掛けた額の2倍がそのまま払い戻される
                            totalWin+=latch
                            insuranceSentence="Your hand is Natural Black Jack,too."
                            +"\n"+showHAND("player")
                            +"\n"+"You drew."
                        }else{//プレイヤーがナチュラルブラックジャックではないとき、勝負は負けになるので、保険金として掛けた額の2倍が払い戻されるが、ベットした額を失うので、収支は±0
                            insuranceSentence="You lost."+"\n"+showBET()+"\n"+"You lost "+latch+"$."
                        }
                        window.alert("The dealer's hand is Natural Black Jack."+"\n"+showHAND("dealer")+"\n"+insuranceSentence+"\n"+"The insurance reimburses.You get "+latch+"$ as insurance."+"\n"+"INSURANCE:"+insuranceMoney+"$"+"\n"+showPOCKET())
                        insuranceMoney=0
                        playTimes++
                        declareLatch()//次のゲームへ移行
                    }else{//インシュアランス失敗
                        pocket-=insuranceMoney
                        totalLose+=insuranceMoney
                        window.alert("The dealer's hand isn't Natural Black Jack."+"\n"+"INSURANCE:"+insuranceMoney+"$"+"\n"+"You lose "+insuranceMoney+"$ as insurance."+"\n"+showPOCKET())
                        insuranceMoney=0
                        countInsurance=true
                        declareAction()//もう一度行動を提示させる
                    }
                }else{//インシュアランスするだけの所持金がない場合、
                    window.alert("You don't have money you choice \""+insurance[0]+"\".")
                    declareAction()//もう一度行動を提示させる
                }
            }else{//ディーラーのアップカードがAではない場合、
                    window.alert("The dealer's the UP CARD isn't \"A\".")
                    declareAction()//もう一度行動を提示させる
            }
         }else{//インシュアランス既にしてるなら
            window.alert("You've even chosen \""+insurance[0]+"\".")
            declareAction()//もう一度行動を提示させる
         }
    }else if(split.includes(action)){//スプリット処理
        if(playerHand[0]==playerHand[1] && playerHand.length==2){//スプリットできる手札かどうか
            if(splitPhase==0){//スプリットしたことがないか

            }else{//スプリットしたことがある場合、
                window.alert("Sorry,you can only choice \""+split[0]+"\" once in this program.")
                dealerAction()//もう一度行動を提示させる
            }
        }else{//スプリットできる手札ではない場合、
            window.alert("Your hand isn't the hand you can choice \""+split[0]+"\".")
            dealerAction()//もう一度行動を提示させる
        }
    }else{//不正なコマンド処理
        window.alert("Please enter a \"Valid action\".")
        declareAction()
    }
    return
}

function actionHit(){//ヒットする処理
    window.alert("The card you drew is \""+drawCard("player")+"\"."+"\n"+showHAND("player")+"\n"+showTOTAL("player"))//プレイヤーがカードを引き、引いたカードを見せる
    declareAction()
}

function actionSurrender(){//サレンダーする処理
    if(checkNatural21("dealer")){//ディーラーの手札がナチュラルブラックジャックならサレンダー失敗
        window.alert("The dealer's hand is Natural Black Jack."+"\n"+showHAND("dealer")+"\n"+"You can't fold this game.")
        processMoney("lose")
    }else{
        window.alert("You challenge \""+surrender[0]+"\"."+"\n"+showHAND("dealer")+"\n"+"You fold this game.")
        processMoney("surrender")
    }
}

/* 手札がナチュラルブラックジャックか判断するメソッド */
function checkNatural21(side:string):boolean|undefined{
    if(side == "player"){
        return (playerHand.length == 2 && calculateSum("player") == 21)
    }else if(side == "dealer"){
        return (dealerHand.length == 2 && calculateSum("dealer") == 21)
    }
}

/* ★6.ディーラーの行動を処理するメソッド */
function dealerAction():void{
    window.alert(showHAND("dealer")+"\n"+showTOTAL("dealer")+"\n"+showHAND("player")+"\n"+showTOTAL("player"))
    while(calculateSum("dealer") < 17){//ディーラーの合計数が17に届いていない間、ディーラーがカードを引き続ける
        window.alert("The card the dealer drew is \""+drawCard("dealer")+"\"."+"\n"+showHAND("dealer")+"\n"+showTOTAL("dealer")+"\n"+showHAND("player")+"\n"+showTOTAL("player"))//ディーラーがカードを引き、引いたカードを見せる
    }
    if(calculateSum("dealer") > 21 && checkNatural21("player") == false){//ディーラーのバースト処理(プレイヤーがナチュラルブラックジャックの場合は行わない)
        processResult("dealer")
    }else{
        battle()
    }
    return
}

/* ★7.勝負するメソッド */
function battle():void{
        if(checkNatural21("player") == true && checkNatural21("dealer") == false){//プレイヤーのみがナチュラルブラックジャックの場合の処理
            processResult("natural21")
        }else{
            if(calculateSum("player") == calculateSum("dealer")){//引き分け処理
                if(checkNatural21("player") == false && checkNatural21("dealer") == true){//プレイヤーとディーラーの手札の数が同じで、ディーラーのみがナチュラルブラックジャックの場合、プレイヤーが21でもプレイヤーの敗北
                    processResult("natural21Dealer")
                }else{
                    processResult("draw")
                }
            }else if(calculateSum("player") > calculateSum("dealer")){//プレイヤー勝利処理
                processResult("win")
            }else{//ディーラー勝利処理
                processResult("lose")
            }
        }
}

/* 結果を処理するメソッド */
function processResult(result:string):void{
//burstSide(player or dealer),win,lose,draw,natural21の6つが入る
const dealerInformation:string=showHAND("dealer")+"\n"+showTOTAL("dealer")
const playerInformation:string=showHAND("player")+"\n"+showTOTAL("player")
    if(result == "natural21"){//プレイヤーナチュラルブラックジャック処理
        window.alert("Your hand is Natural Black Jack."+"\n"+dealerInformation+"\n"+playerInformation)
        processMoney(result)
    }else if(result == "natural21Dealer"){//ディーラーナチュラルブラックジャック処理
        window.alert("The dealer's hand is Natural Black Jack."+"\n"+dealerInformation+"\n"+playerInformation)
        processMoney("lose")
    }else if(result == "player"){//プレイヤーバースト処理
        window.alert("You burst."+"\n"+playerInformation)
        processMoney("lose")
    }else if(result == "dealer"){//ディーラーバースト処理
        window.alert("The dealer bursts."+"\n"+dealerInformation)
        processMoney("win")
    }else if(result == "win"){//勝利処理
        window.alert("Your hand is stronger than the dealer's hand."+"\n"+dealerInformation+"\n"+playerInformation)
        processMoney(result)
    }else if(result == "lose"){//敗北処理
        window.alert("Your hand is weaker than the dealer's hand."+"\n"+dealerInformation+"\n"+playerInformation)
        processMoney(result)
    }else if(result == "draw"){//引き分け処理
        window.alert("Your hand is as strong as the deale's hand."+"\n"+dealerInformation+"\n"+playerInformation)
        processMoney(result)
    }else{

    }
    return
}

/* 所持金を増減させるメソッド */
function processMoney(fluctuation:string):void{
    if(fluctuation == "natural21"){//ナチュラルブラックジャック処理
        pocket+=latch*1.5
        totalWin+=latch*1.5
        window.alert("You won."+"\n"+showBET()+"\n"+"You won "+latch*1.5+"$."+"\n"+showPOCKET())
    }else if(fluctuation == "win"){//勝利処理
        pocket+=latch
        totalWin+=latch
        window.alert("You won."+"\n"+showBET()+"\n"+"You won "+latch+"$."+"\n"+showPOCKET())
    }else if(fluctuation == "lose"){//敗北処理
        pocket-=latch
        totalLose+=latch
        window.alert("You lost."+"\n"+showBET()+"\n"+"You lost "+latch+"$."+"\n"+showPOCKET())
        if(pocket <= 0){//所持金が0の場合、ゲームを終了
            window.alert("You have no money."+"\n"+"Game Ends.")
            playTimes++
            endBlackJack()
            return
        }
    }else if(fluctuation == "draw"){//引き分け処理
        window.alert("You drew."+"\n"+showPOCKET())
    }else if(fluctuation == "surrender"){//サレンダー処理
        pocket-=Math.ceil(latch/2)//所持金を掛け金の半分(切り上げ)失う処理
        totalLose+=Math.ceil(latch/2)
        window.alert("You surrender."+"\n"+showBET()+"\n"+"You lost "+Math.ceil(latch/2)+"$."+"\n"+showPOCKET())
    }else{

    }
    playTimes++
    declareLatch()
}



/* 一番最初の処理(ソースコード内の「★」コメントがついた処理は先に進む処理です) */
declareLatch()//★1.掛け金を提示
/* 
【目次】
endBlackJack()//★0.ブラックジャックゲームを終了)
declareLatch()//★1.掛け金を提示
bet("latch")//ベットする
makeDeck()//★2.山札を作成
dealCard()//★3.プレイヤーとディーラーにカードを配る
drawCard("drawSide"):drawCard//カードを引く
declareAction()//★4.行動を提示
show~()//色々表示
showTOTAL("totalSide")//合計数を表示,初期値はプレイヤーをタグなし表示
showHAND("handSide")//手札を表示
calculateSum("calSide")//手札の合計数を計算
playerAction("action")//★5.プレイヤーの行動を処理
checkNatural21("21Side")//手札がブラックジャックは判断
dealerAction()//★6.ディーラーの行動を処理
battle("burstSide")//★7.勝負するメソッド
processResult("result")//結果を処理するメソッド
 */

console.log("*program end")