<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\game_player;
use App\Game;

class GameController extends Controller
{
    //
    public function index(){
        return view('game');
    }

    public function GetScores(){
        $puntuaciones = [
            'puntuaciones' => game_player::selectRaw('game_players.game_id, 
                                          game_players.score, 
                                          game_players.player_id,
                                          game_players.salud,
                                          users.name')
                                        ->join('games', 'games.id', '=', 'game_players.game_id')
                                        ->join('users', 'users.id', '=', 'games.user_id')
                                        ->orderBy('score', 'desc')
                                        ->orderBy('game_players.game_id')
                                        ->get(),
        ];

        return view('scores', $puntuaciones);
    }

    public function SetScore(Request $request){
        $scores = game_player::create([
            'game_id' => $request->input('gameId'),
            'player_id' => $request->input('playerId'),
            'score' => $request->input('score'),
            'salud' => $request->input('salud'),
        ]);
        return response()->json(['scores' => $scores]);
    }

    public function CreateGame(Request $request){
        $game = Game::create([
            'map_type' => $request->input('mapType'),
            'user_id' => Auth::user()->id, 
        ]); 
        return response()->json(['game' => $game]);
    }
}
