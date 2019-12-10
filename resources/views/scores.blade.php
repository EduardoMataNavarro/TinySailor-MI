@extends('layouts.app')

@section('content')
    <div class="container-fluid">
        <table class="table">
            <thead class="bg-primary table-dark">
                <th scope="col"># juego</th>
                <th scope="col">Usuario</th>
                <th scope="col">Id jugador</th>
                <th scope="col">Score</th>
            </thead>
            <tbody>
                @isset( $puntuaciones )
                @foreach( $puntuaciones as $puntuacion )
                <th scope="row"> {{ $puntuacion->game_id }} </th>
                <td> {{ $puntuacion->name }} </td>
                <td> {{ $puntuacion->player_id }} </td>
                <td> {{ $puntuacion->score }} </td>
                @endforeach
                @endif
            </tbody>
        </table>
    </div>
@endsection