<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class game_player extends Model
{
    //
    protected $fillable = [
        'game_id', 'player_id', 'score',
    ];
}
