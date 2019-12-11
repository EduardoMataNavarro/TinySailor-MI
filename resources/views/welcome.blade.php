@extends('layouts.app')

@section('content')
    <div class="w-100" id="main-banner">
			<h5 class="banner-text"><a href="/game">JUGA AHORA!</a></h5>
		</div>
		<div class="container">
			<h2 class="title">Conoce el juego</h2>
			<div class="row">
				<div class="col-sm-12 col-md-6">
					<img src="{{ asset('img/tinyboat.png') }}" alt="">
				</div>
				<div class="col-sm-12 col-md-6">
					Juega contra el tiempo, recoge los sacos de comida antes de que se acabe el tiempo.
					<br><br>
					Ve de punto A a punto B, desafíate a ti mismo o a tus amigos en este emocionante juego.
					<br><br>
					El tiempo es tu mayor enemigo, junto a las piedras y a los cocodrilos que tratarán de comerse la comida que capturaste.
					<br><br>
					Comparte con tus amigos la experiencia y juega con ellos hasta el fin de los tiempos.
					<br><br>
				</div>
			</div>
		</div>
		<div class="container-fluid">
			<div class="row">
				<div class="col-12" id="play-now-banner">
					<h1 class="banner-text"><a href="/game">DA CLICK AQUÍ PARA INICIAR A JUGAR!</a></h1>
				</div>
			</div>
		</div>
@endsection