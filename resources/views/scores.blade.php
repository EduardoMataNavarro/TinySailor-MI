@extends('layouts.app')

@section('content')
    <div class="container-fluid">
        <table class="table">
            <thead class="bg-success">
                <th scope="col"># juego</th>
                <th scope="col">Usuario</th>
                <th scope="col">Id jugador</th>
                <th scope="col">Score</th>
            </thead>
            <tbody>
                @foreach( $puntuaciones as $puntuacion )
                <th scope="row"> {{ $puntuacion->game_id }} </th>
                <td> {{ $puntuacion->name }} </td>
                <td> {{ $puntuacion->player_id }} </td>
                <td> {{ $puntuacion->score }} </td>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection