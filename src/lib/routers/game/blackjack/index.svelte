<script>
    import { BlackjackGame } from './game.js'
    let game = new BlackjackGame()
    let gameIsStarted = false
    $: dealerScore = game.dealerScore
    $: playerScore = game.playerScore
    $: gameStatus = game.gameResult
    function StartGame(){
        game = new BlackjackGame()
        gameIsStarted = true
        game.start()
    }
    function Hit(){
        game.hit()
        UpdateGame()
    }
    function Stand(){
        game.stand()
        UpdateGame()
    }
    function UpdateGame(){
        gameStatus = game.gameResult
        dealerScore = game.dealerScore
        playerScore = game.playerScore
    }

</script>
<div>
    <h1>Blackjack</h1>
    <h2>Game Status: {gameStatus}</h2>
    <p>{dealerScore}</p>
    <p>{playerScore}</p>
    <button on:click={StartGame}>Start</button>
    <button on:click={Hit}>Hit</button>
    <button on:click={Stand}>Stand</button>

<!--    <button on:click={}>Hit</button>
    <button on:click={}>Stand</button>
    <button on:click={gameLoop(game.double)}>Double</button>
    <button on:click={gameLoop(game.surrender)}>Surrender</button>-->
    <!-- <button on:click={game.insurance}>Insurance</button>
    <button on:click={game.reset}>Reset</button>
    <button on:click={game.deal}>Deal</button>
    <button on:click={game.end}>End</button> 
    <button on:click={game.split}>Split</button>

    -->

</div>